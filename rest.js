const API_BASE_URL =
  "https://crudcrud.com/api/d3951cd72e964abb94f856ece9293cbc/restaurant";

// Cache frequently used elements
const form = document.getElementById("my-form");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("Description");
const categoryInput = document.getElementById("Category");
const expenseList = document.getElementById("expenses");
let editId = null;

// Function to add an expense
async function addExpense() {
  const name = nameInput.value;
  const description = descriptionInput.value;
  const category = categoryInput.value;

  //Creating a new expense
  const expense = { name, description, category };
  try {
    await axios.post(API_BASE_URL, expense);
  } catch (err) {
    console.log(err);
  }

  // Clear the form

  nameInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";

  // Reload and display the expenses
  loadExpenseList();
}

// Function to delete an expense
async function deleteExpense(id) {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (err) {
    console.log(err);
  }

  // Reload and display the expenses
  loadExpenseList();
}

// Function to load existing expenses from the API and display them
async function loadExpenseList() {
  try {
    const response = await axios.get(API_BASE_URL);
    const expenses = response.data;

    // Clear the expense list
    expenseList.innerHTML = "";

    // Display each expense in the expense list
    expenses.forEach(function (expense, index) {
      const li = document.createElement("li");
      li.textContent = `₹${expense.name},${expense.description},${expense.category}`;

      // Create the Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete order";
      deleteButton.addEventListener("click", function () {
        deleteExpense(expense._id);
      });
      li.appendChild(deleteButton);

      // Append list item to the expense list
      expenseList.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

// Add event listener for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission
  addExpense();
});

// Load existing expenses from the API and display them
document.addEventListener("DOMContentLoaded", loadExpenseList);
