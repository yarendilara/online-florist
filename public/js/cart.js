// Shopping cart functionality

document.addEventListener('DOMContentLoaded', () => {
  displayCart();
  setupEventListeners();
});

function displayCart() {
  const cart = getCart();
  const emptyMessage = document.getElementById('emptyCartMessage');
  const cartContent = document.getElementById('cartContent');
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    emptyMessage.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }
  
  emptyMessage.style.display = 'none';
  cartContent.style.display = 'block';
  
  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <tr>
      <td>${item.name}</td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
               onchange="updateQuantity(${index}, this.value)" 
               style="width: 60px;">
      </td>
      <td>${formatPrice(item.price * item.quantity)}</td>
      <td>
        <button class="btn btn-danger btn-small" onclick="removeFromCart(${index})">Remove</button>
      </td>
    </tr>
  `).join('');
  
  const total = calculateCartTotal(cart);
  document.getElementById('cartTotal').textContent = formatPrice(total);
}

function updateQuantity(index, newQuantity) {
  let cart = getCart();
  const quantity = parseInt(newQuantity);
  
  if (quantity < 1) {
    removeFromCart(index);
    return;
  }
  
  cart[index].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function setupEventListeners() {
  const proceedBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showAlert(document.getElementById('alertContainer'), 'Cart is empty', 'warning');
        return;
      }
      
      // Check if user is logged in
      fetch('/api/auth/profile')
        .then(r => {
          if (r.ok) {
            window.location.href = '/checkout';
          } else {
            window.location.href = '/login';
          }
        })
        .catch(() => window.location.href = '/login');
    });
  }
}
