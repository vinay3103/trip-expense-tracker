let members=[]; 
let expenses=[];

async function generateInputs(){
  let n=document.getElementById("count").value;
  let div=document.getElementById("nameInputs");
  div.innerHTML="";
  for(let i=0;i<n;i++){
    div.innerHTML+=`<input id="m${i}" placeholder="Person ${i+1} name">`;
  }
  div.innerHTML+=`<button onclick="saveMembers(${n})">Start Trip</button>`;
}

async function saveMembers(n){
  for(let i=0;i<n;i++){
    await fetch("/.netlify/functions/saveMembers",{
      method:"POST",
      body:JSON.stringify({name:document.getElementById("m"+i).value})
    });
  }
  loadMembers();
  document.getElementById("memberSection").classList.add("hidden");
  document.getElementById("expenseSection").classList.remove("hidden");
}

async function loadMembers(){
  let res=await fetch("/.netlify/functions/getMembers");
  members=await res.json();
  let sel=document.getElementById("paidBy");
  sel.innerHTML="";
  members.forEach(m=>sel.innerHTML+=`<option>${m.name}</option>`);
}
loadMembers();

async function addExpense(){
  let exp={
    date:new Date().toLocaleDateString(),
    amount:parseFloat(amount.value),
    description:desc.value,
    paidby:paidBy.value,
    mode:mode.value
  };
  await fetch("/.netlify/functions/saveExpense",{method:"POST",body:JSON.stringify(exp)});
}

async function openPopup(){
  document.getElementById("popup").style.display="block";
  let res=await fetch("/.netlify/functions/getExpenses");
  expenses=await res.json();
  let body=document.querySelector("#expenseTable tbody");
  body.innerHTML="";
  expenses.forEach(e=>{
    body.innerHTML+=`
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

function closePopup(){popup.style.display="none";}

async function deleteExpense(id){
  await fetch("/.netlify/functions/deleteExpense",{method:"POST",body:JSON.stringify({id})});
  openPopup();
}
