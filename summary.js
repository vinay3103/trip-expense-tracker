const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let summaryRows=[];

async function loadSummary(){
  const { data: trip } = await db.from("trips")
    .select("*").eq("is_active",true)
    .order("created_at",{ascending:false}).limit(1);

  const tripId=trip[0].id;

  const { data: members } = await db.from("members").select("*").eq("trip_id",tripId);
  const { data: expenses } = await db.from("expenses").select("*").eq("trip_id",tripId);

  let total=0, paid={};
  members.forEach(m=>paid[m.name]=0);

  expenses.forEach(e=>{
    total+=Number(e.amount);
    paid[e.paidby]+=Number(e.amount);
  });

  let avg=total/members.length;
  summaryBody.innerHTML="";
  summaryRows=[];

  members.forEach(m=>{
    let diff=paid[m.name]-avg;
    let status = diff<0
      ? `➖ Owes ${Math.abs(diff).toFixed(2)}`
      : `➕ Gets ${diff.toFixed(2)}`;

    summaryRows.push([m.name,paid[m.name].toFixed(2),status,m.settled?"Settled":"Pending"]);

    summaryBody.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td>${paid[m.name].toFixed(2)}</td>
      <td class="${diff<0?'red':'green'}">${status}</td>
      <td>
        ${m.settled
          ? "✅ Settled"
          : `<button onclick="markSettled('${m.id}')">Mark Settled</button>`
        }
      </td>
    </tr>`;
  });
}

async function markSettled(id){
  await db.from("members").update({settled:true}).eq("id",id);
  loadSummary();
}

/* ---------- PDF ---------- */
function downloadSummaryPDF(){
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  doc.text("Trip Summary",14,10);
  doc.autoTable({
    head:[["Name","Paid","Status","Settlement"]],
    body:summaryRows
  });

  doc.save("trip-summary.pdf");
}

loadSummary();
