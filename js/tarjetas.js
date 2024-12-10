document.addEventListener("DOMContentLoaded", () => {
  const addCardForm = document.getElementById("addCardForm");
  const cardList = document.getElementById("cardList");

  const user = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Usuario cargado desde localStorage:", user);

  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "login.html";  
    return;
  }

  document.getElementById("user-id").value = user.id;

  const fetchCards = async () => {
    try {
      if (!user.id) {
        console.error("ID de usuario no disponible.");
        alert("ID de usuario no encontrado.");
        return;
      }

      const url = `https://api-bank-production.up.railway.app/api/cards/${user.id}`;
      console.log('Solicitando tarjetas a:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      const cards = JSON.parse(responseText);

      renderCards(cards);
    } catch (error) {
      console.error("Error al obtener las tarjetas:", error);
      alert("Hubo un problema al obtener las tarjetas.");
    }
  };

  const renderCards = (cards) => {
    cardList.innerHTML = "";
    cards.forEach(card => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = `Tarjeta terminada en ${card.card_number.slice(-4)}`;
      cardList.appendChild(li);
    });
  };

  addCardForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    let cardNumber = document.getElementById("card-number").value.trim();
    const expiryDate = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;
    const accountId = document.getElementById("account-id").value;
    const cardTypeId = document.getElementById("card-type-id").value;
  
    cardNumber = cardNumber.replace(/\s+/g, '');
  
    if (!cardNumber || !expiryDate || !cvv || !accountId || !cardTypeId) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const cardData = {
      user_id: user.id,
      card_number: cardNumber,
      expiration_date: expiryDate,
      cvv: cvv,
      account_id: accountId,
      card_type_id: cardTypeId
    };
  
    try {
      console.log("Enviando datos de la tarjeta:", cardData);  
      const response = await fetch('https://api-bank-production.up.railway.app/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, 
        },
        body: JSON.stringify(cardData),
      });
  
      const result = await response.json();
      console.log("Resultado de la respuesta:", result);
  
      if (response.ok) {
        alert("Tarjeta agregada con éxito.");
        fetchCards();
      } else {
        alert("Error al agregar la tarjeta: " + (result.message || result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
      alert("Error al conectar con el servidor");
    }
  
    addCardForm.reset();
  });
  

  fetchCards();
});