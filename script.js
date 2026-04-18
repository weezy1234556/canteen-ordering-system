// Global variables
let menuItems = [];
let cartItems = [];

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();

    // Setup event listeners
    setupEventListeners();

    // Load menu items
    loadMenuItems();

    // Load cart from localStorage
    loadCart();
});

// Initialize the application
function initializeApp() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLinks = document.querySelectorAll('.nav-link[href="login.html"]');
    
    if (isLoggedIn === 'true') {
        loginLinks.forEach(link => {
            link.innerHTML = '<i class="bi bi-person-circle"></i> Account';
            link.href = '#';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showAccountDropdown();
            });
        });
    }
}

// Show account dropdown (simulated)
function showAccountDropdown() {
    // In a real application, this would show a dropdown menu
    if (confirm('Would you like to log out?')) {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'index.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Register button on login page
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.show();
        });
    }
    
    // Login form submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate login (in a real application, this would validate against a server)
            localStorage.setItem('isLoggedIn', 'true');
            
            // Check if admin login is active
            const adminLoginBtn = document.getElementById('admin-login-btn');
            if (adminLoginBtn && adminLoginBtn.classList.contains('active')) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Admin login button on login page
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const userLoginBtn = document.getElementById('user-login-btn');
    if (adminLoginBtn && userLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            adminLoginBtn.classList.add('active');
            adminLoginBtn.classList.remove('btn-outline-primary');
            adminLoginBtn.classList.add('btn-primary');
            
            userLoginBtn.classList.remove('active');
            userLoginBtn.classList.remove('btn-primary');
            userLoginBtn.classList.add('btn-outline-primary');
        });
        
        userLoginBtn.addEventListener('click', function() {
            userLoginBtn.classList.add('active');
            userLoginBtn.classList.remove('btn-outline-primary');
            userLoginBtn.classList.add('btn-primary');
            
            adminLoginBtn.classList.remove('active');
            adminLoginBtn.classList.remove('btn-primary');
            adminLoginBtn.classList.add('btn-outline-primary');
        });
    }
    
    // Menu item click handlers
    const menuItemsContainer = document.getElementById('menu-items-container');
    if (menuItemsContainer) {
        menuItemsContainer.addEventListener('click', function(e) {
            const itemCard = e.target.closest('.food-item-card');
            if (itemCard) {
                const itemId = itemCard.getAttribute('data-id');
                openItemModal(itemId);
            }
        });
    }
    
    // Add to cart button in modal
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
    
    // Quantity adjustment buttons in modal
    const decreaseQuantityBtn = document.getElementById('decrease-quantity');
    const increaseQuantityBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('item-quantity');
    
    if (decreaseQuantityBtn && increaseQuantityBtn && quantityInput) {
        decreaseQuantityBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseQuantityBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
    
    // Search menu functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-menu');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchMenu(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchMenu(searchInput.value);
            }
        });
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
}

// Load menu items (simulated data)
function loadMenuItems() {
    // This would typically come from a server API
    menuItems = [
        {
            id: 1,
            name: 'Breakfast Sandwich',
            price: 4.99,
            category: 'breakfast',
            description: 'Egg, cheese and bacon on a toasted bagel.',
            image: 'https://via.placeholder.com/300x200.png?text=Breakfast+Sandwich'
        },
        {
            id: 2,
            name: 'Veggie Wrap',
            price: 5.99,
            category: 'lunch',
            description: 'Fresh vegetables, hummus and feta cheese in a spinach wrap.',
            image: 'https://via.placeholder.com/300x200.png?text=Veggie+Wrap'
        },
        {
            id: 3,
            name: 'Chicken Pasta',
            price: 8.99,
            category: 'dinner',
            description: 'Grilled chicken with pasta in a creamy sauce.',
            image: 'https://via.placeholder.com/300x200.png?text=Chicken+Pasta'
        },
        {
            id: 4,
            name: 'French Fries',
            price: 2.99,
            category: 'snacks',
            description: 'Crispy golden fries with a side of ketchup.',
            image: 'https://via.placeholder.com/300x200.png?text=French+Fries'
        },
        {
            id: 5,
            name: 'Iced Coffee',
            price: 3.49,
            category: 'beverages',
            description: 'Chilled coffee with milk and sugar.',
            image: 'https://via.placeholder.com/300x200.png?text=Iced+Coffee'
        },
        {
            id: 6,
            name: 'Cheese Pizza',
            price: 7.99,
            category: 'lunch',
            description: 'Classic cheese pizza with tomato sauce.',
            image: 'https://via.placeholder.com/300x200.png?text=Cheese+Pizza'
        }
    ];
    
    // Render menu items if on menu page
    const menuItemsContainer = document.getElementById('menu-items-container');
    if (menuItemsContainer) {
        renderMenuItems(menuItems);
    }
}

// Render menu items to the page
function renderMenuItems(items) {
    const container = document.getElementById('menu-items-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search-heart display-1 text-muted"></i>
                <h3 class="mt-3">No items found</h3>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'col-md-6 col-lg-4 mb-4';
        itemCard.innerHTML = `
            <div class="card food-item-card h-100 shadow-sm" data-id="${item.id}">
                <img src="${item.image}" class="card-img-top food-item-image" alt="${item.name}">
                <span class="badge bg-primary category-badge">${item.category}</span>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <h6 class="text-primary mb-0">$${item.price.toFixed(2)}</h6>
                    </div>
                    <p class="card-text text-muted small">${item.description}</p>
                    <button class="btn btn-sm btn-outline-primary w-100">Add to Cart</button>
                </div>
            </div>
        `;
        container.appendChild(itemCard);
    });
}

