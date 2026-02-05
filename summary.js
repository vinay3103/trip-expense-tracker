const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let pdfRowsSummary=[], pdfRowsSettle=[];

async function loadSummary(){
  const { data: trip } = await db.from("trips")
    .select("*").eq("is_active",true)
    .order("created_at",{ascending:false}).limit(1);
  const tripId=trip[0].id;

  const { data: members } = await db.from("members").select("*").eq("trip_id",tripId);
  const { data: expenses } = await db.from("expenses").select("*").eq("trip_id",tripId);

  let total=0, paid={}, balances={};
  members.forEach(m=>paid[m.name]=0);

  expenses.forEach(e=>{
    total+=Number(e.amount);
    paid[e.paidby]+=Number(e.amount);
  });

  let avg=total/members.length;
  summaryBody.innerHTML="";
  pdfRowsSummary=[];

  members.forEach(m=>{
    balances[m.name]=paid[m.name]-avg;
    summaryBody.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td>${paid[m.name].toFixed(2)}</td>
      <td class="${balances[m.name]<0?'red':'green'}">
        ${balances[m.name]<0
          ? `➖ Owes ${Math.abs(balances[m.name]).toFixed(2)}`
          : `➕ Gets ${balances[m.name].toFixed(2)}`
        }
      </td>
      <td>
        ${m.settled ? "✅ Settled" :
          `<button onclick="markSettled('${m.id}')">Mark Settled</button>`}
      </td>
    </tr>`;

    pdfRowsSummary.push([
      m.name,
      paid[m.name].toFixed(2),
      balances[m.name]<0
        ? `Owes ${Math.abs(balances[m.name]).toFixed(2)}`
        : `Gets ${balances[m.name].toFixed(2)}`
    ]);
  });

  calculateSettlements(balances);
}

function calculateSettlements(balances){
  settlementBody.innerHTML="";
  pdfRowsSettle=[];

  let debtors=[], creditors=[];
  for(let p in balances){
    if(balances[p]<0) debtors.push([p,-balances[p]]);
    if(balances[p]>0) creditors.push([p,balances[p]]);
  }

  let i=0,j=0;
  while(i<debtors.length && j<creditors.length){
    let amt=Math.min(debtors[i][1],creditors[j][1]);
    settlementBody.innerHTML+=`
    <tr>
      <td>${debtors[i][0]}</td>
      <td>${creditors[j][0]}</td>
      <td>${amt.toFixed(2)}</td>
    </tr>`;
    pdfRowsSettle.push([debtors[i][0],creditors[j][0],amt.toFixed(2)]);
    debtors[i][1]-=amt;
    creditors[j][1]-=amt;
    if(debtors[i][1]===0) i++;
    if(creditors[j][1]===0) j++;
  }
}

async function markSettled(id){
  await db.from("members").update({settled:true}).eq("id",id);
  loadSummary();
}

function downloadSummaryPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();
  doc.text("Trip Summary",14,10);
  doc.autoTable({head:[["Name","Paid","Status"]],body:pdfRowsSummary,startY:15});
  doc.autoTable({head:[["From","To","Amount"]],body:pdfRowsSettle,startY:doc.lastAutoTable.finalY+10});
  doc.save("trip-summary.pdf");
}

loadSummary();
oc.save("trip-summary.pdf");
}

loadSummary();

