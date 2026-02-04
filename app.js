let members = JSON.parse(localStorage.getItem("members")) || ["Person 1"];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let paidBySelect = document.getElementById("paidBy");

function loadMembers(){
  paidBySelect.innerHTML="";
  members.forEach(m=>{
    let opt=document.createElement("option");
    opt.textContent=m;
    paidBySelect.appendChild(opt);
  });
}
loadMembers();

async function addExpense(){
  let exp = {
    date:new Date().toLocaleDateString(),
    amount:parseFloat(amount.value),
    description:desc.value,
    paidby:paidBy.value,
    mode:mode.value
  };

  await fetch("/.netlify/functions/saveExpense",{
    method:"POST",
    body:JSON.stringify(exp)
  });

  loadExpenses();
}
async function loadExpenses(){
  let res = await fetch("/.netlify/functions/getExpenses");
  expenses = await res.json();
  renderTable();
}

loadExpenses();
function openPopup(){
  document.getElementById("popup").style.display="block";
  renderTable();
}

function closePopup(){
  document.getElementById("popup").style.display="none";
}

function renderTable(){
  let tbody=document.querySelector("#expenseTable tbody");
  tbody.innerHTML="";
  expenses.forEach((e,i)=>{
    tbody.innerHTML+=`
    <tr>
      <td>${e.date}</td>
      <td>${e.amount.toFixed(2)}</td>
      <td>${e.desc}</td>
      <td>${e.paidBy}</td>
      <td>${e.mode}</td>
      <td>
        <button class="edit-btn" onclick="editExpense(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${i})">Delete</button>
      </td>
    </tr>`;
  });
}

async function deleteExpense(id){
  await fetch("/.netlify/functions/deleteExpense",{
    method:"POST",
    body:JSON.stringify({id})
  });
  loadExpenses();
}


function editExpense(i){
  let e=expenses[i];
  let amt=prompt("Amount",e.amount);
  let desc=prompt("Description",e.desc);
  let paid=prompt("Paid By",e.paidBy);
  let mode=prompt("Mode",e.mode);

  expenses[i]={
    ...e,
    amount:parseFloat(amt),
    desc:desc,
    paidBy:paid,
    mode:mode
  };

  localStorage.setItem("expenses",JSON.stringify(expenses));
  renderTable();
}

function downloadPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();

  let rows=expenses.map(e=>[
    e.date,
    e.amount.toFixed(2),
    e.desc,
    e.paidBy,
    e.mode
  ]);

  doc.text("Trip Expenses",14,10);
  doc.autoTable({
    head:[["Date","Amount","Description","Paid By","Mode"]],
    body:rows
  });

  doc.save("trip-expenses.pdf");
}
