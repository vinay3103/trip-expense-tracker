let expenses = [];

async function addExpense(){
  let exp = {
    date: new Date().toLocaleDateString(),
    amount: parseFloat(amount.value),
    description: desc.value,
    paidby: paidBy.value,
    mode: mode.value
  };

  let res = await fetch("/.netlify/functions/saveExpense",{
    method:"POST",
    body: JSON.stringify(exp)
  });

  let result = await res.json();
  if(result.error){
    alert(result.error);
    return;
  }

  desc.value=""; amount.value=""; paidBy.value=""; mode.value="";
  loadExpenses();
}

async function loadExpenses(){
  let res = await fetch("/.netlify/functions/getExpenses");
  let data = await res.json();

  if(!Array.isArray(data)){
    console.error("Error:", data);
    return;
  }

  expenses = data;
  renderTable();
}

function openPopup(){
  document.getElementById("popup").style.display="block";
  loadExpenses();
}

function closePopup(){
  document.getElementById("popup").style.display="none";
}

function renderTable(){
  let tbody=document.querySelector("#expenseTable tbody");
  tbody.innerHTML="";
  expenses.forEach(e=>{
    tbody.innerHTML+=`
    <tr>
      <td>${e.date}</td>
      <td>${Number(e.amount).toFixed(2)}</td>
      <td>${e.description}</td>
      <td>${e.paidby}</td>
      <td>${e.mode}</td>
      <td>
        <button class="delete-btn" onclick="deleteExpense('${e.id}')">Delete</button>
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

function downloadPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();

  let rows=expenses.map(e=>[
    e.date,
    Number(e.amount).toFixed(2),
    e.description,
    e.paidby,
    e.mode
  ]);

  doc.text("Trip Expenses",14,10);
  doc.autoTable({
    head:[["Date","Amount","Description","Paid By","Mode"]],
    body:rows
  });

  doc.save("trip-expenses.pdf");
}
