document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
      // Redirect to home page if already logged in
      window.location.href = 'index.html';
      return;
  }

  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
          // Store current user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Redirect based on user role
          if (user.role === 'admin') {
              window.location.href = 'dashboard.html';
          } else {
              window.location.href = 'index.html';
          }
      } else {
          alert('Invalid email or password');
      }
  });

  // Initialize default users if none exist
  initializeDefaultUsers();
});

// Initialize default users if none exist
function initializeDefaultUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Only initialize if no users exist
  if (users.length === 0) {
      const defaultUsers = [
          {
              fullName: 'Admin User',
              email: 'admin@example.com',
              password: 'admin123',
              role: 'admin'
          },
          {
              fullName: 'Test User',
              email: 'user@example.com',
              password: 'user123',
              role: 'customer'
          }
      ];
      
      localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
}