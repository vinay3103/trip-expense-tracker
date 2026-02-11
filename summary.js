const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let tripId = localStorage.getItem("tripId");

async function loadSummary(){
  const { data: members } = await db
    .from("members")
    .select("*")
    .eq("trip_id",tripId);

  const { data: expenses } = await db
    .from("expenses")
    .select("*")
    .eq("trip_id",tripId);

  let total=0;
  let paid={};

  members.forEach(m=>paid[m.user_id]=0);

  expenses.forEach(e=>{
    total+=Number(e.amount);
    paid[e.paidby]+=Number(e.amount);
  });

  let avg=total/members.length;

  summaryBody.innerHTML="";
  members.forEach(m=>{
    let diff=paid[m.user_id]-avg;
    summaryBody.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td class="${diff<0?'red':'green'}">
        ${diff<0
          ? `➖ Owes ${Math.abs(diff).toFixed(2)}`
          : `➕ Gets ${diff.toFixed(2)}`
        }
      </td>
    </tr>`;
  });
}

loadSummary();
