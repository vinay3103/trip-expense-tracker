let members=JSON.parse(localStorage.getItem("members"))||["Person 1"];
let expenses=JSON.parse(localStorage.getItem("expenses"))||[];

let total=0;
let paid={};

members.forEach(m=>paid[m]=0);

expenses.forEach(e=>{
  total+=e.amount;
  paid[e.paidBy]+=e.amount;
});

let avg=total/members.length;
let body=document.getElementById("summaryBody");

members.forEach(m=>{
  let diff=paid[m]-avg;
  body.innerHTML+=`
  <tr>
    <td>${m}</td>
    <td>${paid[m].toFixed(2)}</td>
    <td>
      ${
        diff<0
        ? `<span class="red">➖ Owes ${Math.abs(diff).toFixed(2)}</span>`
        : `<span class="green">➕ Gets ${diff.toFixed(2)}</span>`
      }
    </td>
  </tr>
  `;
});

function downloadSummaryPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();

  let rows=[];
  members.forEach(m=>{
    let diff=paid[m]-avg;
    rows.push([
      m,
      paid[m].toFixed(2),
      diff<0?`Owes ${Math.abs(diff).toFixed(2)}`:`Gets ${diff.toFixed(2)}`
    ]);
  });

  doc.text("Trip Summary",14,10);
  doc.autoTable({
    head:[["Name","Paid","Status"]],
    body:rows
  });

  doc.save("trip-summary.pdf");
}
