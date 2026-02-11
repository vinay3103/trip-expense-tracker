const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let user;
let tripId = localStorage.getItem("tripId");

/* ---------- AUTH CHECK ---------- */
async function init(){
  const { data } = await db.auth.getUser();
  user = data.user;

  if(!user){
    window.location.href="login.html";
    return;
  }

  if(tripId){
    expenseSection.classList.remove("hidden");
    loadMembers();
  }
}
init();

/* ---------- LOGOUT ---------- */
async function logout(){
  await db.auth.signOut();
  localStorage.removeItem("tripId");
  window.location.href="login.html";
}

/* ---------- CREATE TRIP ---------- */
async function createTrip(){
  const { data, error } = await db
    .from("trips")
    .insert([{ owner: user.id }])
    .select()
    .single();

  if(error){
    alert("Trip creation failed: " + error.message);
    console.error(error);
    return;
  }

  tripId = data.id;

  const { error: memberError } = await db
    .from("members")
    .insert([
      { trip_id: tripId, user_id: user.id, name: user.email }
    ]);

  if(memberError){
    alert("Member creation failed: " + memberError.message);
    console.error(memberError);
    return;
  }

  localStorage.setItem("tripId", tripId);

  alert("Trip created. Share this Trip ID:\n" + tripId);
  location.reload();
}

/* ---------- JOIN TRIP ---------- */
async function joinTrip(){
  tripId = joinCode.value;

  await db.from("members").insert([
    { trip_id: tripId, user_id: user.id, name: user.email }
  ]);

  localStorage.setItem("tripId",tripId);
  location.reload();
}

/* ---------- LOAD MEMBERS ---------- */
async function loadMembers(){
  const { data } = await db.from("members")
    .select("*")
    .eq("trip_id",tripId);

  paidBy.innerHTML="";
  data.forEach(m=>{
    paidBy.innerHTML+=`<option value="${m.user_id}">${m.name}</option>`;
  });
}

/* ---------- ADD EXPENSE ---------- */
async function addExpense(){
  await db.from("expenses").insert([{
    trip_id:tripId,
    date:new Date().toLocaleString(),
    amount:parseFloat(amount.value),
    description:desc.value,
    paidby:paidBy.value,
    mode:mode.value
  }]);

  desc.value="";
  amount.value="";
  mode.value="";
}

function goSummary(){
  window.location.href="summary.html";
}

