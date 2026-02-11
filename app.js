const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let activeTripId = null;
let expenses = [];

async function initTrip(){
  const { data } = await db.from("trips")
    .select("*").eq("is_active",true)
    .order("created_at",{ascending:false}).limit(1);

  if(data.length===0){
    memberSection.classList.remove("hidden");
  } else {
    activeTripId=data[0].id;
    memberSection.classList.add("hidden");
    expenseSection.classList.remove("hidden");
    loadMembers();
  }
}
initTrip();

function generateInputs(){
  nameInputs.innerHTML="";
  for(let i=0;i<count.value;i++){
    nameInputs.innerHTML+=`<input id="m${i}" placeholder="Person ${i+1} name">`;
  }
  nameInputs.innerHTML+=`<button onclick="startTrip(${count.value})">Start Trip</button>`;
}

async function startTrip(n){
  const { data } = await db.from("trips").insert([{is_active:true}]).select();
  activeTripId=data[0].id;

  for(let i=0;i<n;i++){
    await db.from("members").insert([
      {trip_id:activeTripId,name:document.getElementById("m"+i).value}
    ]);
  }

  memberSection.classList.add("hidden");
  expenseSection.classList.remove("hidden");
  loadMembers();
}

async function loadMembers(){
  const { data } = await db.from("members")
    .select("*").eq("trip_id",activeTripId);
  paidBy.innerHTML="";
  data.forEach(m=>paidBy.innerHTML+=`<option>${m.name}</option>`);
}

async function addExpense(){
  await db.from("expenses").insert([{
    trip_id:activeTripId,
    date:new Date().toLocaleString(),
    amount:parseFloat(amount.value),
    description:desc.value,
    paidby:paidBy.value,
    mode:mode.value
  }]);
  desc.value=amount.value=mode.value="";
}

async function openPopup(){
  popup.style.display="block";
  const { data } = await db.from("expenses")
    .select("*").eq("trip_id",activeTripId);
  expenses=data;
  expenseBody.innerHTML="";
  expenses.forEach(e=>{
    expenseBody.innerHTML+=`
    <tr>
      <td>${e.date}</td>
      <td>${e.amount}</td>
      <td>${e.description}</td>
      <td>${e.paidby}</td>
      <td>${e.mode}</td>
      <td><button onclick="deleteExpense('${e.id}')">Delete</button></td>
    </tr>`;
  });
}

function closePopup(){popup.style.display="none";}

async function deleteExpense(id){
  await db.from("expenses").delete().eq("id",id);
  openPopup();
}

function downloadExpensesPDF(){
  const {jsPDF}=window.jspdf;
  let doc=new jsPDF();
  doc.autoTable({
    head:[["Date","Amount","Description","Paid By","Mode"]],
    body:expenses.map(e=>[e.date,e.amount,e.description,e.paidby,e.mode])
  });
  doc.save("trip-expenses.pdf");
}
/* ---------- END TRIP ---------- */
async function endTrip(){
  if(!confirm("Are you sure you want to end this trip?")) return;

  await db.from("trips")
    .update({is_active:false})
    .eq("id",activeTripId);

  activeTripId = null;

  // Reset UI
  memberSection.classList.remove("hidden");
  expenseSection.classList.add("hidden");
  nameInputs.innerHTML = "";
  count.value = "";
}

