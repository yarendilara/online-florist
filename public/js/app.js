// Main application file with utility functions

// Update UI based on authentication status
async function updateAuthUI() {
  try {
    const response = await fetch('/api/auth/profile');
    if (response.ok) {
      const user = await response.json();
      document.getElementById('userGreeting').textContent = `Hi, ${user.username}`;
      document.getElementById('loginLink').style.display = 'none';
      document.getElementById('registerLink').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'inline-block';
      document.getElementById('ordersLink').style.display = 'inline-block';
      
      if (user.is_admin) {
        document.getElementById('adminLink').style.display = 'inline-block';
      }
    }
  } catch (error) {
    // User not logged in
  }
}

// Logout function
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  }

  updateAuthUI();
});

// Utility function to show alerts
function showAlert(container, message, type = 'info') {
  const isBody = !container || container === document.body;

  // Create or reuse a toast container when targeting the body
  let target = container;
  if (isBody) {
    target = document.getElementById('toastContainer');
    if (!target) {
      target = document.createElement('div');
      target.id = 'toastContainer';
      target.style.position = 'fixed';
      target.style.top = '16px';
      target.style.right = '16px';
      target.style.zIndex = '9999';
      target.style.display = 'flex';
      target.style.flexDirection = 'column';
      target.style.gap = '8px';
      document.body.appendChild(target);
    }
  }

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  alertDiv.style.borderRadius = '8px';
  alertDiv.style.padding = '12px 16px';
  alertDiv.style.background = '#fff';

  // Do not clear the target content; simply append the alert
  (target || document.body).appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 2500);
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    currencyDisplay: 'symbol'
  }).format(price);
}

// Create product card HTML
function createProductCard(product) {
  const imageUrl = product.image_path || '/images/placeholder.svg';
  const stockClass = product.stock_quantity > 0 ? 'text-success' : 'text-danger';
  const stockText = product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock';

  return `
    <div class="product-card">
      <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='/images/placeholder.svg'">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category_name || 'Uncategorized'}</div>
        <div class="product-description">${product.description || 'No description'}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-stock ${stockClass}">${stockText}</div>
        <div class="product-actions">
          <a href="/product/${product.id}" class="btn btn-secondary btn-small">View Details</a>
          <button class="btn btn-small" onclick="addToCartQuick(${product.id})" ${product.stock_quantity <= 0 ? 'disabled' : ''}>Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

// Add to cart from product listing
async function addToCartQuick(productId) {
  try {
    const product = await fetch(`/api/products/${productId}`).then(r => r.json());
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_path: product.image_path
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showAlert(document.body, `${product.name} added to cart!`, 'success');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showAlert(document.body, 'Failed to add item to cart', 'error');
  }
}

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Clear cart
function clearCart() {
  localStorage.removeItem('cart');
}

// Calculate cart total
function calculateCartTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}
