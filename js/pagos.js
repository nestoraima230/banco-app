document.addEventListener("DOMContentLoaded", function () {
  const paymentForm = document.getElementById("payment-form");
  const paymentMethod = document.getElementById("payment-method");

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log("currentUser:", currentUser); // Para depuración

  if (!currentUser || !currentUser.accountId) {
    alert("Debe iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedMethod = paymentMethod.value;
    const amount = parseFloat(document.getElementById("amount").value);
    const description = `Pago realizado con ${selectedMethod === "saldo" ? "saldo" : "tarjeta"}`;

    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    const payload = {
      userId: currentUser.accountId,
      paymentMethodId: selectedMethod === "saldo" ? 1 : 2,
      amount,
      description,
      cardId: selectedMethod === "tarjeta" ? getCardIdFromSelection() : null,
    };

    console.log("Payload:", payload); // Depuración

    try {
      const response = await fetch("https://api-bank-production.up.railway.app/api/payments/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Pago realizado con éxito");
        paymentForm.reset();
      } else {
        throw new Error(result.error || "Error al realizar el pago.");
      }
    } catch (error) {
      alert(error.message);
    }
  });

  function getCardIdFromSelection() {
    const selectedOption = paymentMethod.options[paymentMethod.selectedIndex];
    return selectedOption.dataset.cardId || null;
  }
});
