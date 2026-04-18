// This script initializes sample data for the Canteen Food Ordering System
document.addEventListener('DOMContentLoaded', function() {
  initializeUsers();
  initializeMenuItems();
  initializeCategories();
});

// Initialize default users if none exist
function initializeUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Only initialize if no users exist
  if (users.length === 0) {
      const defaultUsers = [
          {
              fullName: 'Admin User',
              email: 'admin@example.com',
              password: 'admin123',
              phone: '1234567890',
              role: 'admin'
          },
          {
              fullName: 'Test User',
              email: 'user@example.com',
              password: 'user123',
              phone: '9876543210',
              role: 'customer'
          }
      ];
      
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      console.log('Default users initialized');
  }
}

// Initialize food categories if none exist
function initializeCategories() {
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  
  // Only initialize if no categories exist
  if (categories.length === 0) {
      const defaultCategories = [
          {
              id: 'cat1',
              name: 'Breakfast',
              description: 'Start your day with our delicious breakfast options'
          },
          {
              id: 'cat2',
              name: 'Lunch',
              description: 'Nutritious and filling lunch meals'
          },
          {
              id: 'cat3',
              name: 'Snacks',
              description: 'Quick bites for your hunger cravings'
          },
          {
              id: 'cat4',
              name: 'Beverages',
              description: 'Refreshing drinks to quench your thirst'
          },
          {
              id: 'cat5',
              name: 'Desserts',
              description: 'Sweet treats to end your meal'
          }
      ];
      
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      console.log('Default categories initialized');
  }
}

// Initialize menu items if none exist
function initializeMenuItems() {
  const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
  
  // Only initialize if no menu items exist
  if (menuItems.length === 0) {
      const defaultMenuItems = [
          {
              id: 'item1',
              name: 'Breakfast Sandwich',
              description: 'Egg, cheese, and choice of bacon or sausage on a toasted English muffin',
              price: 4.99,
              category: 'cat1',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item2',
              name: 'Chicken Salad',
              description: 'Fresh mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing',
              price: 8.99,
              category: 'cat2',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item3',
              name: 'Vegetable Wrap',
              description: 'Whole wheat wrap filled with hummus and fresh vegetables',
              price: 6.99,
              category: 'cat2',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item4',
              name: 'French Fries',
              description: 'Crispy golden fries served with ketchup',
              price: 2.99,
              category: 'cat3',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item5',
              name: 'Coffee',
              description: 'Freshly brewed coffee with your choice of milk and sugar',
              price: 1.99,
              category: 'cat4',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item6',
              name: 'Iced Tea',
              description: 'Refreshing iced tea, sweetened or unsweetened',
              price: 1.99,
              category: 'cat4',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item7',
              name: 'Chocolate Chip Cookie',
              description: 'Freshly baked chocolate chip cookie',
              price: 1.49,
              category: 'cat5',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item8',
              name: 'Fruit Cup',
              description: 'Assorted fresh fruit pieces',
              price: 3.99,
              category: 'cat3',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item9',
              name: 'Oatmeal',
              description: 'Hot oatmeal with choice of toppings',
              price: 3.49,
              category: 'cat1',
              image: 'https://via.placeholder.com/150',
              available: true
          },
          {
              id: 'item10',
              name: 'Pasta Salad',
              description: 'Rotini pasta with vegetables and Italian dressing',
              price: 4.99,
              category: 'cat2',
              image: 'https://via.placeholder.com/150',
              available: true
          }
      ];
      
      localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
      console.log('Default menu items initialized');
  }
}