document.addEventListener('DOMContentLoaded', function () {
  function verificarDatos() {
    const nombre = sessionStorage.getItem('nombre');
    const correo = sessionStorage.getItem('correo');
    const saldo = sessionStorage.getItem('saldo');

    if (nombre && correo && saldo) {
      document.getElementById('nombre-usuario').innerText = `Bienvenido, ${nombre}`;
      document.getElementById('correo-usuario').innerText = `Correo: ${correo}`;
      document.getElementById('saldo-usuario').innerText = `$${parseFloat(saldo).toFixed(2)}`;
    } else {
      setTimeout(verificarDatos, 100); 
    }
  }

  verificarDatos(); 

  setTimeout(() => {
    if (!sessionStorage.getItem('nombre') || !sessionStorage.getItem('correo') || !sessionStorage.getItem('saldo')) {
      alert('Por favor, inicia sesión.');
      window.location.href = 'login.html';
    }
  }, 3000); 
});

function cerrarSesion() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
}
