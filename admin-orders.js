// admin-orders.js - Handles the admin orders management functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if admin is logged in
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = 'login.html?redirect=admin-orders.html';
      return;