document.getElementById('formRegistro').addEventListener('submit', async function(event) {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        first_name: firstName,   
        last_name: lastName,     
        email: email, 
        password: password 
      })
    });

    const result = await response.json();

    console.log('Respuesta de la API:', result);

    if (response.ok) {
      // Guardar información del usuario en localStorage
      localStorage.setItem('nombre', result.first_name || '');  // Asegúrate de que 'first_name' esté en la respuesta
      localStorage.setItem('correo', result.email || '');  // Asegúrate de que 'email' esté en la respuesta
      localStorage.setItem('saldo', result.balance || 0);  // Asegúrate de que 'balance' esté en la respuesta

      alert('Registro exitoso.');
      window.location.href = 'dashboard.html'; 
    } else {
      alert(result.message || 'Error al registrar usuario. Por favor, intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    alert('Error al conectar con el servidor. Por favor, intenta nuevamente más tarde.');
  }
});
