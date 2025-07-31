// login.js
const validStudents = [
  { email: "student1@xveritas.ac", password: "pass123", portal: "student-portal.html" },
  { email: "staff1@xveritas.ac", password: "staffpass", portal: "staff-portal.html" },
];

document.getElementById("studentLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  const user = validStudents.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = user.portal; // Redirect to correct portal
  } else {
    document.getElementById("studentLoginMessage").textContent = "Invalid credentials.";
  }
});
