// orders.js - Handles the user orders page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = getCurrentUser();
  if (!currentUser) {
      window.location.href = 'login.html?redirect=orders.html';
      return;
  }

  // Update cart count
  updateCartCount();
  
  // Load user orders
  loadUserOrders();
  
  // Setup filter buttons
  setupFilterButtons();
  
  // Setup logout functionality
  document.getElementById('logout-btn').addEventListener('click', function(e) {
      e.preventDefault();
      logout();
  });
});

// Function to load user orders
function loadUserOrders() {
  const currentUser = getCurrentUser();
  
  // Get orders from local storage
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // Filter orders for current user
  const userOrders = orders.filter(order => order.userId === currentUser.id);
  
  const ordersTableBody = document.getElementById('orders-table-body');
  const noOrdersMessage = document.getElementById('no-orders');
  
  if (userOrders.length === 0) {
      ordersTableBody.innerHTML = '';
      noOrdersMessage.classList.remove('d-none');
      return;
  }
  
  noOrdersMessage.classList.add('d-none');
  
  // Sort orders by date (newest first)
  userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Display orders
  ordersTableBody.innerHTML = '';
  userOrders.forEach(order => {
      const row = document.createElement('tr');
      row.dataset.status = order.status;
      
      // Calculate total items
      const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);
      
      // Get status badge color
      const statusBadgeClass = getStatusBadgeClass(order.status);
      
      row.innerHTML = `
          <td>${order.id}</td>
          <td>${formatDate(order.date)}</td>
          <td>${totalItems} item(s)</td>
          <td>$${order.total.toFixed(2)}</td>
          <td><span class="badge ${statusBadgeClass}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>
              <button class="btn btn-sm btn-info view-order-btn" data-id="${order.id}">
                  <i class="fas fa-eye"></i> View
              </button>
          </td>
      `;
      
      ordersTableBody.appendChild(row);
  });
  
  // Add event listeners to view buttons
  document.querySelectorAll('.view-order-btn').forEach(button => {
      button.addEventListener('click', function() {
          const orderId = this.dataset.id;
          showOrderDetails(orderId);
      });
  });
}

// Function to show order details in modal
function showOrderDetails(orderId) {
  // Get orders from local storage
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // Find the specific order
  const order = orders.find(order => order.id === orderId);
  
  if (!order) return;
  
  // Populate modal with order details
  document.getElementById('modal-order-id').textContent = order.id;
  document.getElementById('modal-order-date').textContent = formatDate(order.date);
  
  const statusElement = document.getElementById('modal-order-status');
  statusElement.textContent = capitalizeFirstLetter(order.status);
  statusElement.className = `badge ${getStatusBadgeClass(order.status)}`;
  
  // Calculate subtotal and tax
  const subtotal = order.total / 1.1; // Assuming 10% tax
  const tax = order.total - subtotal;
  
  document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('modal-tax').textContent = tax.toFixed(2);
  document.getElementById('modal-total').textContent = order.total.toFixed(2);
  
  // Populate order items
  const itemsContainer = document.getElementById('modal-order-items');
  itemsContainer.innerHTML = '';
  
  order.items.forEach(item => {
      const row = document.createElement('tr');
      const itemTotal = item.price * item.quantity;
      
      row.innerHTML = `
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td class="text-end">$${itemTotal.toFixed(2)}</td>
      `;
      
      itemsContainer.appendChild(row);
  });
  
  // Show the modal
  const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
  orderDetailsModal.show();
}

// Function to setup filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.orders-filter button');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Get filter value
          const filterValue = this.dataset.filter;
          
          // Filter orders
          filterOrders(filterValue);
      });
  });
}

// Function to filter orders
function filterOrders(filterValue) {
  const rows = document.querySelectorAll('#orders-table-body tr');
  
  rows.forEach(row => {
      if (filterValue === 'all' || row.dataset.status === filterValue) {
          row.style.display = '';
      } else {
          row.style.display = 'none';
      }
  });
}

// Helper function to get status badge class
function getStatusBadgeClass(status) {
  switch (status) {
      case 'pending':
          return 'bg-warning text-dark';
      case 'processing':
          return 'bg-info text-dark';
      case 'completed':
          return 'bg-success';
      case 'cancelled':
          return 'bg-danger';
      default:
          return 'bg-secondary';
  }
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get current user from localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Function to update cart count
function updateCartCount() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const userCart = cart.filter(item => item.userId === currentUser.id);
  
  const cartCount = userCart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = cartCount;
}

// Function to logout user
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}