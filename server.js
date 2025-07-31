const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files directly from the current directory (__dirname)
app.use(express.static(__dirname));

// SQLite Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) console.error('DB error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT
  )
`);

// Register new user
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      [email, hashedPassword, role],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(409).send('Email already registered.');
          }
          return res.status(500).send('Database error.');
        }
        res.status(201).send('User registered successfully.');
      }
    );
  } catch {
    res.status(500).send('Server error.');
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Missing email or password.');

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).send('Database error.');
    if (!user) return res.status(401).send('Invalid email or password.');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).send('Invalid email or password.');

    res.json({ message: 'Login successful', role: user.role });
  });
});

// Static HTML Routes (serve files from current directory)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/academics', (req, res) => res.sendFile(path.join(__dirname, 'academics.html')));
app.get('/admissions', (req, res) => res.sendFile(path.join(__dirname, 'admissions.html')));
app.get('/studentlife', (req, res) => res.sendFile(path.join(__dirname, 'student-life.html')));

// Resume Upload Setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

// Application form POST route
app.post('/submit-application', upload.single('resume'), (req, res) => {
  const data = req.body;
  const resumeFileName = req.file ? req.file.filename : null;
  const applicationsFile = path.join(__dirname, 'applications.json');

  let applications = [];
  if (fs.existsSync(applicationsFile)) {
    try {
      applications = JSON.parse(fs.readFileSync(applicationsFile, 'utf-8'));
    } catch (err) {
      console.error('Error parsing applications.json:', err);
    }
  }

  applications.push({ ...data, resumeFile: resumeFileName, submittedAt: new Date().toISOString() });

  fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));

  res.send(`<h2>Application Received</h2><p>Thank you, ${data.name}</p><a href="/">Return Home</a>`);
});

// Contact form POST route
app.post('/contact', (req, res) => {
  const data = req.body;
  const contactFile = path.join(__dirname, 'contactMessages.json');

  let messages = [];
  if (fs.existsSync(contactFile)) {
    try {
      messages = JSON.parse(fs.readFileSync(contactFile, 'utf-8'));
    } catch (err) {
      console.error('Error parsing contactMessages.json:', err);
    }
  }

  messages.push({ ...data, submittedAt: new Date().toISOString() });

  fs.writeFileSync(contactFile, JSON.stringify(messages, null, 2));

  res.send(`<h2>Message Received</h2><p>Thank you, ${data.name}</p><a href="/contact">Back</a>`);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
