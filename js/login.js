// Función para obtener datos del sessionStorage
function getSessionData(key) {
    return sessionStorage.getItem(key);
  }
  
  // Función para establecer datos en el sessionStorage
  function setSessionData(key, value) {
    sessionStorage.setItem(key, value);
  }
  
  // Función para eliminar datos del sessionStorage
  function clearSessionData() {
    sessionStorage.clear();
  }
  
  // Verificar si ya hay un token en sessionStorage al cargar la página
  window.onload = function() {
    const token = getSessionData('token');
    if (token) {
      window.location.href = 'dashboard.html';  // Redirigir al dashboard si el token está presente
    }
  };
  
  // Manejo del formulario de login
  document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    // Validar los campos de correo y contraseña
    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Mostrar un mensaje de carga mientras se realiza la petición
    const loginButton = document.getElementById('submit-button');
    loginButton.disabled = true;
    loginButton.textContent = 'Iniciando sesión...';
  
    try {
      const response = await fetch('https://api-bank-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Guardar el token y la información del usuario en sessionStorage
        setSessionData('token', result.token);
        setSessionData('nombre', result.first_name);
        setSessionData('correo', result.email);
        setSessionData('saldo', result.balance);
  
        alert('Inicio de sesión exitoso');
        window.location.href = 'dashboard.html';  // Redirigir al dashboard
      } else {
        alert(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      loginButton.disabled = false;  // Habilitar nuevamente el botón de login
      loginButton.textContent = 'Iniciar sesión';  // Restaurar texto del botón
    }
  });
  