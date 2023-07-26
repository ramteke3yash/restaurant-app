const API_BASE_URL =
  "https://crudcrud.com/api/a5273de72be8463c89a42fd535d8d15e/rest2";

// Cache frequently used elements
const form = document.getElementById("my-form");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("Description");
const categoryInput = document.getElementById("Category");
const orderList = document.getElementById("orders");
let editId = null;

// Function to add order
async function addOrder() {
  const name = nameInput.value;
  const description = descriptionInput.value;
  const category = categoryInput.value;

  //Creating a new order
  const order = { name, description, category };
  try {
    await axios.post(API_BASE_URL, order);
  } catch (err) {
    console.log(err);
  }

  // Clear the form

  nameInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";

  // Reload and display the orders
  loadOrderList();
}

// Function to delete an order
async function deleteOrder(id) {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (err) {
    console.log(err);
  }

  // Reload and display the orders
  loadOrderList();
}

async function loadOrderList() {
  try {
    const response = await axios.get(API_BASE_URL);
    const orders = response.data;

    // Get the order div container
    const orderContainer = document.getElementById("orders");
    orderContainer.innerHTML = ""; // Clear previous content

    // Group orders by category using reduce
    const ordersByCategory = orders.reduce((acc, order) => {
      const { category } = order;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(order);
      return acc;
    }, {});

    // Display each category with its orders
    for (const category in ordersByCategory) {
      const categoryDiv = document.createElement("div");

      // Create a heading for the category
      const categoryHeading = document.createElement("h2");
      categoryHeading.textContent = `${category}`;
      categoryDiv.appendChild(categoryHeading);

      // Add each order item under the category
      ordersByCategory[category].forEach(function (order, index) {
        const orderDiv = document.createElement("div");
        orderDiv.textContent = `₹${order.name}, ${order.description}`;

        // Create the Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete order";
        deleteButton.addEventListener("click", function () {
          deleteOrder(order._id);
        });
        orderDiv.appendChild(deleteButton);

        // Append order item to the categoryDiv
        categoryDiv.appendChild(orderDiv);
      });

      // Append the categoryDiv to the orderContainer
      orderContainer.appendChild(categoryDiv);
    }
  } catch (err) {
    console.log(err);
  }
}

// Add event listener for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission
  addOrder();
});

// Load existing orders from the API and display them
document.addEventListener("DOMContentLoaded", loadOrderList);
