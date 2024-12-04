document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
  

    let users = JSON.parse(localStorage.getItem("users")) || [];
  
  
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("emailRegister").value;
      const password = document.getElementById("passwordRegister").value;
  
      if (users.some(user => user.email === email)) {
        alert("Este correo ya está registrado.");
        return;
      }
  
      users.push({ fullName, email, password, balance: 0, transactions: [] });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registro exitoso. Ahora puede iniciar sesión.");
      registerForm.reset();
    });
  

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("emailLogin").value;
      const password = document.getElementById("passwordLogin").value;
  
      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        alert("Inicio de sesión exitoso.");
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    });
  });