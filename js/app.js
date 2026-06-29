// ================================
// LOGIN SIMPLE
// ================================
const PASSWORD = "OEA-2026?"; // 🔒 change ici

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const input = document.getElementById("passwordInput").value;

  if (input === PASSWORD) {
    loginScreen.style.display = "none";
    app.style.display = "block";
  } else {
    document.getElementById("loginError").textContent =
      "Mot de passe incorrect";
  }
});


// ================================
// APP LOGIC
// ================================
const tbody = document.getElementById("resultsBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const newCourseBtn = document.getElementById("newCourseBtn");

const STORAGE_KEY = "resultats_courses_draft";


// ================================
// CELLULE
// ================================
function createCell(value = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;

  input.addEventListener("input", saveToLocal);

  return input;
}


// ================================
// AJOUT LIGNE
// ================================
function addRow(data = {}) {
  const tr = document.createElement("tr");

  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const td5 = document.createElement("td");

  td1.appendChild(createCell(data.classement));
  td2.appendChild(createCell(data.nom));
  td3.appendChild(createCell(data.temps));
  td4.appendChild(createCell(data.distinction));

  const del = document.createElement("button");
  del.textContent = "❌";

  del.onclick = () => {
    tr.remove();
    saveToLocal();
  };

  td5.appendChild(del);

  tr.append(td1, td2, td3, td4, td5);
  tbody.appendChild(tr);

  saveToLocal();
}


// ================================
// EXTRACTION
// ================================
function getData() {
  const rows = [];

  tbody.querySelectorAll("tr").forEach(tr => {
    const inputs = tr.querySelectorAll("input");

    if (inputs.length < 4) return;

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
    date: document.getElementById("date").value,
    epreuve: document.getElementById("epreuve").value,
    distance: document.getElementById("distance").value,
    rows: getData()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


// ================================
// RESTORE
// ================================
function loadFromLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const data = JSON.parse(raw);

  document.getElementById("date").value = data.date || "";
  document.getElementById("epreuve").value = data.epreuve || "";
  document.getElementById("distance").value = data.distance || "";

  tbody.innerHTML = "";

  (data.rows || []).forEach(addRow);
}


// ================================
// NOCODB
// ================================
async function sendToNocoDB(payload) {
  const res = await fetch("/.netlify/functions/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(data));

  return data;
}


// ================================
// SAVE BUTTON
// ================================
saveBtn.addEventListener("click", async () => {
  const rows = getData();

  if (rows.length === 0) {
    alert("Aucune donnée");
    return;
  }

  const date = document.getElementById("date").value;
  const epreuve = document.getElementById("epreuve").value;
  const distance = document.getElementById("distance").value;

  const payload = rows.map(r => ({
    Date: date,
    Epreuve: epreuve,
    Distance: distance,
    Classement: r.classement,
    Nom: r.nom,
    Temps: r.temps,
    Distinctions: r.distinction
  }));

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = "Envoi...";

    await sendToNocoDB(payload);

    alert("✔ Envoyé avec succès");

    tbody.innerHTML = "";
    addRow();
    saveToLocal();

  } catch (err) {
    alert("Erreur lors de l'envoi : " + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "💾 Enregistrer dans NocoDB";
  }
});


// ================================
// NOUVELLE COURSE
// ================================
newCourseBtn.addEventListener("click", () => {
  if (!confirm("Nouvelle course ?")) return;

  document.getElementById("epreuve").value = "";
  document.getElementById("distance").value = "";
  document.getElementById("resultsBody").innerHTML = "";

  addRow();
  saveToLocal();
});


// ================================
// EVENTS
// ================================
addRowBtn.addEventListener("click", () => addRow());

["date", "epreuve", "distance"].forEach(id => {
  document.getElementById(id).addEventListener("input", saveToLocal);
});

document.addEventListener("paste", (e) => {
  const text = e.clipboardData.getData("text/plain");
  if (!text) return;

  text.split("\n").forEach(line => {
    const cols = line.split("\t");

    if (cols.length >= 2) {
      addRow({
        classement: cols[0],
        nom: cols[1],
        temps: cols[2],
        distinction: cols[3]
      });
    }
  });
});


// ================================
// INIT
// ================================
addRow();
loadFromLocal();