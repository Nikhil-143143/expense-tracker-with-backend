const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true
});

app.get("/api/expenses", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC, id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load expenses" });
  }
});

app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, expense_date, note } = req.body;
  const amountNumber = Number(amount);

  if (!title || !amount || !category || !expense_date) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (Number.isNaN(amountNumber) || amountNumber <= 0) {
    return res.status(400).json({ message: "Amount must be greater than zero" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO expenses (title, amount, category, expense_date, note) VALUES (?, ?, ?, ?, ?)",
      [title, amountNumber, category, expense_date, note || ""]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      amount: amountNumber,
      category,
      expense_date,
      note: note || ""
    });
  } catch (error) {
    res.status(500).json({ message: "Could not add expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM expenses WHERE id = ?", [
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete expense" });
  }
});

app.listen(port, () => {
  console.log(`Expense Tracker is running on http://localhost:${port}`);
});
