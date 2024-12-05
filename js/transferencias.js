document.addEventListener("DOMContentLoaded", () => {
  const transferForm = document.getElementById("transferForm");
  const transferButton = document.getElementById("transferButton");
  const senderEmailField = document.getElementById("sender");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Verificar que el objeto `user` esté bien cargado y que `balance` sea válido
  console.log(user);  // Verifica si el usuario está cargado correctamente
  if (user && user.balance) {
    console.log("Balance del usuario:", user.balance);
  } else {
    console.log("No se encontró balance del usuario o el objeto `user` es inválido");
  }

  // Rellenar el campo de correo del remitente si está disponible
  if (user && user.email) {
    senderEmailField.value = user.email;
  }

  transferForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recipientEmail = document.getElementById("recipient").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const message = document.getElementById("message").value;

    console.log("Monto ingresado:", amount);

    if (!user || !user.balance || amount <= 0 || amount > user.balance) {
      alert("Monto inválido o balance insuficiente.");
      return;
    }

    transferButton.disabled = true;
    transferButton.innerText = "Procesando...";

    try {
      const response = await fetch('https://api-bank-production.up.railway.app/api/transaction/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderEmail: user.email,
          receiverEmail: recipientEmail,
          amount,
          description: message,
        }),
      });

      if (response.ok) {
        const result = await response.json(); 
        alert(result.message);
        user.balance -= amount;
        localStorage.setItem("currentUser", JSON.stringify(user)); 

        actualizarTabla(result.transaction);
      } else {
        const errorResult = await response.json(); 
        alert(errorResult.error); 
      }
    } catch (error) {
      alert('Error al realizar la transferencia: ' + error.message);
    } finally {
      transferButton.disabled = false;
      transferButton.innerText = "Realizar Transferencia";
    }

    transferForm.reset(); 
  });

  function actualizarTabla(transaccion) {
    const table = document.getElementById("tablaMovimientos");
    const newRow = table.insertRow();

    newRow.innerHTML = `
      <td>${transaccion.senderEmail}</td>
      <td>${transaccion.receiverEmail}</td>
      <td>${transaccion.amount}</td>
      <td>${transaccion.description || 'Sin mensaje'}</td>
      <td>${new Date(transaccion.date).toLocaleString()}</td>
    `;
  }
});
