
// add order button
// Select the "Add Order" button
const addOrderBtn = document.querySelector('[data-add]');
const tableSelect = document.querySelector('[data-add-table]');
const submitOrderBtn = document.querySelector('[data-submit-order]');

// Add a click event listener to the "Add Order" button
addOrderBtn.addEventListener('click', () => {
  // Show the "Add Order" dialog
  const addOverlay = document.querySelector('[data-add-overlay]');
  addOverlay.showModal();

  // When the submit button is clicked, add the order to the selected table
  submitOrderBtn.addEventListener('click', () => {
    const tableId = tableSelect.value;
    const table = state.tables.find(table => table.id === tableId);
    const item = document.querySelector('[data-add-item]').value;
    const price = document.querySelector('[data-add-price]').value;

  // Add the new order to the table's orders array
  table.orders.push({ item, price });

  // Update the table's total cost
  table.total += parseFloat(price);
     


  // Update the UI to reflect the new order and total cost
  updateUI();

});
});
  
  // Select the "Cancel" button in the "Add Order" dialog
  const cancelBtn = document.querySelector('[data-add-cancel]');

  // Add a click event listener to the "Cancel" button
  cancelBtn.addEventListener('click', () => {
    // Hide the "Add Order" dialog
    const addOverlay = document.querySelector('[data-add-overlay]');
    addOverlay.close();
  });

  //? button
// Select the "Help" button
const helpBtn = document.querySelector('[data-help]');
const closeBtn = document.querySelector('[data-help-cancel]')

// Add a click event listener to the "Help" button
helpBtn.addEventListener('click', () => {
  // Show the "Help" overlay
  const helpOverlay = document.querySelector('[data-help-overlay]');
  helpOverlay.showModal();

  closeBtn.addEventListener('click', () => {
    helpOverlay.close()

  })
});