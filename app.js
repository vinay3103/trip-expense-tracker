// 🔴 REPLACE WITH YOUR SUPABASE DETAILS
const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let members = [];
let expenses = [];

// STEP 1: MEMBER INPUTS
function generateInputs() {
  let n = document.getElementById("count").value;
  let div = document.getElementById("nameInputs");
  div.innerHTML = "";

  for (let i = 0; i < n; i++) {
    div.innerHTML += `<input id="m${i}" placeholder="Person ${i+1} name">`;
  }
  div.innerHTML += `<button onclick="saveMembers(${n})">Start Trip</button>`;
}

// SAVE MEMBERS
async function saveMembers(n) {
  for (let i = 0; i < n; i++) {
    let name = document.getElementById("m" + i).value;
    await supabase.from("members").insert([{ name }]);
  }

  loadMembers();
  document.getElementById("memberSection").classList.add("hidden");
  document.getElementById("expenseSection").classList.remove("hidden");
}

// LOAD MEMBERS INTO DROPDOWN
async function loadMembers() {
  let { data } = await supabase.from("members").select("*");
  members = data || [];

  let sel = document.getElementById("paidBy");
  sel.innerHTML = "";
  members.forEach(m => sel.innerHTML += `<option>${m.name}</option>`);
}
loadMembers();

// ADD EXPENSE
async function addExpense() {
  let exp = {
    date: new Date().toLocaleDateString(),
    amount: parseFloat(amount.value),
    description: desc.value,
    paidby: paidBy.value,
    mode: mode.value
  };

  await supabase.from("expenses").insert([exp]);
  desc.value = amount.value = mode.value = "";
}

// VIEW EXPENSES
async function openPopup() {
  popup.style.display = "block";
  let { data } = await supabase.from("expenses").select("*");
  expenses = data || [];

  let body = document.getElementById("expenseBody");
  body.innerHTML = "";

  expenses.forEach(e => {
    body.innerHTML += `
    <tr>
      <td>${e.date}</td>
      <td>${e.amount}</td>
      <td>${e.description}</td>
      <td>${e.paidby}</td>
      <td>${e.mode}</td>
      <td><button onclick="deleteExpense('${e.id}')">Delete</button></td>
    </tr>`;
  });
}

function closePopup() {
  popup.style.display = "none";
}

async function deleteExpense(id) {
  await supabase.from("expenses").delete().eq("id", id);
  openPopup();
}
