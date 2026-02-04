# 🧳 Trip Expense Tracker

A simple and responsive web application to track and split trip expenses among group members.
Users can add, edit, delete expenses, view summaries, and download expense reports as PDF tables.

---

## ✨ Features

* ✅ Add expenses with:

  * Description
  * Amount
  * Paid By
  * Payment Mode
  * Auto Date

* ✏️ Edit existing expenses

* 🗑 Delete expenses

* 📋 View all expenses in a popup window (scrollable)

* 📊 Summary page with:

  * Total paid per person
  * ➖ Owes (red)
  * ➕ Gets (green)

* 📄 Download PDF:

  * Expenses as table
  * Summary as table
  * (Not screenshots – real structured tables)

* 💾 Data stored permanently using `localStorage`

* 📱 Fully responsive layout

* 🎨 Smooth animations and clean UI

---

## 📁 Project Structure

```
index.html     → Main page (add & view expenses)
summary.html   → Summary page (split calculation)
style.css      → Styling and animations
app.js         → Expense logic (add/edit/delete/download)
summary.js     → Summary calculation logic
README.md      → Project documentation
```

---

## 🚀 How to Run the Project

1. Download or clone the project folder.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
3. Start adding expenses.
4. Click:

   * **View All Expenses** → to manage expenses
   * **View Summary** → to see who owes or gets money
   * **Download PDF** → to export report

⚠️ No server or database required.
Everything runs in the browser.

---

## 🧮 How Expense Split Works

1. Total expenses are calculated.
2. Average = Total / Number of members.
3. For each person:

   * If Paid < Average → ➖ Owes
   * If Paid > Average → ➕ Gets

---

## 📦 Libraries Used

* **jsPDF** – for PDF generation
* **jsPDF-AutoTable** – for table format in PDF

(Loaded via CDN, no installation needed)

---

## 🛠 Customization Ideas

You can extend this project by adding:

* Multiple trips
* Settlement (who pays whom)
* Charts and graphs
* Login system
* Dark mode
* Cloud storage (Firebase)

---

## 📌 Browser Support

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Brave

(Not tested on Internet Explorer)

---

## 📜 License

This project is open for learning and personal use.
You are free to modify and enhance it.

---

## 👨‍💻 Author

Developed as a learning project for:

* JavaScript
* DOM manipulation
* localStorage
* UI design
* PDF generation

---

