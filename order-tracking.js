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

  // Get the order ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  
  if (!orderId) {
      // Redirect to orders page if no order ID is provided
      window.location.href = 'orders.html';
      return;
  }
  
  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // Find the specific order
  const order = orders.find(o => o.id === orderId && (o.userId === currentUser.email || currentUser.role === 'admin'));
  
  if (!order) {
      // Order not found or doesn't belong to current user
      document.getElementById('orderDetailsContainer').innerHTML = `
          <div class="alert alert-danger">
              <h4>Order Not Found</h4>
              <p>The order you are looking for does not exist or you don't have permission to view it.</p>
              <a href="orders.html" class="btn btn-primary">Back to Orders</a>
          </div>
      `;
      return;
  }
  
  // Get all menu items for reference
  const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
  
  // Update order details
  document.getElementById('orderId').textContent = order.id;
  document.getElementById('orderDate').textContent = new Date(order.orderDate).toLocaleString();
  document.getElementById('orderStatus').textContent = order.status;
  
  // Set status badge color
  const statusBadge = document.getElementById('statusBadge');
  if (order.status === 'pending') {
      statusBadge.classList.add('bg-warning');
  } else if (order.status === 'preparing') {
      statusBadge.classList.add('bg-info');
  } else if (order.status === 'ready') {
      statusBadge.classList.add('bg-primary');
  } else if (order.status === 'delivered') {
      statusBadge.classList.add('bg-success');
  } else if (order.status === 'cancelled') {
      statusBadge.classList.add('bg-danger');
  }
  
  // Set payment method
  let paymentMethodText = '';
  if (order.paymentMethod.method === 'creditCard') {
      paymentMethodText = 'Credit/Debit Card';
      if (order.paymentMethod.cardNumber) {
          const last4 = order.paymentMethod.cardNumber.slice(-4);
          paymentMethodText += ` (ending in ${last4})`;
      }
  } else if (order.paymentMethod.method === 'mobilePayment') {
      paymentMethodText = 'Mobile Payment';
  } else {
      paymentMethodText = 'Pay at Counter';
  }
  document.getElementById('paymentMethod').textContent = paymentMethodText;
  
  // Set delivery details
  let deliveryText = order.delivery.method === 'pickup' ? 'Pickup from counter' : 'Deliver to table';
  if (order.delivery.tableNumber) {
      deliveryText += ` #${order.delivery.tableNumber}`;
  }
  document.getElementById('deliveryMethod').textContent = deliveryText;
  
  // Populate order items
  const orderItemsElement = document.getElementById('orderItems');
  
  order.items.forEach(item => {
      const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
      if (menuItem) {
          const itemTotal = menuItem.price * item.quantity;
          
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${menuItem.name}</td>
              <td>${item.quantity}</td>
              <td class="text-end">$${menuItem.price.toFixed(2)}</td>
              <td class="text-end">$${itemTotal.toFixed(2)}</td>
          `;
          orderItemsElement.appendChild(row);
      }
  });
  
  // Display totals
  document.getElementById('subtotal').textContent = `$${order.subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${order.tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${order.total.toFixed(2)}`;
  
  // Handle cancel order button (only show if order is pending)
  const cancelOrderBtn = document.getElementById('cancelOrderBtn');
  if (order.status === 'pending') {
      cancelOrderBtn.classList.remove('d-none');
      
      cancelOrderBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to cancel this order?')) {
              // Update order status
              order.status = 'cancelled';
              
              // Save updated orders to localStorage
              const updatedOrders = orders.map(o => o.id === order.id ? order : o);
              localStorage.setItem('orders', JSON.stringify(updatedOrders));
              
              // Refresh the page
              window.location.reload();
          }
      });
  }
  
  // Handle logout
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
  });
});