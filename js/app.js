const tbody = document.getElementById("resultsBody");
const addRowBtn = document.getElementById("addRowBtn");

function addRow(data = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="text" value="${data.classement || ""}"></td>
    <td><input type="text" value="${data.nom || ""}"></td>
    <td><input type="text" value="${data.temps || ""}"></td>
    <td><input type="text" value="${data.distinction || ""}"></td>
    <td><button class="deleteBtn">❌</button></td>
  `;

  tr.querySelector(".deleteBtn").addEventListener("click", () => {
    tr.remove();
  });

  tbody.appendChild(tr);
}

addRowBtn.addEventListener("click", () => addRow());

// ligne initiale
addRow();