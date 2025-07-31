const bcrypt = require('bcrypt');

async function hashPassword(pw) {
  const hash = await bcrypt.hash(pw, 10);
  console.log(hash);
}

hashPassword('password123');  // replace with your password
