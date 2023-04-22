import {COLUMNS, state, createOrderData, updateDragging} from "./data.js";
import {createOrderHtml, html, updateDraggingHtml, moveToColumn} from "./view.js"

// Select the "Add Order" button
const addOrderBtn = document.querySelector('[data-add]');

// Add a click event listener to the "Add Order" button
addOrderBtn.addEventListener('click', () => {
  // Show the "Add Order" dialog
  const addOverlay = document.querySelector('[data-add-overlay]');
  addOverlay.showModal();

  // Populate the table select element with options
  const tableSelect = document.querySelector('[data-add-table]');
  tableSelect.innerHTML = html `${state.tables.map(table =>
    `<option value="${table.id}">Table ${table.number}</option>`
  ).join('')} `;

  // Select the "Cancel" button in the "Add Order" dialog
  const cancelBtn = document.querySelector('[data-add-cancel]');

  // Add a click event listener to the "Cancel" button
  cancelBtn.addEventListener('click', () => {
    // Hide the "Add Order" dialog
    const addOverlay = document.querySelector('[data-add-overlay]');
    addOverlay.close();
  });
});

// Add a submit event listener to the "Add Order" form
const addForm = document.querySelector('[data-add-form]');
addForm.addEventListener('submit', event => {
  event.preventDefault();

  // Get the form data
  const formData = new FormData(addForm);
  const title = formData.get('title');
  const tableId = formData.get('table');

  // Create a new order object and add it to the "ordered" column
  const order = createOrderData({ title, table: tableId, column: COLUMNS.ORDERED });
  state.orders[order.id] = order;
  state.columns[COLUMNS.ORDERED].orderIds.push(order.id);

  // Render the new order in the "ordered" column
  const orderedColumn = document.querySelector('[data-column="ordered"]');
  const orderElement = createOrderHtml(order);
  orderedColumn.appendChild(orderElement);

  // Close the "Add Order" dialog
  addForm.reset();
  const addOverlay = document.querySelector('[data-add-overlay]');
  addOverlay.close();
});
// Update dragging state when dragstart event is triggered
document.addEventListener('dragstart', (event) => {
  const sourceId = event.target.id;
  const overColumn = event.target.closest('.column').id;
  const newDraggingState = { source: sourceId, over: overColumn };
  updateDragging(newDraggingState);
});

// Update dragging state when dragover event is triggered
document.addEventListener('dragover', (event) => {
  event.preventDefault();
  const overColumn = event.target.closest('.column').id;
  const draggingState = { ...state.dragging, over: overColumn };
  updateDragging(draggingState);
})

// Update column when drop event is triggered
document.addEventListener('drop', (event) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    const overColumn = event.target.closest('.column').id;
    moveToColumn(sourceId, overColumn);
    });

// Select the "Cancel" button in the "Edit Order" dialog
const editCancelBtn = document.querySelector('[data-edit-cancel]');
// Add a click event listener to the "Cancel" button in the "Edit Order" dialog
editCancelBtn.addEventListener('click', () => {
// Hide the "Edit Order" dialog
const editOverlay = document.querySelector('[data-edit-overlay]');
editOverlay.close();
});

// Select the "Delete" button in the "Edit Order" dialog
const deleteBtn = document.querySelector('[data-delete]');

// Add a click event listener to the "Delete" button in the "Edit Order" dialog
deleteBtn.addEventListener('click', () => {
const orderId = parseInt(editForm.dataset.orderId);
const order = state.orders[orderId];

// Remove the order from the state and the column
state.columns[order.column].orderIds = state.columns[order.column].orderIds.filter(id => id !== orderId);
delete state.orders[orderId];
// Remove the order element from the DOM
const orderElement = document.getElementById(orderId);
orderElement.remove();

// Hide the "Edit Order" dialog
const editOverlay = document.querySelector('[data-edit-overlay]');
editOverlay.close();
});

// Add a submit event listener to the "Edit Order" form
const editForm = document.querySelector('[data-edit-form]');
editForm.addEventListener('submit', event => {
event.preventDefault();

// Get the form data
const formData = new FormData(editForm);
const title = formData.get('title');
const tableId = formData.get('table');
const orderId = parseInt(editForm.dataset.orderId);

// Update the order object in the state
const order = state.orders[orderId];
order.title = title;
order.table = tableId;
// Update the order element in the DOM
const orderElement = document.getElementById(orderId);
orderElement.querySelector('[data-title]').textContent = title;
orderElement.querySelector('[data-table]').textContent = tableId ;{tableId};

// Move the order to the correct column if necessary
const oldColumn = order.column;
const newColumn = tableId ? COLUMNS.SERVED : COLUMNS.ORDERED;
if (oldColumn !== newColumn) {
// Update the state and move the order to the new column
state.columns[oldColumn].orderIds = state.columns[oldColumn].orderIds.filter(orderId => orderId !== order.id);
state.columns[newColumn].orderIds.push(order.id);

// Update the order element in the DOM
const newColumnElement = document.querySelector(`#${newColumn} .column__content`);
newColumnElement.appendChild(orderElement);
}
// Hide the "Edit Order" dialog
const editOverlay = document.querySelector('[data-edit-overlay]');
editOverlay.close();
});

// Render the initial orders
Object.values(state.orders).forEach(order => {
    const column = state.columns[order.column];
    const columnElement = document.getElementById(column.id);
    const orderElement = createOrderHtml(order);
    columnElement.querySelector('.column__content').appendChild(orderElement);
    });

 // Selecting necessary elements
const orders = document.querySelectorAll(".order");
const printBtn = document.querySelector("#print-btn");
const clearBtn = document.querySelector("#clear-btn");
const undoBtn = document.querySelector("#undo-btn");
const redoBtn = document.querySelector("#redo-btn");

// Initializing state variables
let isDragging = false;
// Add event listeners for orders
orders.forEach((order) => {
  order.addEventListener("dragstart", dragStart);
  order.addEventListener("dragend", dragEnd);
  order.addEventListener("mouseover", () => {
    if (!isDragging) {
      order.style.cursor = "move";
    }
  });
  order.addEventListener("mouseout", () => {
    order.style.cursor = "default";
  });
});

// Add event listener for print button
printBtn.addEventListener("click", () => {
  // Generate printable version of orders
  window.print();
});

// Add event listener for clear button
clearBtn.addEventListener("click", () => {
  // Remove all orders from all columns
  orders.forEach((order) => order.remove());
});

// Add event listener for undo button
undoBtn.addEventListener("click", () => {
  // Undo the most recent change to the orders
  console.log("Undoing the most recent change to the orders");
});
// Add event listener for undo button
undoBtn.addEventListener("click", () => {
  // Undo the most recent change to the orders
  console.log("Undoing the most recent change to the orders");
});

// Add event listener for redo button
redoBtn.addEventListener("click", () => {
  // Redo the most recently undone change to the orders
  console.log("Redoing the most recently undone change to the orders");
});

// Select the "Help" button
const helpBtn = document.querySelector('[data-help]');

// Add a click event listener to the "Help" button
helpBtn.addEventListener('click', () => {
// Show the "Help" dialog
const helpOverlay = document.querySelector('[data-help-overlay]');
helpOverlay.showModal();

// Select the "Close" button in the "Help" dialog
const closeBtn = document.querySelector('[data-help-close]');

// Add a click event listener to the "Close" button
closeBtn.addEventListener('click', () => {
// Hide the "Help" dialog
helpOverlay.close();
});
});