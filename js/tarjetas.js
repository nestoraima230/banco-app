document.addEventListener("DOMContentLoaded", () => {
  const addCardForm = document.getElementById("addCardForm");
  const cardList = document.getElementById("cardList");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  // Función para obtener tarjetas del servidor
  const fetchCards = async () => {
    try {
      const response = await fetch(`https://api-bank-production.up.railway.app/cards/${user.id}`);
      const cards = await response.json();
      renderCards(cards);
    } catch (error) {
      console.error("Error al obtener las tarjetas:", error);
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
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;

    const cardData = {
      user_id: user.id,
      card_number: cardNumber,
      expiration_date: expiryDate,
      cvv: cvv,
    };

    try {
      const response = await fetch('https://api-bank-production.up.railway.app/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Tarjeta agregada con éxito.");
        fetchCards(); 
      } else {
        alert("Error al agregar la tarjeta: " + result.message);
      }
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
    }

    addCardForm.reset();
  });

  fetchCards();
});
