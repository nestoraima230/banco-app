document.addEventListener('DOMContentLoaded', function () {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    alert('Por favor, inicia sesión.');
    window.location.href = 'login.html';  
    return; 
  }

  document.getElementById('correo-usuario').innerText = `Correo: ${currentUser.email}`;
  document.getElementById('saldo-usuario').innerText = `$${parseFloat(currentUser.balance).toFixed(2)}`;
});

function cerrarSesion() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.clear();

    window.location.href = 'login.html';
  }
}
