// Checkout page functionality

document.addEventListener('DOMContentLoaded', async () => {
  await loadOrderSummary();
  setupEventListeners();
});

async function loadOrderSummary() {
  const cart = getCart();
  
  if (cart.length === 0) {
    window.location.href = '/cart';
    return;
  }
  
  const summaryContainer = document.getElementById('orderSummaryItems');
  const totalElement = document.getElementById('orderSummaryTotal');
  
  summaryContainer.innerHTML = cart.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatPrice(item.price)}</td>
    </tr>
  `).join('');
  
  const total = calculateCartTotal(cart);
  totalElement.textContent = formatPrice(total);
}

function setupEventListeners() {
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', handleCheckout);
}

async function handleCheckout(e) {
  e.preventDefault();
  
  const cart = getCart();
  if (cart.length === 0) {
    showAlert(document.getElementById('alertContainer'), 'Cart is empty', 'error');
    return;
  }
  
  const customerName = document.getElementById('customerName').value.trim();
  const address = document.getElementById('address').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  
  if (!customerName || !address || !phoneNumber) {
    showAlert(document.getElementById('alertContainer'), 'Please fill all fields', 'warning');
    return;
  }
  
  const orderItems = cart.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: orderItems,
        customerName,
        address,
        phoneNumber
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to place order');
    }
    
    const order = await response.json();
    clearCart();
    window.location.href = `/order-confirmation/${order.order.id}`;
  } catch (error) {
    console.error('Checkout error:', error);
    showAlert(document.getElementById('alertContainer'), error.message, 'error');
  }
}
