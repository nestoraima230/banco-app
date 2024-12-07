document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const transactionList = document.getElementById("transactionList").getElementsByTagName('tbody')[0];  
  const filterType = document.getElementById("filter-type");
  const filterDate = document.getElementById("filter-date");
  const clearFiltersButton = document.getElementById("clear-filters");
  const loadingIndicator = document.getElementById("loading");

  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  const renderTransactions = (transactions) => {
    transactionList.innerHTML = ""; 

    if (transactions.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4" class="text-center">No hay transacciones para mostrar.</td>`;
      transactionList.appendChild(tr);
      return;
    }

    transactions.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(tx.transaction_date).toLocaleDateString()}</td>
        <td class="${tx.type === 'income' ? 'text-success' : 'text-danger'}">${tx.amount}</td>
        <td>${tx.type}</td>
        <td>${tx.description}</td>
      `;
      transactionList.appendChild(tr); 
    });
  };

  const getTransactions = async (filter = {}) => {
    const params = new URLSearchParams();

    const formattedDate = new Date(filter.date).toISOString().split('T')[0];  
    params.append("date", formattedDate);
    

    if (filter.type && filter.type !== "all") {
      params.append("type", filter.type);
    }

    if (loadingIndicator) {
      loadingIndicator.classList.remove("d-none");
    }

    try {
      console.log("Parámetros de la solicitud:", params.toString());  
      const response = await fetch(`https://api-bank-production.up.railway.app/api/movements/filtered?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`, 
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener los movimientos:", errorText);
        throw new Error(`Error al obtener los movimientos: ${errorText}`);
      }

      const movements = await response.json();
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

  // Limpiar filtros
  clearFiltersButton.addEventListener("click", () => {
    filterType.value = "all";
    filterDate.value = "";
    getTransactions(); // Volver a cargar las transacciones sin filtros
  });

  // Cargar los movimientos cuando la página se carga por primera vez
  getTransactions();  // Llamada inicial para cargar las transacciones
});
