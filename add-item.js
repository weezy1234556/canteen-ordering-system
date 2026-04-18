// add-item.js - Handles the admin add item functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if admin is logged in
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = 'login.html?redirect=add-item.html';
      return;
  }
  
  // Setup form submission
  document.getElementById('add-item-form').addEventListener('submit', function(e) {
      e.preventDefault();
      addNewItem();
  });
  
  // Setup image preview
  document.getElementById('item-image').addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
          const reader = new FileReader();
          reader.onload = function(e) {
              document.getElementById('item-image-preview').src = e.target.result;
              document.getElementById('item-image-preview').style.display = 'block';
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

// Function to add new item
function addNewItem() {
  // Get form values
  const name = document.getElementById('item-name').value;
  const category = document.getElementById('item-category').value;
  const price = parseFloat(document.getElementById('item-price').value);
  const status = document.getElementById('item-status').value;
  const description = document.getElementById('item-description').value;
  const imageInput = document.getElementById('item-image');
  
  // Validate image
  if (imageInput.files.length === 0) {
      showAlert('Please select an image for the food item.', 'danger');
      return;
  }
  
  // Process image
  const reader = new FileReader();
  reader.onload = function(e) {
      // Create new item object
      const newItem = {
          id: generateItemId(),
          name: name,
          category: category,
          price: price,
          status: status,
          description: description,
          image: e.target.result
      };
      
      // Get existing food items from local storage
      let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
      
      // Add new item
      foodItems.push(newItem);
      
      // Save to local storage
      localStorage.setItem('foodItems', JSON.stringify(foodItems));
      
      // Reset form
      document.getElementById('add-item-form').reset();
      document.getElementById('item-image-preview').style.display = 'none';
      
      // Show success message
      showAlert('Food item added successfully!', 'success');
      
      // Redirect to manage items page after 2 seconds
      setTimeout(function() {
          window.location.href = 'manage-items.html';
      }, 2000);
  };
  
  reader.readAsDataURL(imageInput.files[0]);
}

// Function to generate item ID
function generateItemId() {
  return 'item_' + Date.now();
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
  const formCard = document.querySelector('.card');
  formCard.insertBefore(alertDiv, formCard.firstChild);
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alertDiv);
      bsAlert.close();
  }, 3000);
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