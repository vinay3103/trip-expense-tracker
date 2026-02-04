async function loadSummary(){
let members=await (await fetch("/.netlify/functions/getMembers")).json();
let expenses=await (await fetch("/.netlify/functions/getExpenses")).json();

let total=0, paid={};
members.forEach(m=>paid[m.name]=0);

expenses.forEach(e=>{
  total+=Number(e.amount);
  paid[e.paidby]+=Number(e.amount);
});

let avg=total/members.length;
let body=document.getElementById("summaryBody");
body.innerHTML="";

members.forEach(m=>{
  let diff=paid[m.name]-avg;
  body.innerHTML+=`
  <tr>
    <td>${m.name}</td>
    <td>${paid[m.name].toFixed(2)}</td>
    <td>${diff<0?
      `<span class="red">➖ Owes ${Math.abs(diff).toFixed(2)}</span>`:
      `<span class="green">➕ Gets ${diff.toFixed(2)}</span>`}
    </td>
  </tr>`;
});
}
loadSummary();
