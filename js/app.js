const tbody = document.getElementById("resultsBody");
const addRowBtn = document.getElementById("addRowBtn");

const STORAGE_KEY = "resultats_courses_draft";

// ================================
// OUTILS
// ================================

function createCell(value = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;

  // sauvegarde à chaque saisie
  input.addEventListener("input", saveToLocal);

  return input;
}

// ================================
// AJOUT LIGNE
// ================================

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

  deleteBtn.addEventListener("click", () => {
    tr.remove();
    saveToLocal();
  });

  tdDelete.appendChild(deleteBtn);

  tr.appendChild(tdClassement);
  tr.appendChild(tdNom);
  tr.appendChild(tdTemps);
  tr.appendChild(tdDistinction);
  tr.appendChild(tdDelete);

  tbody.appendChild(tr);

  saveToLocal();
}

// ================================
// EXTRACTION DONNÉES
// ================================

function getData() {
  const rows = [];

  tbody.querySelectorAll("tr").forEach(tr => {
    const inputs = tr.querySelectorAll("input");

    if (inputs.length === 0) return;

    rows.push({
      classement: inputs[0].value,
      nom: inputs[1].value,
      temps: inputs[2].value,
      distinction: inputs[3].value
    });
  });

  return rows;
}

// ================================
// SAUVEGARDE LOCAL
// ================================

function saveToLocal() {
  const data = {
    rows: getData(),
    date: document.getElementById("date").value,
    epreuve: document.getElementById("epreuve").value,
    distance: document.getElementById("distance").value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ================================
// RESTAURATION
// ================================

function loadFromLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return;

  const data = JSON.parse(raw);

  document.getElementById("date").value = data.date || "";
  document.getElementById("epreuve").value = data.epreuve || "";
  document.getElementById("distance").value = data.distance || "";

  tbody.innerHTML = "";

  (data.rows || []).forEach(row => addRow(row));
}

// ================================
// EVENTS
// ================================

addRowBtn.addEventListener("click", () => addRow());

// sauvegarde champs haut
["date", "epreuve", "distance"].forEach(id => {
  document.getElementById(id).addEventListener("input", saveToLocal);
});

// ================================
// PASTE EXCEL (inchangé)
// ================================

document.addEventListener("paste", (event) => {
  const text = event.clipboardData.getData("text/plain");
  if (!text) return;

  const lines = text.split("\n").filter(l => l.trim() !== "");

  lines.forEach(line => {
    const cols = line.split("\t");

    addRow({
      classement: cols[0] || "",
      nom: cols[1] || "",
      temps: cols[2] || "",
      distinction: cols[3] || ""
    });
  });

  saveToLocal();
});

// ================================
// INIT
// ================================

addRow();
loadFromLocal();