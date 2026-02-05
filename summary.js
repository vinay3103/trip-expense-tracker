const SUPABASE_URL = "https://hnvlnezbisyxmrubuarj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudmxuZXpiaXN5eG1ydWJ1YXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTExODAsImV4cCI6MjA4NTc4NzE4MH0.O7B21Nx762JCvx5caCJs3hiE4RO8GX2a9v3LP3Q9x58";

// ✅ DIFFERENT VARIABLE NAME (NOT supabase)
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function loadSummary() {
  const { data: members } = await db.from("members").select("*");
  const { data: expenses } = await db.from("expenses").select("*");

  let total = 0;
  let paid = {};

  members.forEach(m => paid[m.name] = 0);

  expenses.forEach(e => {
    total += Number(e.amount);
    paid[e.paidby] += Number(e.amount);
  });

  const avg = total / members.length;
  const body = document.getElementById("summaryBody");
  body.innerHTML = "";

  members.forEach(m => {
    const diff = paid[m.name] - avg;
    body.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${paid[m.name].toFixed(2)}</td>
        <td>
          ${
            diff < 0
              ? `<span class="red">➖ Owes ${Math.abs(diff).toFixed(2)}</span>`
              : `<span class="green">➕ Gets ${diff.toFixed(2)}</span>`
          }
        </td>
      </tr>`;
  });
}

loadSummary();
