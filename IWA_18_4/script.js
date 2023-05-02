import { COLUMNS,state,updateDragging,createOrderData,TABLES} from "./data.js";
import {createOrderHtml,html, updateDraggingHtml,moveToColumn} from "./view.js";
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

const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath();
    let column= null;
    for (const element of path){
      const {area} = element.dataset;
      if(area) {
        column = area
        break;
      }
    }
    if(!column) return;
    updateDragging({over : column});
    updateDraggingHtml({over:column });
    //htmlArea.addEventListener("dragover", handleDragOver);
  };
  let dragged;
  const handleDragStart = (e) => {
    dragged = e.target;
  };
  const handleDragDrop = (f) => {
    f.target.append(dragged);
  };
  const handleDragEnd= (g) =>{
  const background = g.target.closest("section");
  background.style.backgroundColor="";
  };
  //attach event listeners to each column
  for (const htmlArea of Object.values(html.area)){
    htmlArea.addEventListener("dragover", handleDragOver);
    htmlArea.addEventListener("dragstart", handleDragStart);
    htmlArea.addEventListener("drop", handleDragDrop);
    htmlArea.addEventListener("dragend", handleDragEnd);
  }


//----Opens Help screen -----
const handleHelpToggle = () => {
  html.help.overlay.toggleAttribute("open");
};
html.help.cancel.addEventListener("click", handleHelpToggle);
html.other.help.addEventListener("click", handleHelpToggle);
//------Opens Add order menu------
const handleAddToggle = () => {
  html.add.overlay.toggleAttribute("open");
};
html.other.add.addEventListener("click", handleAddToggle);
html.add.cancel.addEventListener("click", handleAddToggle);

//---Submit information ----
const handleAddSubmit = (event) => {
  event.preventDefault(); // method is used to prevent the browser from executing the default action
  const order = {
    id: state.orders,
    title: html.add.title.value,
    table: html.add.table.value,
    created: new Date(),
  };
  const orderElement = createOrderHtml(order);
  html.area.ordered.append(orderElement);
  html.add.form.reset();
  html.add.overlay.close();
};

html.add.form.addEventListener("submit", handleAddSubmit);

//----- Opens edit menu -----
const handleEditToggle = () => {
  html.edit.overlay.toggleAttribute("open");
};

html.other.grid.addEventListener("click", handleEditToggle);
html.edit.cancel.addEventListener("click", handleEditToggle);

//----- Submit edited information -----
const handleEditSubmit = (event) => {
  event.preventDefault(); // method is used to prevent the browser from executing the default action
  const { id, title, table, created, column } = {
    title: html.edit.title.value,
    table: html.edit.table.value,
    created: new Date(),
    id: state.orders,
    column: html.edit.column.value,
  };
  const order = { id, title, table, created, column };
  // Find the index of the order to be updated
  let orderId = -1; //-1 allows us to check if an order index has been found
  // Find the order element in the HTML
  for (let i = 0; i < state.orders.length; i++) {
    if (state.orders[i].id === id) {
      orderId = i;
      break;
    }
  }
  // Update the order data in the state object
  state.orders[orderId] = createOrderData(order);
  // Update the order element with the new data
  const newOrder = createOrderHtml(order);
  const oldOrder= document.querySelector(`[data-id="${id}"]`);
  oldOrder.replaceWith(newOrder);
  // Move the order element to the correct column in the HTML
  switch (column) {
    case "ordered":
      html.area.ordered.append(newOrder);
      break;
    case "preparing":
      html.area.preparing.append(newOrder);
      break;
    case "served":
      html.area.served.append(newOrder);
      break;
    default:
      break;
  }
  html.edit.overlay.close();
};
html.edit.form.addEventListener("submit", handleEditSubmit);
const handleDelete = (event) => {
  event.preventDefault(); // method is used to prevent the browser from executing the default action
  const { id, title, table, created, column } = {
    title: html.edit.title.value,
    table: html.edit.table.value,
    created: new Date(),
    id: state.orders,
    column: html.edit.column.value,
  };
  const order = { id, title, table, created, column };
  // Find the index of the order to be updated
  let orderId = -1; //-1 allows us to check if an order index has been found
  // Find the order element in the HTML
  for (let i = 0; i < state.orders.length; i++) {
    if (state.orders[i].id === id) {
      orderId = i;
      break;
    }
  }
  // Delete the order element with the new data
  const newOrder = createOrderHtml(order);
  const oldOrder= document.querySelector(`[data-id="${id}"]`);
  oldOrder.remove(newOrder);
  html.edit.overlay.close();
};
html.edit.delete.addEventListener("click", handleDelete);