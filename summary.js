let expenses = [];

async function loadSummary(){
  let res = await fetch("/.netlify/functions/getExpenses");
  let data = await res.json();

  if(!Array.isArray(data)){
    console.error(data);
    return;
  }

  expenses = data;

  let paid = {};
  expenses.forEach(e=>{
    if(!paid[e.paidby]) paid[e.paidby]=0;
    paid[e.paidby]+=Number(e.amount);
  });

  let body=document.getElementById("summaryBody");
  body.innerHTML="";

  Object.keys(paid).forEach(name=>{
    body.innerHTML+=`
    <tr>
      <td>${name}</td>
      <td>${paid[name].toFixed(2)}</td>
    </tr>`;
  });

  window.summaryData = paid;
}

function downloadSummaryPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();

  let rows=[];
  for(let name in summaryData){
    rows.push([name, summaryData[name].toFixed(2)]);
  }

  doc.text("Trip Summary",14,10);
  doc.autoTable({
    head:[["Paid By","Total Paid"]],
    body:rows
  });

  doc.save("trip-summary.pdf");
}

loadSummary();
