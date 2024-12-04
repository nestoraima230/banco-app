document.addEventListener("DOMContentLoaded", () => {
    const addCardForm = document.getElementById("addCardForm");
    const cardList = document.getElementById("cardList");
    const user = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!user) {
      alert("Debe iniciar sesión.");
      window.location.href = "index.html";
      return;
    }
  
    const renderCards = () => {
      cardList.innerHTML = "";
      user.cards?.forEach((card, index) => {
        const li = document.createElement("li");
        li.textContent = Tarjeta terminada en ${card.number.slice(-4)};
        cardList.appendChild(li);
      });
    };
  
    addCardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cardNumber = document.getElementById("cardNumber").value;
      const expiryDate = document.getElementById("expiryDate").value;
      const cvv = document.getElementById("cvv").value;
  
      if (!user.cards) user.cards = [];
      user.cards.push({ number: cardNumber, expiry: expiryDate, cvv });
      localStorage.setItem("currentUser", JSON.stringify(user));
  
      renderCards();
      alert("Tarjeta agregada con éxito.");
      addCardForm.reset();
    });
  
    renderCards();
  });