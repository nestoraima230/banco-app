document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));  
  const transactionList = document.getElementById("transactionList");
  const filterType = document.getElementById("filter-type");
  const filterDate = document.getElementById("filter-date");
  const clearFiltersButton = document.getElementById("clear-filters");
  const loadingIndicator = document.getElementById("loading");

  if (!user || !user.token) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html"; 
    return;
  }

  const typeMap = {
    income: 1,
    expense: 2,
    transfer: 3
  };

  const renderTransactions = (transactions) => {
    transactionList.innerHTML = "";
  
    if (transactions.length === 0) {
      transactionList.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No hay transacciones para mostrar.</td>
        </tr>`;
      return;
    }
  
    transactions.forEach((tx) => {
      const amount = parseFloat(tx.amount) || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(tx.transaction_date).toLocaleString("es-MX", {
          dateStyle: "short",
          timeStyle: "short",
        })}</td>
        <td class="${tx.transaction_type_id === 1 ? 'text-success' : 'text-danger'}">
          $${amount.toFixed(2)} <!-- Asegurarse que amount es numérico -->
        </td>
        <td>${
          tx.transaction_type_id === 1
            ? "Ingreso"
            : tx.transaction_type_id === 2
            ? "Gasto"
            : "Transferencia"
        }</td>
        <td>${tx.description || "Sin descripción"}</td>`;
      transactionList.appendChild(tr);
    });
  };
  
  const getTransactions = async (filter = {}) => {
    const params = new URLSearchParams();

    if (filter.type && filter.type !== "all") {
      params.append("type", typeMap[filter.type]);
    }

    if (filter.date) {
      const formattedDate = new Date(filter.date).toISOString().split('T')[0];  
      if (!isNaN(new Date(formattedDate))) {
        params.append("date", formattedDate);
      } else {
        console.error("Fecha inválida:", filter.date);
      }
    }

    const token = user.token;  

    if (!token) {
      alert("El token de usuario no está disponible. Por favor, inicie sesión.");
      return;
    }

    if (loadingIndicator) {
      loadingIndicator.classList.remove("d-none");  
    }

    try {
      console.log("Parámetros de la solicitud:", params.toString());  
      console.log("Token:", token); 

      const response = await fetch(`https://api-bank-production.up.railway.app/api/movements/filtered?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener los movimientos:", errorText);
        throw new Error(`Error al obtener los movimientos: ${errorText}`);
      }

      const movements = await response.json();
      console.log("Movimientos recibidos:", movements); 
      renderTransactions(movements);  
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al cargar los movimientos.");
    } finally {
      if (loadingIndicator) {
        loadingIndicator.classList.add("d-none");  
      }
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

  clearFiltersButton.addEventListener("click", () => {
    filterType.value = "all";
    filterDate.value = "";
    getTransactions(); 
  });

  getTransactions(); 
});
