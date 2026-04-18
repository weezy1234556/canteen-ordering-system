// cart.js - Handles cart functionality for the Canteen Food Ordering System

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('currentUser')) {
        // Redirect to login page if not logged in
        window.location.href = 'index.html';
        return;
    }
    
    // Load cart items
    loadCartItems();
    
    // Add event listeners
    document.getElementById('payment-method').addEventListener('change', togglePaymentFields);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    document.getElementById('checkout-form').addEventListener('submit', placeOrder);
    document.getElementById('logout-btn').addEventListener('click', logout);
  });
  
  // Function to load cart items from localStorage
  function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    // Update cart count in navigation
    document.getElementById('cart-count').textContent = cartItems.length;
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        cartEmptyMessage.classList.remove('d-none');
        cartItemsContainer.classList.add('d-none');
        return;
    } else {
        cartEmptyMessage.classList.add('d-none');
        cartItemsContainer.classList.remove('d-none');
    }
    
    // Clear existing items
    cartItemsElement.innerHTML = '';
    
    // Variables for calculating totals
    let subtotal = 0;
    
    // Add each item to the cart table
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image || 'images/food-placeholder.jpg'}" alt="${item.name}" class="me-2" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.category || 'Food Item'}</small>
                    </div>
                </div>
            </td>
            <td>₵${item.price.toFixed(2)}</td>
            <td>
                <div class="input-group" style="width: 120px;">
                    <button class="btn btn-sm btn-outline-secondary" type="button" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-sm btn-outline-secondary" type="button" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>₵${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </td>
        `;
        
        cartItemsElement.appendChild(tr);
    });
    
    // Calculate and display order summary
    const tax = subtotal * 0.125; // 12.5% tax (Ghana VAT)
    const deliveryFee = 10.00; // Fixed delivery fee in Cedis
    const total = subtotal + tax + deliveryFee;
    
    document.getElementById('subtotal').textContent = `₵${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₵${tax.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `₵${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `₵${total.toFixed(2)}`;
  }
  
  // Function to update item quantity
  function updateQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    cartItems[index].quantity += change;
    
    // Ensure quantity doesn't go below 1
    if (cartItems[index].quantity < 1) {
        cartItems[index].quantity = 1;
    }
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Reload cart display
    loadCartItems();
  }
  
  // Function to remove item from cart
  function removeItem(index) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Remove the item at the specified index
    cartItems.splice(index, 1);
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Reload cart display
    loadCartItems();
  }
  
  // Function to clear the entire cart
  function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('cartItems', JSON.stringify([]));
        loadCartItems();
    }
  }
  
  // Function to toggle payment fields based on payment method
  function togglePaymentFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cardDetails = document.getElementById('card-details');
    const momoDetails = document.getElementById('momo-details');
    
    // Hide all payment details first
    cardDetails.classList.add('d-none');
    momoDetails.classList.add('d-none');
    
    // Reset required fields
    document.getElementById('card-number').required = false;
    document.getElementById('card-name').required = false;
    document.getElementById('card-expiry').required = false;
    document.getElementById('card-cvv').required = false;
    
    if (document.getElementById('momo-network')) {
        document.getElementById('momo-network').required = false;
        document.getElementById('momo-number').required = false;
    }
    
    // Show and set required fields based on payment method
    if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
        cardDetails.classList.remove('d-none');
        
        // Make card fields required
        document.getElementById('card-number').required = true;
        document.getElementById('card-name').required = true;
        document.getElementById('card-expiry').required = true;
        document.getElementById('card-cvv').required = true;
    } else if (paymentMethod === 'momo') {
        momoDetails.classList.remove('d-none');
        
        // Make MoMo fields required
        document.getElementById('momo-network').required = true;
        document.getElementById('momo-number').required = true;
    }
  }
  
  // Function to place an order
  function placeOrder(event) {
    event.preventDefault();
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }
    
    // Get form values
    const deliveryAddress = document.getElementById('delivery-address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    // Calculate totals
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.125; // 12.5% tax (Ghana VAT)
    const deliveryFee = 10.00; // Fixed delivery fee in Cedis
    const total = subtotal + tax + deliveryFee;
    
    // Get payment details based on method
    let paymentDetails = {};
    
    if (paymentMethod === 'momo') {
        paymentDetails = {
            network: document.getElementById('momo-network').value,
            number: document.getElementById('momo-number').value
        };
    } else if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
        paymentDetails = {
            cardNumber: document.getElementById('card-number').value,
            cardName: document.getElementById('card-name').value,
            cardExpiry: document.getElementById('card-expiry').value
        };
    }
    
    // Create order object
    const order = {
        id: Date.now().toString(),
        items: cartItems,
        deliveryAddress: deliveryAddress,
        phone: phone,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        total: total,
        status: 'Pending',
        date: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('currentUser')).id
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cartItems', JSON.stringify([]));
    
    // Show success message and redirect
    alert('Order placed successfully! Your order ID is ' + order.id);
    window.location.href = 'orders.html';
  }
  
  // Function to handle logout
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }