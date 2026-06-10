CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  expense_date DATE NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO expenses (title, amount, category, expense_date, note)
VALUES
  ('Bus pass', 450.00, 'Transport', CURDATE(), 'Monthly local travel'),
  ('Lunch', 180.00, 'Food', CURDATE(), 'College canteen');
