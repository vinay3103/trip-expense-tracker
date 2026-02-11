const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let tripId = localStorage.getItem("tripId");

async function init(){
  const { data: members } = await db
    .from("members")
    .select("*")
    .eq("trip_id",tripId);

  paidBy.innerHTML="";
  members.forEach(m=>{
    paidBy.innerHTML +=
      `<option value="${m.user_id}">${m.email}</option>`;
  });
}
init();

async function addExpense(){
  await db.from("expenses").insert([{
    trip_id:tripId,
    date:new Date().toLocaleString(),
    amount:parseFloat(amount.value),
    description:desc.value,
    paidby:paidBy.value,
    mode:mode.value
  }]);
}
