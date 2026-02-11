const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login(){
  const { error } = await db.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if(error) alert(error.message);
  else window.location.href="dashboard.html";
}

async function signup(){
  const { error } = await db.auth.signUp({
    email: email.value,
    password: password.value
  });
  if(error) alert(error.message);
  else alert("Check email for confirmation.");
}

