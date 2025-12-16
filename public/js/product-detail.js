// Product detail page

let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  const productId = getProductIdFromURL();
  await loadProductDetail(productId);
  setupEventListeners();
});

function getProductIdFromURL() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

async function loadProductDetail(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    
    if (!response.ok) {
      throw new Error('Product not found');
    }
    
    const product = await response.json();
    currentProduct = product;
    
    const imageUrl = product.image_path || '/images/placeholder.svg';
    const stockClass = product.stock_quantity > 0 ? 'text-success' : 'text-danger';
    const stockText = product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock';
    
    document.getElementById('productImage').src = imageUrl;
    document.getElementById('productImage').onerror = function() { this.src = '/images/placeholder.svg'; };
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = `Category: ${product.category_name || 'Uncategorized'}`;
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productStock').className = `product-stock ${stockClass}`;
    document.getElementById('productStock').textContent = stockText;
    document.getElementById('productDescription').textContent = product.description || 'No description available';
    
    const quantityInput = document.getElementById('quantityInput');
    quantityInput.max = product.stock_quantity;
    quantityInput.disabled = product.stock_quantity <= 0;
    
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.disabled = product.stock_quantity <= 0;
  } catch (error) {
    console.error('Error loading product:', error);
    document.querySelector('.container').innerHTML = '<div class="alert alert-error">Product not found</div>';
  }
}

function setupEventListeners() {
  document.getElementById('addToCartBtn').addEventListener('click', addToCart);
}

function addToCart() {
  if (!currentProduct) return;
  
  const quantity = parseInt(document.getElementById('quantityInput').value);
  
  if (quantity < 1) {
    showAlert(document.getElementById('productDetailsContainer'), 'Please select a valid quantity', 'warning');
    return;
  }
  
  let cart = getCart();
  const existingItem = cart.find(item => item.productId === currentProduct.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      quantity: quantity,
      image_path: currentProduct.image_path
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  const alertContainer = document.createElement('div');
  document.body.insertBefore(alertContainer, document.body.firstChild);
  showAlert(alertContainer, `${currentProduct.name} added to cart!`, 'success');
}
