const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58;
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let user;

async function init(){
  const { data } = await db.auth.getUser();
  user = data.user;
  if(!user) location.href="login.html";
  loadTrips();
}
init();

async function loadTrips(){
  const { data } = await db
    .from("members")
    .select("trip_id, trips(name)")
    .eq("user_id",user.id);

  tripList.innerHTML="";
  data.forEach(t=>{
    tripList.innerHTML +=
      `<li>
        ${t.trips.name}
        <button onclick="openTrip('${t.trip_id}')">Open</button>
      </li>`;
  });
}

async function createTrip(){
  const { data } = await db
    .from("trips")
    .insert([{ name: tripName.value, owner: user.id }])
    .select()
    .single();

  await db.from("members").insert([
    { trip_id:data.id, user_id:user.id, email:user.email }
  ]);

  loadTrips();
}

function openTrip(id){
  localStorage.setItem("tripId",id);
  location.href="trip.html";
}

async function logout(){
  await db.auth.signOut();
  location.href="login.html";
}
