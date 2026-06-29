const tbody = document.getElementById("resultsBody");
const addRowBtn = document.getElementById("addRowBtn");

function createCell(value = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  return input;
}

function addRow(data = {}) {
  const tr = document.createElement("tr");

  const tdClassement = document.createElement("td");
  const tdNom = document.createElement("td");
  const tdTemps = document.createElement("td");
  const tdDistinction = document.createElement("td");
  const tdDelete = document.createElement("td");

  const classement = createCell(data.classement);
  const nom = createCell(data.nom);
  const temps = createCell(data.temps);
  const distinction = createCell(data.distinction);

  tdClassement.appendChild(classement);
  tdNom.appendChild(nom);
  tdTemps.appendChild(temps);
  tdDistinction.appendChild(distinction);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => tr.remove());

  tdDelete.appendChild(deleteBtn);

  tr.appendChild(tdClassement);
  tr.appendChild(tdNom);
  tr.appendChild(tdTemps);
  tr.appendChild(tdDistinction);
  tr.appendChild(tdDelete);

  tbody.appendChild(tr);
}

// ajouter ligne manuelle
addRowBtn.addEventListener("click", () => addRow());

// ligne initiale
addRow();


// ================================
// 📋 COLLER EXCEL
// ================================

document.addEventListener("paste", (event) => {
  const text = event.clipboardData.getData("text/plain");

  if (!text) return;

  const lines = text.split("\n").filter(l => l.trim() !== "");

  lines.forEach(line => {
    const cols = line.split("\t"); // Excel = tabulation

    // Format attendu :
    // classement | nom | temps | distinction

    addRow({
      classement: cols[0] || "",
      nom: cols[1] || "",
      temps: cols[2] || "",
      distinction: cols[3] || ""
    });
  });
});