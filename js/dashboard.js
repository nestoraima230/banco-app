document.addEventListener('DOMContentLoaded', function() {

  const nombre = localStorage.getItem('nombre');
  const correo = localStorage.getItem('correo');
  const saldo = localStorage.getItem('saldo');

  if (nombre && correo && saldo) {
    document.getElementById('nombre-usuario').innerText = `Bienvenido, ${nombre}`;
    document.getElementById('correo-usuario').innerText = `Correo: ${correo}`;
    document.getElementById('saldo-usuario').innerText = `$${parseFloat(saldo).toFixed(2)}`;
  } else {
    alert('Por favor, inicia sesión.');
    window.location.href = 'login.html';
  }
});

function cerrarSesion() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
    localStorage.removeItem('saldo');
    window.location.href = 'registro.html';  
  }
}
