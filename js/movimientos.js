document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const transactionList = document.getElementById("transactionList");
  const filterType = document.getElementById("filter-type");
  const filterDate = document.getElementById("filter-date");

  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  const renderTransactions = (transactions) => {
    transactionList.innerHTML = ""; 

    transactions.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.amount}</td>
        <td>${tx.type}</td>
        <td>${tx.description}</td>
      `;
      transactionList.appendChild(tr);
    });
  };

  const getTransactions = async (filter = {}) => {
    const params = new URLSearchParams();

    if (filter.date) {
      params.append("date", filter.date);
    }

    if (filter.type && filter.type !== "all") {
      params.append("type", filter.type);
    }

    try {
      const response = await fetch(`https://api-bank-production.up.railway.app/movements/filtered?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}` // Enviar el token de autenticación
        }
      });

      if (!response.ok) {
        throw new Error("Error al obtener los movimientos");
      }

      const movements = await response.json();
      renderTransactions(movements);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al cargar los movimientos.");
    }
  };

  filterType.addEventListener("change", () => {
    getTransactions({
      type: filterType.value,
      date: filterDate.value,
    });
  });

  filterDate.addEventListener("change", () => {
    getTransactions({
      type: filterType.value,
      date: filterDate.value,
    });
  });

  // Cargar los movimientos cuando la página se carga
  getTransactions();
});
