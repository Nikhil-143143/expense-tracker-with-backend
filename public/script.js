const form = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("expenseDate");
const noteInput = document.getElementById("note");
const message = document.getElementById("message");
const expenseList = document.getElementById("expenseList");
const filterCategory = document.getElementById("filterCategory");
const totalAmount = document.getElementById("totalAmount");
const entryCount = document.getElementById("entryCount");
const highestExpense = document.getElementById("highestExpense");
const averageExpense = document.getElementById("averageExpense");

let expenses = [];

function setLocalDateInput() {
  const localDate = new Date();
  const yyyy = localDate.getFullYear();
  const mm = String(localDate.getMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

setLocalDateInput();

function formatMoney(value) {
  return `Rs. ${Number(value).toFixed(2)}`;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#be123c" : "#0f766e";
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

async function loadExpenses() {
  try {
    const response = await fetch("/api/expenses");
    if (!response.ok) {
      const error = await response.json();
      showMessage(error.message || "Could not load expenses.", true);
      return;
    }
    expenses = await response.json();
    renderExpenses();
  } catch (error) {
    showMessage("Server is not connected yet.", true);
  }
}

function renderExpenses() {
  const selectedCategory = filterCategory.value;
  const visibleExpenses = selectedCategory === "All"
    ? expenses
    : expenses.filter((expense) => expense.category === selectedCategory);

  updateSummary(visibleExpenses);
  expenseList.innerHTML = "";

  if (visibleExpenses.length === 0) {
    expenseList.innerHTML = '<div class="empty-state">No expenses found.</div>';
    return;
  }

  visibleExpenses.forEach((expense) => {
    const card = document.createElement("article");
    card.className = "expense-card";
    const info = document.createElement("div");
    const actions = document.createElement("div");

    let dateStr = expense.expense_date;
    if (dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0];
    }
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${day} ${months[parseInt(month, 10) - 1]} ${year}`;

    info.appendChild(createTextElement("h3", "", expense.title));
    info.appendChild(
      createTextElement("p", "expense-meta", `${expense.category} | ${date}`)
    );

    if (expense.note) {
      info.appendChild(createTextElement("p", "expense-note", expense.note));
    }

    const amount = createTextElement(
      "div",
      "expense-amount",
      formatMoney(expense.amount)
    );
    const deleteButton = createTextElement("button", "delete-btn", "Delete");
    deleteButton.dataset.id = expense.id;
    actions.appendChild(amount);
    actions.appendChild(deleteButton);
    card.appendChild(info);
    card.appendChild(actions);

    expenseList.appendChild(card);
  });
}

function updateSummary(list) {
  const total = list.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const highest = list.length
    ? Math.max(...list.map((expense) => Number(expense.amount)))
    : 0;
  const average = list.length ? total / list.length : 0;

  totalAmount.textContent = formatMoney(total);
  entryCount.textContent = list.length;
  highestExpense.textContent = formatMoney(highest);
  averageExpense.textContent = formatMoney(average);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newExpense = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    category: categoryInput.value,
    expense_date: dateInput.value,
    note: noteInput.value.trim()
  };

  try {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newExpense)
    });

    if (!response.ok) {
      const error = await response.json();
      showMessage(error.message, true);
      return;
    }

    form.reset();
    setLocalDateInput();
    showMessage("Expense added successfully.");
    await loadExpenses();
  } catch (error) {
    showMessage("Could not add expense. Check the server.", true);
  }
});

expenseList.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const id = event.target.dataset.id;

  try {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      const error = await response.json();
      showMessage(error.message || "Could not delete expense.", true);
      return;
    }
    showMessage("Expense deleted.");
    await loadExpenses();
  } catch (error) {
    showMessage("Could not delete expense.", true);
  }
});

filterCategory.addEventListener("change", renderExpenses);

loadExpenses();
