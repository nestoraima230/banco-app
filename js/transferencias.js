document.addEventListener("DOMContentLoaded", () => {
  const transferForm = document.getElementById("transferForm");
  const transferButton = document.getElementById("transferButton");
  const senderEmailField = document.getElementById("sender");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  console.log(user);  
  if (user && user.balance) {
    console.log("Saldo del usuario:", user.balance);
  } else {
    console.log("No se encontró el saldo del usuario");
  }

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
      alert("Monto inválido o saldo insuficiente.");
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

});
