document.getElementById('formRegistro').addEventListener('submit', async function (event) {
  event.preventDefault();

  const firstName = document.getElementById('nombre').value.trim();
  const lastName = document.getElementById('segundoNombre').value.trim() || null;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!firstName || !email || !password) {
    alert("Por favor, complete todos los campos requeridos.");
    return;
  }

  try {
    const response = await fetch('https://api-bank-production.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password 
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Registro exitoso');
      window.location.href = 'login.html';
    } else {
      alert(result.error || 'Error al registrar el usuario. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    alert('Error al registrar usuario. Intenta nuevamente más tarde.');
  }
});
