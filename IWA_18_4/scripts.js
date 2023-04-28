import { COLUMNS, state, updateDragging, createOrderData, TABLES } from "./data.js";
import { createOrderHtml, html, updateDraggingHtml, moveToColumn } from "./view.js";
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
*/
const dragAndDrop = (items, containers) => {
  const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath();
    let column = null;

    for (const element of path) {
      const { area } = element.dataset;
      if (area) {
        column = area;
        break;
      }
    }

    if (!column) return;


    containers.forEach(col => {
      col.style.backgroundColor = col.dataset.area === column ? "green" : "";
      col.removeEventListener("drop", handleDrop);
      if (col.dataset.area === column) {
        col.addEventListener("drop", handleDrop);
      }
    });
  }

  const handleDrop = (event) => {
    event.preventDefault();
    const { order } = event.dataTransfer.getData("text/plain");
    const targetColumn = event.currentTarget.dataset.area;

    const currentColumn = document.querySelector(`[data-column-orders*="${order}"]`);
    if (currentColumn) {
      const orders = currentColumn.dataset.columnOrders.split(",");
      const index = orders.indexOf(order);
      if (index > -1) {
        orders.splice(index, 1);
        currentColumn.dataset.columnOrders = orders.join(",");
      }
    }

    const newColumn = document.querySelector(`[data-area="${targetColumn}"]`);
    if (newColumn) {
      const orders = newColumn.dataset.columnOrders.split(",");
      orders.push(order);
      newColumn.dataset.columnOrders = orders.join(",");
    }

    containers.forEach(col => {
      col.style.backgroundColor = "";
      col.removeEventListener("drop", handleDrop);
    });
  }

  items.forEach(item => {
    item.draggable = true;
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("", event.currentTarget.dataset.order);
    });
  });

  containers.forEach(col => {
    col.addEventListener("dragover", handleDragOver);
    col.addEventListener("drop", handleDrop);
  });
};

const allOrders = document.querySelectorAll("[data-order]");
const allColumns = document.querySelectorAll("[data-area]");
dragAndDrop(allOrders, allColumns);




//Open Help Overlay

const handleHelpToggle = () => {
  html.help.overlay.toggleAttribute('open');

  if (html.help.overlay.open) {
    // Hide the add order button and the table when the help overlay is open
    html.other.add.classList.add('hidden');
    html.add.table.classList.add('hidden');

        // Disable the drag and drop functionality when the help overlay is open
        for (const columnName of Object.keys(html.columns)) {
          const column = html.columns[columnName];
          column.removeAttribute('draggable');
          column.classList.remove('droppable');
        }
      } else {
        // Show the add order button and the table when the help overlay is closed
        html.other.add.classList.remove('hidden');
        html.add.table.classList.remove('hidden');
    
        // Enable the drag and drop functionality when the help overlay is closed
        for (const columnName of Object.keys(html.columns)) {
          COLUMNS = html.columns[columnName];
          COLUMNS.setAttribute('draggable', true);
          COLUMNS.classList.add('droppable');
        }
      }
    };
    html.other.help.addEventListener('click', handleHelpToggle);
    
    //Close Help Overlay
    
    const handleHelpToggle1 = () => {
      html.help.overlay.toggleAttribute('open');
    
      if (!html.help.overlay.open) {
        html.help.overlay.close();
      }
    };

    html.help.cancel.addEventListener('click', handleHelpToggle1);


// Add Order button Open

const handleAddToggle = () => {
  html.add.overlay.toggleAttribute('open');

  if (html.add.overlay.open) {
    const tableOptions = TABLES.map((table) => `
      <option value="${table}">${table}</option>
    `).join('');

    html.add.table.innerHTML = tableOptions;
  }
};
html.other.add.addEventListener('click', handleAddToggle);

//Add button to add order in the Ordered column

const handleAddSubmit = (event) => {
  event.preventDefault();

  // Get form input values
  const title = html.add.title.value;
  const table = html.add.table.value;

  // Create new order object and add to state
  const id = Object.keys(state.orders).length + 1;
  const created = new Date();
  const order = { id, title, table, created };
  state.orders[id] = order;

    // Create HTML element for new order and append to Ordered column
    const orderElement = createOrderHtml(order);
    html.area.ordered.append(orderElement);
  
    // Reset form and hide add overlay
    html.add.form.reset();
    html.add.overlay.close();
  };
  
  html.add.form.addEventListener('submit', handleAddSubmit);
  html.add.cancel.addEventListener('click', () => {
    html.add.form.reset();
    html.add.overlay.close();
  });
  html.add.overlay.addEventListener('close', () => {
    html.add.form.reset();
  });
  
  // Cancel Button to close the add order overlay
  const handleAddCancel = (event) => {
    event.preventDefault();
  
    // Clear form
    html.add.form.reset();
  
    // Close overlay
    html.add.overlay.removeAttribute('open');
  }
  
  html.add.form.addEventListener('submit', handleAddSubmit);
html.add.cancel.addEventListener('click', handleAddCancel);


//Editing orders


//Edit Order overlay Open
const handleEditToggle = () => {
  html.edit.overlay.toggleAttribute('open');
};
html.other.grid.addEventListener('click', handleEditToggle);

//Submit Changes
const handleEditSubmit = (event) => {
  event.preventDefault();
  const id = html.edit.id.value;
  const title = html.edit.title.value;
  const table = html.edit.table.value;
  const status = html.edit.status.value; // get the status value from the form


  const order = state.orders.find((order) => order.id === id);
  if (order) {
  order.title = title;
  order.table = table;
  order.status = status; // update the order's status
 
    // update the order element on the page
    const orderElement = document.querySelector(`.order[data-id="${id}"]`);
    if (orderElement) {
      orderElement.querySelector('[data-order-title]').textContent = title;
      orderElement.querySelector('[data-order-table]').textContent = table;
      orderElement.querySelector('[data-order-status]').textContent = status; // update the order's status on the page
      orderElement.dataset.column = table; // update the order's column on the page // the update does not update in the columns
    }

     // move the order to the selected column
     const columnElement = document.querySelector(`[data-column="${table}"]`);
     if (columnElement) {
       columnElement.querySelector('.orders').appendChild(orderElement);
     }
};
};

// close the "Edit Order" overlay
html.edit.overlay.close();


// add an event listener to the "submit" button in the "Edit Order" form
html.edit.form.addEventListener('submit', handleEditSubmit);


const handleDelete = () => {
  const id = html.edit.id.value;
  delete state.orders[id]; // remove order from state
  html.edit.overlay.close(); // close the Edit Order overlay
  html.form.reset(); // reset the form fields // issue is here, the delete button does not clear the form field
};

html.edit.delete.addEventListener('click', (event) => {
  event.preventDefault();
  handleDelete();
 

});


//Cancel Button
const handleEditToggleCancel = () => {
  html.edit.overlay.close();
};
html.edit.cancel.addEventListener('click', handleEditToggleCancel);