// Open item modal
function openItemModal(itemId) {
    const item = menuItems.find(item => item.id == itemId);
    if (!item) return;
    
    const modal = document.getElementById('menuItemModal');
    const modalTitle = document.getElementById('modal-item-title');
    const modalImage = document.getElementById('modal-item-image');
    const modalPrice = document.getElementById('modal-item-price');
    const modalDescription = document.getElementById('modal-item-description');
    const quantityInput = document.getElementById('item-quantity');
    const specialInstructions = document.getElementById('special-instructions');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    modalTitle.textContent = item.name;
    modalImage.src = item.image;
    modalImage.alt = item.name;
    modalPrice.textContent = `$${item.price.toFixed(2)}`;
    modalDescription.textContent = item.description;
    quantityInput.value = 1;
    specialInstructions.value = '';
    
    // Store the current item id for add to cart function
    addToCartBtn.setAttribute('data-id', item.id);
    
    // Show the modal
    const itemModal = new bootstrap.Modal(modal);
    itemModal.show();
}

// Add item to cart
function addToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const itemId = addToCartBtn.getAttribute('data-id');
    const quantity = parseInt(document.getElementById('item-quantity').value);
    const specialInstructions = document.getElementById('special-instructions').value;
    
    const item = menuItems.find(item => item.id == itemId);
    if (!item) return;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id == itemId);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item already in cart
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].specialInstructions = specialInstructions;
    } else {
        // Add new item to cart
        cartItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: quantity,
            specialInstructions: specialInstructions
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('menuItemModal'));
    modal.hide();
    
    // Show notification
    alert(`Added ${quantity} ${item.name} to cart!`);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartCount();
        
        // If on cart page, render cart items
        if (document.getElementById('cart-items-container')) {
            renderCartItems();
        }
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
    
    // If on cart page, update the place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = count === 0;
    }
}

// Render cart items to the cart page
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!container) return;
    
    if (cartItems.length === 0) {
        // Show empty cart message
        if (emptyCartMessage) {
            emptyCartMessage.classList.remove('d-none');
        }
        return;
    }
    
    // Hide empty cart message
    if (emptyCartMessage) {
        emptyCartMessage.classList.add('d-none');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Render cart items
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="row">
                <div class="col-md-2 col-3">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded cart-item-image">
                </div>
                <div class="col-md-10 col-9">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">${item.name}</h5>
                        <button class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <p class="text-muted mb-1">Quantity: ${item.quantity}</p>
                            <p class="mb-0">Price: $${item.price.toFixed(2)} each</p>
                        </div>
                        <h6 class="text-primary mb-0">$${itemTotal.toFixed(2)}</h6>
                    </div>
                    ${item.specialInstructions ? `<p class="text-muted small mb-0">Note: ${item.specialInstructions}</p>` : ''}
                </div>
            </div>
        `;
        container.appendChild(cartItemElement);
        
        // Add event listener to remove button
        const removeBtn = cartItemElement.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', function() {
            removeCartItem(index);
        });
    });
    
    // Add edit and continue shopping buttons
    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'text-end mt-3';
    buttonsRow.innerHTML = `
        <a href="menu.html" class="btn btn-outline-primary">Continue Shopping</a>
    `;
    container.appendChild(buttonsRow);
    
    // Update totals
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Remove item from cart
function removeCartItem(index) {
    cartItems.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Search menu
function searchMenu(query) {
    if (!query) {
        renderMenuItems(menuItems);
        return;
    }
    
    query = query.toLowerCase();
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    
    renderMenuItems(filteredItems);
}

// Place order
function placeOrder() {
    const paymentMethod = document.getElementById('payment-method').value;
    const pickupTime = document.getElementById('pickup-time').value;
    
    if (paymentMethod === 'Credit/Debit Card') {
        // Show payment modal in a real app
        alert('In a real application, this would show a payment form.');
    }
    
    // Simulate order placement
    setTimeout(() => {
        // Clear the cart
        cartItems = [];
        saveCart();
        updateCartCount();
        
        // Show success message and redirect
        alert(`Your order has been placed successfully! Please pick it up at ${pickupTime}.`);
        window.location.href = 'orders.html';
    }, 1000);
}

// For admin dashboard - these functions would be in a separate admin.js file in a real application
function loadAdminDashboard() {
    // This would fetch real data from a server in a production environment
    
    // Example stats for demonstration
    const stats = {
        totalOrders: 157,
        todayOrders: 24,
        pendingOrders: 8,
        revenue: 1245.78
    };
    
    // Update stats cards
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('today-orders').textContent = stats.todayOrders;
    document.getElementById('pending-orders').textContent = stats.pendingOrders;
    document.getElementById('revenue').textContent = `$${stats.revenue.toFixed(2)}`;
    
    // Example recent orders
    const recentOrders = [
        { id: 'ORD24685', user: 'Alice Smith', items: 3, total: 23.45, status: 'Completed', time: '10:15 AM' },
        { id: 'ORD24684', user: 'John Doe', items: 2, total: 15.75, status: 'Ready', time: '10:02 AM' },
        { id: 'ORD24683', user: 'Emily Johnson', items: 1, total: 8.99, status: 'Preparing', time: '09:48 AM' },
        { id: 'ORD24682', user: 'Michael Brown', items: 4, total: 32.50, status: 'Completed', time: '09:30 AM' }
    ];
    
    // Render recent orders table
    const recentOrdersTable = document.getElementById('recent-orders-table');
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = '';
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user}</td>
                <td>${order.items}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="badge ${order.status === 'Completed' ? 'bg-success' : order.status === 'Ready' ? 'bg-primary' : 'bg-warning'}">
                        ${order.status}
                    </span>
                </td>
                <td>${order.time}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-order-btn" data-id="${order.id}">View</button>
                </td>
            `;
            recentOrdersTable.appendChild(row);
        });
    }
}