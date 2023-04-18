import { TABLES, COLUMNS, state, createOrderData, moveToColumn } from './data.js';
import { html, updateDragging, updateDraggingHtml, createOrderHtml } from './view.js';

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
    updateDragging({ over: column });
    updateDraggingHtml({ over: column });
};

const handleDragStart = (event) => {
    const { id } = event.target.dataset;
    if (!id) return;
    updateDragging({ source: id });
};

const handleDragEnd = (event) => {
    updateDragging({ source: null, over: null });
    updateDraggingHtml({ over: null });
};

const handleHelpToggle = (event) => {
    event.preventDefault();
    html.help.overlay.classList.toggle('help-overlay--visible');
};

const handleAddToggle = (event) => {
    event.preventDefault();
    html.add.overlay.classList.toggle('add-overlay--visible');
    html.add.title.value = '';
    html.add.table.selectedIndex = 0;
};

const handleAddSubmit = (event) => {
    event.preventDefault();
    const title = html.add.title.value.trim();
    const table = html.add.table.value;
    if (!title) return;

    const column = COLUMNS[0];
    const order = createOrderData({ title, table, column });
    state.orders[order.id] = order;

    const htmlOrder = createOrderHtml(order);
    html.area[column].appendChild(htmlOrder);

    html.add.overlay.classList.remove('add-overlay--visible');
};

const handleEditToggle = (event) => {
    event.preventDefault();
    const { id } = event.target.dataset;
    if (!id) return;
    const order = state.orders[id];
    if (!order) return;

    html.edit.id.value = order.id;
    html.edit.title.value = order.title;
    html.edit.table.value = order.table;
    html.edit.column.value = order.column;

    html.edit.overlay.classList.toggle('edit-overlay--visible');
};

const handleEditSubmit = (event) => {
    event.preventDefault();
    const id = html.edit.id.value.trim();
    const title = html.edit.title.value.trim();
    const table = html.edit.table.value;
    const column = html.edit.column.value;

    if (!title) return;

    const order = state.orders[id];
    if (!order) return;

    order.title = title;
    order.table = table;
    order.column = column;

    const htmlOrder = document.querySelector(`[data-id="${id}"]`);
    if (column !== order.column) {
        moveToColumn(id, column);
    } else {
        html.area[column].replaceChild(createOrderHtml(order), htmlOrder);
    }

    html.edit.overlay.classList.remove('edit-overlay--visible');
};

const handleEditDelete = (event) => {
    event.preventDefault();
    const id = html.edit.id.value.trim();
    if (!id) return;
    const order = state.orders[id];
    if (!order) return;

    delete state.orders[id];

    const htmlOrder = document.querySelector(`[data-id="${id}"]`);
    htmlOrder.remove();

    html.edit.overlay.classList.remove('edit-overlay--visible');
};

html.other.grid.addEventListener('dragover', handleDragOver);
html.other.grid.addEventListener('dragstart', handleDragStart);
html.other.grid.addEventListener('dragend', handleDragEnd);

DragEnd);

function handleDragOver(event) {
event.preventDefault();
}

function handleDragStart(event) {
event.dataTransfer.setData("text/plain", event.target.id);
event.currentTarget.style.backgroundColor = "lightblue";
}

function handleDragEnd(event) {
event.currentTarget.style.backgroundColor = "";
}

function handleDrop(event) {
event.preventDefault();
const id = event.dataTransfer.getData("text/plain");
const draggableElement = document.getElementById(id);
const dropzone = event.target;
dropzone.appendChild(draggableElement);
}