
const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";


const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let members = [];
let expenses = [];

/* ======================
   MEMBER SETUP
====================== */

function generateInputs() {
  const n = document.getElementById("count").value;
  const div = document.getElementById("nameInputs");
  div.innerHTML = "";

  for (let i = 0; i < n; i++) {
    div.innerHTML += `<input id="m${i}" placeholder="Person ${i + 1} name">`;
  }

  div.innerHTML += `<button onclick="saveMembers(${n})">Start Trip</button>`;
}

async function saveMembers(n) {
  for (let i = 0; i < n; i++) {
    const name = document.getElementById(`m${i}`).value;
    if (!name) continue;
    await db.from("members").insert([{ name }]);
  }

  await loadMembers();

  document.getElementById("memberSection").classList.add("hidden");
  document.getElementById("expenseSection").classList.remove("hidden");
}

async function loadMembers() {
  const { data } = await db.from("members").select("*");
  members = data || [];

  const sel = document.getElementById("paidBy");
  sel.innerHTML = "";
  members.forEach(m => {
    sel.innerHTML += `<option value="${m.name}">${m.name}</option>`;
  });
}

loadMembers();

/* ======================
   EXPENSES
====================== */

async function addExpense() {
  const exp = {
    date: new Date().toLocaleDateString(),
    amount: parseFloat(amount.value),
    description: desc.value,
    paidby: paidBy.value,
    mode: mode.value
  };

  await db.from("expenses").insert([exp]);

  desc.value = "";
  amount.value = "";
  mode.value = "";
}

async function openPopup() {
  popup.style.display = "block";

  const { data } = await db.from("expenses").select("*");
  expenses = data || [];

  const body = document.getElementById("expenseBody");
  body.innerHTML = "";

  expenses.forEach(e => {
    body.innerHTML += `
      <tr>
        <td>${e.date}</td>
        <td>${e.amount}</td>
        <td>${e.description}</td>
        <td>${e.paidby}</td>
        <td>${e.mode}</td>
        <td>
          <button onclick="deleteExpense('${e.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function closePopup() {
  popup.style.display = "none";
}

async function deleteExpense(id) {
  await db.from("expenses").delete().eq("id", id);
  openPopup();
}

