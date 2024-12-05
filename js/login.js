document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const loginButton = document.getElementById('submit-button');
  loginButton.disabled = true;
  loginButton.textContent = 'Iniciando sesión...';

  try {
    const response = await fetch('https://api-bank-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      sessionStorage.setItem('nombre', result.first_name);
      sessionStorage.setItem('correo', result.email);
      sessionStorage.setItem('saldo', result.balance);

      alert('Inicio de sesión exitoso');
      window.location.href = 'dashboard.html'; 
    } else {
      alert(result.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  }
});
