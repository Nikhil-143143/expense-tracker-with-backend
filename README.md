# 💸 Clean & Modern Expense Tracker

A beautiful, beginner-friendly full-stack web application for tracking daily spending. Built using **HTML5, CSS3, JavaScript (ES6+), Node.js, Express, and MySQL**.

This version has been optimized for reliability, featuring timezone-independent date tracking, database-aligned length validation constraints, and robust frontend API error handling.

---

## 🚀 Key Features

*   **📊 Instant Financial Summaries**: Displays total spending, entry count, average cost, and the highest expense dynamically.
*   **➕ Seamless Expense Addition**: Form with client-side field validation matching DB limits (`maxlength`, `min` values).
*   **🗑️ Delete & Update**: Clean inline deletion of transaction entries with proper error-handling.
*   **🔍 Category Filtering**: Instantly sort and view transactions by specific categories (Food, Transport, Bills, Shopping, Health, etc.).
*   **🌍 Timezone Safe**: Prevents dates shifting to the day before or day after by utilizing raw `"YYYY-MM-DD"` DB strings.
*   **📱 Responsive Interface**: Clean layout built with CSS grid and flexbox, fully compatible with mobile, tablet, and desktop viewports.

---

## 📁 Project structure

```text
expense-tracker-clean/
├── public/
│   ├── index.html       # UI structure and forms
│   ├── style.css        # Premium custom CSS styling
│   └── script.js        # Form validation, rendering, and API fetch calls
├── .env.example         # Template for database environment variables
├── .env                 # Local database configurations (git-ignored)
├── database.sql         # SQL script to initialize the DB and schema
├── package.json         # Package configuration and dependencies
└── server.js            # Node/Express API server and pool configuration
```

---

## ⚙️ Quick Start Setup

Follow these simple steps to spin up the tracker on your local machine:

### 1. Prerequisite Checklist
Make sure you have [Node.js](https://nodejs.org/) and [MySQL Server](https://www.mysql.com/) installed and running.

### 2. Database Initialization
Log into MySQL and execute the queries inside [database.sql](file:///c:/Users/HP/OneDrive/Desktop/expense-tracker-clean/database.sql):
```bash
mysql -u root -p < database.sql
```
*Alternatively, copy-paste the SQL contents directly into your favorite SQL client (e.g., MySQL Workbench, phpMyAdmin).*

### 3. Configure Environments
Copy the template `.env.example` file and name it `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your MySQL server details:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
PORT=3000
```

### 4. Install Dependencies
Run the command below in the project directory:
```bash
npm install
```

### 5. Launch Application
Start the development server:
```bash
# Run server normally
npm start

# Run with hot-reloading (nodemon)
npm run dev
```

The console will print:
`Expense Tracker is running on http://localhost:3000`

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api/expenses` | Returns list of all expenses sorted newest first |
| **`POST`** | `/api/expenses` | Inserts a new expense (expects `title`, `amount`, `category`, `expense_date`, optional `note`) |
| **`DELETE`** | `/api/expenses/:id` | Deletes a transaction by its unique ID |
