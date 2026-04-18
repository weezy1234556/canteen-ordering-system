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
  
  // Get cart items
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Display cart count
  document.getElementById('cartCount').textContent = cart.length;
  
  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
      window.location.href = 'cart.html';
      return;
  }
  
  // Get all menu items for reference
  const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
  
  // Populate order summary
  const orderSummaryElement = document.getElementById('orderSummary');
  let subtotal = 0;
  
  cart.forEach(item => {
      const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
      if (menuItem) {
          const itemTotal = menuItem.price * item.quantity;
          subtotal += itemTotal;
          
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${menuItem.name}</td>
              <td>${item.quantity}</td>
              <td class="text-end">$${menuItem.price.toFixed(2)}</td>
              <td class="text-end">$${itemTotal.toFixed(2)}</td>
          `;
          orderSummaryElement.appendChild(row);
      }
  });
  
  // Calculate and display totals
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  
  // Handle payment method selection
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const creditCardDetails = document.getElementById('creditCardDetails');
  const mobilePaymentDetails = document.getElementById('mobilePaymentDetails');
  const payAtCounterDetails = document.getElementById('payAtCounterDetails');
  
  paymentMethods.forEach(method => {
      method.addEventListener('change', function() {
          creditCardDetails.classList.add('d-none');
          mobilePaymentDetails.classList.add('d-none');
          payAtCounterDetails.classList.add('d-none');
          
          if (this.value === 'creditCard') {
              creditCardDetails.classList.remove('d-none');
          } else if (this.value === 'mobilePayment') {
              mobilePaymentDetails.classList.remove('d-none');
          } else if (this.value === 'payAtCounter') {
              payAtCounterDetails.classList.remove('d-none');
          }
      });
  });
  
  // Handle delivery option selection
  const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
  const tableDetails = document.getElementById('tableDetails');
  
  deliveryOptions.forEach(option => {
      option.addEventListener('change', function() {
          if (this.value === 'tableDelivery') {
              tableDetails.classList.remove('d-none');
          } else {
              tableDetails.classList.add('d-none');
          }
      });
  });
  
  // Handle form submission
  document.getElementById('paymentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get selected payment method
      const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
      
      // Get selected delivery option
      const selectedDeliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
      
      // Additional details based on selections
      let paymentDetails = {};
      let deliveryDetails = { method: selectedDeliveryOption };
      
      if (selectedPaymentMethod === 'creditCard') {
          paymentDetails = {
              method: 'creditCard',
              cardNumber: document.getElementById('cardNumber').value,
              expiryDate: document.getElementById('expiryDate').value,
              cardName: document.getElementById('cardName').value
          };
      } else if (selectedPaymentMethod === 'mobilePayment') {
          paymentDetails = {
              method: 'mobilePayment',
              mobileNumber: document.getElementById('mobileNumber').value
          };
      } else {
          paymentDetails = { method: 'payAtCounter' };
      }
      
      if (selectedDeliveryOption === 'tableDelivery') {
          deliveryDetails.tableNumber = document.getElementById('tableNumber').value;
      }
      
      // Create the order
      const order = {
          id: Date.now().toString(),
          userId: currentUser.email,
          userName: currentUser.fullName,
          items: cart,
          subtotal: subtotal,
          tax: tax,
          total: total,
          paymentMethod: paymentDetails,
          delivery: deliveryDetails,
          status: 'pending',
          orderDate: new Date().toISOString()
      };
      
      // Save the order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear the cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Show success message and redirect
      alert('Order placed successfully! Your order ID is: ' + order.id);
      window.location.href = 'orders.html';
  });
  
  // Handle logout
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
  });
});