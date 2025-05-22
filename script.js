document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const saveExpenses = () => localStorage.setItem("expenses", JSON.stringify(expenses));

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value.trim();
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
        const budget = document.getElementById("expense-budget").value;

        if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
            alert("Please enter valid expense details.");
            return;
        }

        const expense = { id: Date.now(), name, amount, category, date, budget };

        expenses.push(expense);
        saveExpenses();
        displayExpenses();
        updateTotalAmount();
        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(expense => expense.id !== id);
        } else if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find(expense => expense.id === id);
            if (expense) {
                document.getElementById("expense-budget").value = expense.budget;
                document.getElementById("expense-name").value = expense.name;
                document.getElementById("expense-amount").value = expense.amount;
                document.getElementById("expense-category").value = expense.category;
                document.getElementById("expense-date").value = expense.date;
                expenses = expenses.filter(expense => expense.id !== id);
            }
        }

        saveExpenses();
        displayExpenses();
        updateTotalAmount();
    });

    filterCategory.addEventListener("change", () => {
        displayExpenses();
    });

    function displayExpenses() {
        expenseList.innerHTML = "";
        const filteredExpenses = filterCategory.value === "All" ? expenses : expenses.filter(exp => exp.category === filterCategory.value);

        filteredExpenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                
                <td>${expense.name}</td>
                <td>KSh${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
                <td>${expense.budget ? "KSh " + expense.budget : "Not Set"}</td>
            `;
            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = `${total.toFixed(2)}`;
    //added code

     // Get the budget value (convert to number, handle missing input)
    const budgetInput = document.getElementById("expense-budget");
    const budget = budgetInput && budgetInput.value ? parseFloat(budgetInput.value) : 0;

    // Create or select an element for displaying comparison
    let resultDisplay = document.getElementById("budget-result");
    if (!resultDisplay) {
        resultDisplay = document.createElement("div");
        resultDisplay.id = "budget-result";
        totalAmount.parentNode.appendChild(resultDisplay);
    }

    // Compare budget against total expenses
    if (budget > total) {
        resultDisplay.innerHTML = `<strong>Warning:</strong> Total expenses exceed the budget!`;
        resultDisplay.style.color = "red"; // Highlight issue in red
    } else {
        resultDisplay.innerHTML = `<strong>Within Budget:</strong> You are managing well!`;
        resultDisplay.style.color = "yellow"; // Show success in green
    }
 
}


    displayExpenses();
    updateTotalAmount();
});
