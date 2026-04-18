// manage-items.js - Handles the admin item management functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if admin is logged in
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = 'login.html?redirect=manage-items.html';
      return;
  }
  
  // Load food items
  loadFoodItems();
  
  // Setup search functionality
  document.getElementById('search-btn').addEventListener('click', searchItems);
  document.getElementById('search-items').addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
          searchItems();
      }
  });
  
  // Setup category filter
  document.getElementById('category-filter').addEventListener('change', function() {
      filterItemsByCategory(this.value);
  });
  
  // Setup edit item functionality
  document.getElementById('save-edit-item').addEventListener('click', saveEditedItem);
  
  // Setup delete item functionality
  document.getElementById('confirm-delete-item').addEventListener('click', deleteItem);
  
  // Setup image preview for edit form
  document.getElementById('edit-item-image').addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
          const reader = new FileReader();
          reader.onload = function(e) {
              document.getElementById('edit-item-image-preview').src = e.target.result;
              document.getElementById('edit-item-image-preview').style.display = 'block';
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  });
  
  // Setup logout functionality
  document.getElementById('admin-logout-btn').addEventListener('click', function(e) {
      e.preventDefault();
      logout();
  });
});

// Function to load food items
function loadFoodItems() {
  // Get food items from local storage
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  const itemsTableBody = document.getElementById('items-table-body');
  const noItemsMessage = document.getElementById('no-items');
  
  if (foodItems.length === 0) {
      itemsTableBody.innerHTML = '';
      noItemsMessage.classList.remove('d-none');
      return;
  }
  
  noItemsMessage.classList.add('d-none');
  
  // Sort items alphabetically by name
  foodItems.sort((a, b) => a.name.localeCompare(b.name));
  
  // Display items
  itemsTableBody.innerHTML = '';
  foodItems.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.category = item.category;
      
      // Get status badge color
      const statusBadgeClass = item.status === 'available' ? 'bg-success' : 'bg-danger';
      
      row.innerHTML = `
          <td>
              <img src="${item.image}" alt="${item.name}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
          </td>
          <td>${item.name}</td>
          <td>${capitalizeFirstLetter(item.category)}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td><span class="badge ${statusBadgeClass}">${capitalizeFirstLetter(item.status)}</span></td>
          <td>
              <button class="btn btn-sm btn-primary edit-item-btn" data-id="${item.id}">
                  <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger delete-item-btn" data-id="${item.id}" data-name="${item.name}">
                  <i class="fas fa-trash"></i>
              </button>
          </td>
      `;
      
      itemsTableBody.appendChild(row);
  });
  
  // Add event listeners to edit buttons
  document.querySelectorAll('.edit-item-btn').forEach(button => {
      button.addEventListener('click', function() {
          const itemId = this.dataset.id;
          openEditItemModal(itemId);
      });
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-item-btn').forEach(button => {
      button.addEventListener('click', function() {
          const itemId = this.dataset.id;
          const itemName = this.dataset.name;
          openDeleteItemModal(itemId, itemName);
      });
  });
}

// Function to search items
function searchItems() {
  const searchTerm = document.getElementById('search-items').value.trim().toLowerCase();
  const rows = document.querySelectorAll('#items-table-body tr');
  
  rows.forEach(row => {
      const itemName = row.cells[1].textContent.toLowerCase();
      
      if (itemName.includes(searchTerm)) {
          row.style.display = '';
      } else {
          row.style.display = 'none';
      }
  });
}

// Function to filter items by category
function filterItemsByCategory(category) {
  const rows = document.querySelectorAll('#items-table-body tr');
  
  rows.forEach(row => {
      if (category === 'all' || row.dataset.category === category) {
          row.style.display = '';
      } else {
          row.style.display = 'none';
      }
  });
}

// Function to open edit item modal
function openEditItemModal(itemId) {
  // Get food items from local storage
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  // Find the specific item
  const item = foodItems.find(item => item.id === itemId);
  
  if (!item) return;
  
  // Populate edit form with item details
  document.getElementById('edit-item-id').value = item.id;
  document.getElementById('edit-item-name').value = item.name;
  document.getElementById('edit-item-category').value = item.category;
  document.getElementById('edit-item-price').value = item.price;
  document.getElementById('edit-item-status').value = item.status;
  document.getElementById('edit-item-description').value = item.description;
  
  // Display image preview
  const imagePreview = document.getElementById('edit-item-image-preview');
  imagePreview.src = item.image;
  imagePreview.style.display = 'block';
  
  // Show the modal
  const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
  editItemModal.show();
}

// Function to save edited item
function saveEditedItem() {
  const itemId = document.getElementById('edit-item-id').value;
  
  // Get food items from local storage
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  // Find the index of the item to edit
  const itemIndex = foodItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) return;
  
  // Get form values
  const name = document.getElementById('edit-item-name').value;
  const category = document.getElementById('edit-item-category').value;
  const price = parseFloat(document.getElementById('edit-item-price').value);
  const status = document.getElementById('edit-item-status').value;
  const description = document.getElementById('edit-item-description').value;
  
  // Update item data
  foodItems[itemIndex].name = name;
  foodItems[itemIndex].category = category;
  foodItems[itemIndex].price = price;
  foodItems[itemIndex].status = status;
  foodItems[itemIndex].description = description;
  
  // Update image if a new one is selected
  const imageInput = document.getElementById('edit-item-image');
  if (imageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
          foodItems[itemIndex].image = e.target.result;
          
          // Save updated food items to local storage
          localStorage.setItem('foodItems', JSON.stringify(foodItems));
          
          // Close modal
          const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
          editItemModal.hide();
          
          // Reload food items
          loadFoodItems();
          
          // Show success message
          showAlert('Item updated successfully!', 'success');
      };
      reader.readAsDataURL(imageInput.files[0]);
  } else {
      // Save updated food items to local storage
      localStorage.setItem('foodItems', JSON.stringify(foodItems));
      
      // Close modal
      const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
      editItemModal.hide();
      
      // Reload food items
      loadFoodItems();
      
      // Show success message
      showAlert('Item updated successfully!', 'success');
  }
}

// Function to open delete item modal
function openDeleteItemModal(itemId, itemName) {
  // Store item ID for delete confirmation
  document.getElementById('confirm-delete-item').dataset.id = itemId;
  
  // Display item name in confirmation message
  document.getElementById('delete-item-name').textContent = itemName;
  
  // Show the modal
  const deleteItemModal = new bootstrap.Modal(document.getElementById('deleteItemModal'));
  deleteItemModal.show();
}

// Function to delete item
function deleteItem() {
  const itemId = this.dataset.id;
  
  // Get food items from local storage
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  // Filter out the item to delete
  foodItems = foodItems.filter(item => item.id !== itemId);
  
  // Save updated food items to local storage
  localStorage.setItem('foodItems', JSON.stringify(foodItems));
  
  // Close modal
  const deleteItemModal = bootstrap.Modal.getInstance(document.getElementById('deleteItemModal'));
  deleteItemModal.hide();
  
  // Reload food items
  loadFoodItems();
  
  // Show success message
  showAlert('Item deleted successfully!', 'success');
}

// Function to show alert
function showAlert(message, type) {
  // Create alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Append alert to container
  const container = document.querySelector('.container');
  container.insertBefore(alertDiv, container.firstChild);
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alertDiv);
      bsAlert.close();
  }, 3000);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get current user from localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Function to logout user
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}