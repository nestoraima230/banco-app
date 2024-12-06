document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, ingresa un correo electrónico válido.");
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

    console.log(result);

    if (response.ok) {
      const userData = {
        first_name: result.first_name,  
        email: email,            
        balance: result.accountBalance,  
        id: result.accountId                            
      };

      console.log(userData); 

      localStorage.setItem('currentUser', JSON.stringify(userData));

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
