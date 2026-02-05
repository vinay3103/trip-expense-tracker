const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadSummary() {
  let { data: members } = await supabase.from("members").select("*");
  let { data: expenses } = await supabase.from("expenses").select("*");

  let total = 0;
  let paid = {};

  members.forEach(m => paid[m.name] = 0);

  expenses.forEach(e => {
    total += Number(e.amount);
    paid[e.paidby] += Number(e.amount);
  });

  let avg = total / members.length;
  let body = document.getElementById("summaryBody");
  body.innerHTML = "";

  members.forEach(m => {
    let diff = paid[m.name] - avg;
    body.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${paid[m.name].toFixed(2)}</td>
      <td>
        ${diff < 0
          ? `<span class="red">➖ Owes ${Math.abs(diff).toFixed(2)}</span>`
          : `<span class="green">➕ Gets ${diff.toFixed(2)}</span>`
        }
      </td>
    </tr>`;
  });
}

loadSummary();
