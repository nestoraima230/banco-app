document.addEventListener("DOMContentLoaded", function () {
  const paymentForm = document.getElementById("payment-form");
  const paymentMethod = document.getElementById("payment-method");
  const serviceSelect = document.getElementById("service");
  const amountInput = document.getElementById("amount");

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log("currentUser:", currentUser);

  if (!currentUser || !currentUser.id) {
    alert("Debe iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  async function loadServices() {
    try {
      const response = await fetch("https://api-bank-production.up.railway.app/api/services");
      const services = await response.json();

      serviceSelect.innerHTML = ''; 
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Seleccionar Servicio';
      serviceSelect.appendChild(defaultOption);

      services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.service_id;
        option.textContent = service.service_name;
        serviceSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar los servicios:', error);
      alert('Error al cargar los servicios');
    }
  }

  async function loadCards() {
    try {
      const response = await fetch("https://api-bank-production.up.railway.app/api/cards");
      const cards = await response.json();

      const saldoOption = paymentMethod.querySelector('option[value="saldo"]');
      paymentMethod.innerHTML = '';
      if (saldoOption) paymentMethod.appendChild(saldoOption);

      cards.forEach(card => {
        const option = document.createElement("option");
        option.value = "tarjeta";
        option.dataset.cardId = card.card_id; 
        option.textContent = `Tarjeta terminada en ${card.card_number.slice(-4)}`;
        paymentMethod.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar las tarjetas:', error);
      alert('No se pudieron cargar las tarjetas.');
    }
  }

  loadServices();
  loadCards();

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedMethod = paymentMethod.value;
    const selectedService = serviceSelect.value;
    const amount = parseFloat(amountInput.value);
    const cardId = selectedMethod === "tarjeta" ? getCardIdFromSelection() : null;
    const description = `Pago realizado con ${selectedMethod === "saldo" ? "saldo" : "tarjeta"}`;

    if (!selectedService) {
      alert("Por favor, selecciona un servicio.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    if (selectedMethod === "tarjeta" && !cardId) {
      alert("Por favor, selecciona una tarjeta válida.");
      return;
    }

    const payload = {
      userId: currentUser.id,
      paymentMethodId: selectedMethod === "saldo" ? 1 : 2,
      amount,
      description,
      serviceId: selectedService,
      cardId,
    };

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
      console.error("Error:", error);
      alert(error.message);
    }
  });

  function getCardIdFromSelection() {
    const selectedOption = paymentMethod.options[paymentMethod.selectedIndex];
    return selectedOption.dataset.cardId || null;
  }
});
