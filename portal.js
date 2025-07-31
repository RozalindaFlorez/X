document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("href").substring(1);
      document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
      document.getElementById(target).style.display = "block";
    });
  });
  
  function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "/login.html";
  }
  
  function uploadDocument() {
    const file = document.getElementById("uploadAssignment").files[0];
    if (file) {
      alert("Uploaded: " + file.name);
      // Send to server using fetch or FormData
    }
  }
  
  function sendMessage() {
    const msg = document.getElementById("messageInput").value;
    const thread = document.getElementById("messageThread");
    if (msg.trim()) {
      thread.innerHTML += `<div class="student-msg">${msg}</div>`;
      document.getElementById("messageInput").value = "";
      // In a real app, POST to server
    }
  }
  