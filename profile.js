document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
      return;
  }

  // Set username in navigation
  document.getElementById('userName').textContent = currentUser.fullName;
  
  // Load cart count
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  document.getElementById('cartCount').textContent = cart.length;

  // Fill form with user data
  document.getElementById('fullName').value = currentUser.fullName;
  document.getElementById('email').value = currentUser.email;
  document.getElementById('phone').value = currentUser.phone || '';

  // Handle password match checking
  const newPasswordField = document.getElementById('newPassword');
  const confirmPasswordField = document.getElementById('confirmPassword');
  const passwordMismatch = document.getElementById('passwordMismatch');

  function checkPasswordMatch() {
      if (newPasswordField.value && confirmPasswordField.value) {
          if (newPasswordField.value !== confirmPasswordField.value) {
              passwordMismatch.classList.remove('d-none');
              return false;
          }
      }
      passwordMismatch.classList.add('d-none');
      return true;
  }

  confirmPasswordField.addEventListener('input', checkPasswordMatch);
  newPasswordField.addEventListener('input', checkPasswordMatch);

  // Handle form submission
  document.getElementById('profileForm').addEventListener('submit', function(e) {
      e.preventDefault();

      // Check password match if a new password is being set
      if (newPasswordField.value && !checkPasswordMatch()) {
          return;
      }

      // Get current password for verification
      const currentPassword = document.getElementById('currentPassword').value;
      
      // Verify current password if trying to change password
      if (newPasswordField.value && currentPassword !== currentUser.password) {
          alert('Current password is incorrect');
          return;
      }

      // Update user information
      const updatedUser = {
          ...currentUser,
          fullName: document.getElementById('fullName').value,
          phone: document.getElementById('phone').value
      };

      // Update password if provided
      if (newPasswordField.value) {
          updatedUser.password = newPasswordField.value;
      }

      // Update in localStorage (in a real app, this would be a server request)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(user => user.email === currentUser.email);
      
      if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          alert('Profile updated successfully');
          
          // Clear password fields
          document.getElementById('currentPassword').value = '';
          document.getElementById('newPassword').value = '';
          document.getElementById('confirmPassword').value = '';
      }
  });

  // Handle logout
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
  });
});