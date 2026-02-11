# 🧳 Trip Expense Tracker (Cloud-Based)

A fully functional **trip expense splitting web app** that allows groups to track expenses, calculate balances, record partial payments, and settle trips.
All data is stored securely in **Supabase (cloud database)**, so it is never lost and works across devices.

---

## ✨ Features

### 👥 Trip Management

* Start a trip by entering number of people and their names
* End trip and start a new one
* Prevents mixing of expenses between trips
* Cloud-based trip storage

### 💸 Expense Tracking

* Add expenses with:

  * Description
  * Amount
  * Paid by
  * Payment mode
  * Automatic date & time
* View all expenses in popup
* Delete expenses
* Download expenses as PDF (table format)

### 📊 Automatic Summary

* Calculates:

  * Total spent
  * Individual contributions
  * Average share
* Shows:

  * ➕ Gets (green)
  * ➖ Owes (red)

### 🔄 Who Pays Whom (Auto Settlement)

* Automatically calculates settlement between users
* Displays clear settlement instructions:

  ```
  A → pays → B → ₹500
  ```

### 💰 Partial Payments System

* Record payments between users
* Supports partial settlements
* Automatically updates balances
* Tracks payment history

### 🛠 Payment Management

* Record payment
* Edit payment
* Delete payment
* View full payment history

### 📄 PDF Export

Download:

* Expense table
* Summary table
* Settlement table

All PDFs are in **proper tabular format**, not screenshots.

---

## 🧱 Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Frontend       | HTML, CSS, JavaScript           |
| Database       | Supabase (PostgreSQL)           |
| PDF Generation | jsPDF + AutoTable               |
| Hosting        | Netlify / Vercel / GitHub Pages |

---

## 📁 Project Structure

```
index.html        → Main expense page
summary.html      → Summary & settlement page
style.css         → Styling
app.js            → Expense logic
summary.js        → Summary, settlement, and payments logic
README.md         → Project documentation
```

---

## 🗄 Database Schema (Supabase)

### 1. Trips

```sql
create table trips (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  is_active boolean default true
);
```

### 2. Members

```sql
create table members (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id),
  name text
);
```

### 3. Expenses

```sql
create table expenses (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id),
  date text,
  amount numeric,
  description text,
  paidby text,
  mode text
);
```

### 4. Payments (for settlements)

```sql
create table payments (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id),
  from_user text,
  to_user text,
  amount numeric,
  date text
);
```

---

## 🔐 Enable Row Level Security (RLS)

Run this in Supabase SQL Editor:

```sql
alter table trips enable row level security;
alter table members enable row level security;
alter table expenses enable row level security;
alter table payments enable row level security;

create policy "all trips" on trips for all using (true);
create policy "all members" on members for all using (true);
create policy "all expenses" on expenses for all using (true);
create policy "all payments" on payments for all using (true);
```

---

## ⚙️ Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL commands above

### Step 2: Get API Credentials

From Supabase:

* Go to **Settings → API**
* Copy:

  * Project URL
  * Anon Public Key

### Step 3: Add credentials in JS files

In both:

```
app.js
summary.js
```

Replace:

```js
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";
```

With your real values.

---

## 🚀 Deployment (Free)

You can deploy this app on:

### Option 1: Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Drag and drop project folder
3. Site goes live instantly

### Option 2: Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Import project from GitHub
3. Deploy

### Option 3: GitHub Pages

1. Upload project to repository
2. Enable GitHub Pages
3. Site becomes live

---

## 📱 How the App Works

### Trip Flow

1. Enter number of people
2. Enter names
3. Start trip

### Expense Flow

1. Add expenses
2. View expenses popup
3. Download expense PDF

### Settlement Flow

1. Open summary page
2. View balances
3. Check “who pays whom”
4. Record payments
5. Edit/delete payments if needed

### Ending a Trip

1. Click **End Trip**
2. Click **Start New Trip**
3. Enter new members

---

## 🧮 Calculation Logic

### Step 1: Total Trip Cost

```
Total = Sum of all expenses
```

### Step 2: Average Share

```
Average = Total / Number of members
```

### Step 3: Balance

```
Balance = Paid - Average
```

* If balance < 0 → Owes
* If balance > 0 → Gets

### Step 4: Apply Payments

Each payment adjusts balances in real time.

---

## 🌟 Key Advantages

* Cloud-based storage (no data loss)
* Works across multiple devices
* No backend server required
* Fully free hosting possible
* Real-time settlement updates
* Professional PDF exports

---

## 🔮 Possible Future Enhancements

* User login system
* Multiple trips history
* Trip sharing via link
* Currency selection
* Graphs and analytics
* Mobile app (PWA)

---

## 📜 License

This project is open for:

* Learning
* Personal use
* Portfolio projects

You may modify and extend it.

---

## 👨‍💻 Author

Developed as a full-stack learning project using:

* JavaScript
* Supabase
* Cloud-based architecture
* Expense-splitting algorithms

---
