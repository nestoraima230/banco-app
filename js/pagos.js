document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("paymentForm");
    const paymentMethod = document.getElementById("paymentMethod");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const user = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!user) {
      alert("Debe iniciar sesión.");
      window.location.href = "index.html";
      return;
    }
    if (user.cards?.length > 0) {
      user.cards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.number;
        option.textContent = Tarjeta terminada en ${card.number.slice(-4)};
        paymentMethod.appendChild(option);
      });
    }
  
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedMethod = paymentMethod.value;
      const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);
  
      if (selectedMethod === "saldo") {
        if (paymentAmount > user.balance) {
          alert("Saldo insuficiente.");
          return;
        }
  
        user.balance -= paymentAmount;
        user.transactions.push({
          date: new Date().toISOString().split("T")[0],
          type: "gasto",
          amount: paymentAmount,
          description: "Pago realizado con saldo",
        });
      } else {
        user.transactions.push({
          date: new Date().toISOString().split("T")[0],
          type: "gasto",
          amount: paymentAmount,
          description: Pago realizado con tarjeta terminada en ${selectedMethod.slice(-4)},
        });
      }
  
      localStorage.setItem("currentUser", JSON.stringify(user));
      confirmationMessage.textContent = "Pago realizado con éxito.";
      confirmationMessage.style.display = "block";
      paymentForm.reset();
    });
  });