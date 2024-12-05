document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.querySelector("form");
  const paymentMethod = document.getElementById("payment-method");

  const userId = localStorage.getItem("userId"); 

  if (!userId) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedMethod = paymentMethod.value;
    const amount = parseFloat(document.getElementById("amount").value);
    const description = `Pago realizado con ${selectedMethod === "saldo" ? "saldo" : "tarjeta"}`;

    const payload = {
      userId,
      paymentMethodId: selectedMethod === "saldo" ? 1 : 2, // 1: Saldo, 2: Tarjeta
      amount,
      description,
      cardId: selectedMethod === "tarjeta" ? getCardIdFromSelection() : null,
    };

    try {
      const response = await fetch("https://api-bank-production.up.railway.app/api/payments/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Pago realizado con éxito.");
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
