document.addEventListener("DOMContentLoaded", () => {
    const transferForm = document.getElementById("transferForm");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users"));
  
    transferForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const recipientEmail = document.getElementById("recipient").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const message = document.getElementById("message").value;
  
      if (amount <= 0 || amount > user.balance) {
        alert("Monto inválido.");
        return;
      }
  
      const recipient = users.find(u => u.email === recipientEmail);
      if (!recipient) {
        alert("Usuario no encontrado.");
        return;
      }
  
      user.balance -= amount;
      recipient.balance += amount;
  
      user.transactions.push({ date: new Date().toISOString().split("T")[0], type: "gasto", amount, description: Transferencia a ${recipientEmail} });
      recipient.transactions.push({ date: new Date().toISOString().split("T")[0], type: "ingreso", amount, description: Transferencia de ${user.email} });
  
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Transferencia realizada con éxito.");
      transferForm.reset();
    });
  });