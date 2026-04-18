document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirmPassword');
  const passwordMismatch = document.getElementById('passwordMismatch');

  // Check if passwords match
  function checkPasswordMatch() {
      if (passwordField.value !== confirmPasswordField.value) {
          passwordMismatch.classList.remove('d-none');
          return false;
      } else {
          passwordMismatch.classList.add('d-none');
          return true;
      }
  }

  confirmPasswordField.addEventListener('input', checkPasswordMatch);

  registerForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!checkPasswordMatch()) {
          return;
      }

      // Get form data
      const userData = {
          fullName: document.getElementById('fullName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          password: passwordField.value,
          role: 'customer' // Default role for new registrations
      };

      // In a real application, you would send this data to a server
      // For this demo, we'll store it in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some(user => user.email === userData.email)) {
          alert('This email is already registered. Please use a different email or login.');
          return;
      }

      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! You can now log in.');
      window.location.href = 'login.html';
  });
});