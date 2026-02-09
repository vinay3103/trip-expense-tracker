const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let pdfSummary=[], pdfSettle=[];

async function loadSummary(){
  const { data: trip } = await db.from("trips")
    .select("*").eq("is_active",true)
    .order("created_at",{ascending:false}).limit(1);
  const tripId=trip[0].id;

  const { data: members } = await db.from("members").select("*").eq("trip_id",tripId);
  const { data: expenses } = await db.from("expenses").select("*").eq("trip_id",tripId);
  const { data: payments } = await db.from("payments").select("*").eq("trip_id",tripId);

  let total=0, paid={}, balances={};

  members.forEach(m=>paid[m.name]=0);

  expenses.forEach(e=>{
    total+=Number(e.amount);
    paid[e.paidby]+=Number(e.amount);
  });

  let avg=total/members.length;

  members.forEach(m=>{
    balances[m.name]=paid[m.name]-avg;
  });

  // apply payments
  payments.forEach(p=>{
    balances[p.from_user]+=Number(p.amount);
    balances[p.to_user]-=Number(p.amount);
  });

  renderSummary(members,balances,tripId);
  calculateSettlements(balances);
  loadPaymentHistory(payments);
  populatePaymentSelectors(members);
}

function renderSummary(members,balances,tripId){
  summaryBody.innerHTML="";
  pdfSummary=[];

  members.forEach(m=>{
    let diff=balances[m.name];
    summaryBody.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td>${diff.toFixed(2)}</td>
      <td class="${diff<0?'red':'green'}">
        ${diff<0
          ? `➖ Owes ${Math.abs(diff).toFixed(2)}`
          : `➕ Gets ${diff.toFixed(2)}`}
      </td>
    </tr>`;

    pdfSummary.push([m.name,diff.toFixed(2)]);
  });
}

function calculateSettlements(balances){
  settlementBody.innerHTML="";
  pdfSettle=[];

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
    pdfSettle.push([debtors[i][0],creditors[j][0],amt.toFixed(2)]);
    debtors[i][1]-=amt;
    creditors[j][1]-=amt;
    if(debtors[i][1]===0) i++;
    if(creditors[j][1]===0) j++;
  }
}

async function recordPayment(){
  const trip = await db.from("trips")
    .select("*").eq("is_active",true)
    .order("created_at",{ascending:false}).limit(1);

  const tripId=trip.data[0].id;

  await db.from("payments").insert([{
    trip_id:tripId,
    from_user:fromUser.value,
    to_user:toUser.value,
    amount:parseFloat(payAmount.value),
    date:new Date().toLocaleString()
  }]);

  loadSummary();
}

function loadPaymentHistory(payments){
  paymentBody.innerHTML="";
  payments.forEach(p=>{
    paymentBody.innerHTML+=`
    <tr>
      <td>${p.date}</td>
      <td>${p.from_user}</td>
      <td>${p.to_user}</td>
      <td>${p.amount}</td>
    </tr>`;
  });
}

function populatePaymentSelectors(members){
  fromUser.innerHTML="";
  toUser.innerHTML="";
  members.forEach(m=>{
    fromUser.innerHTML+=`<option>${m.name}</option>`;
    toUser.innerHTML+=`<option>${m.name}</option>`;
  });
}

function downloadSummaryPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();
  doc.autoTable({head:[["Name","Balance"]],body:pdfSummary});
  doc.autoTable({head:[["From","To","Amount"]],body:pdfSettle,startY:doc.lastAutoTable.finalY+10});
  doc.save("trip-summary.pdf");
}

loadSummary();
