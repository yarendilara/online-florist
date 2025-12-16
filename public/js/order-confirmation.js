// Order confirmation page

document.addEventListener('DOMContentLoaded', async () => {
  await loadOrder();
});

async function loadOrder() {
  const orderId = getOrderIdFromURL();
  
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Order not found');
    }
    
    const order = await response.json();
    
    document.getElementById('orderId').textContent = `#${order.id}`;
    document.getElementById('orderStatus').textContent = order.status;
    
    const detailsHtml = `
      <p><strong>Name:</strong> ${order.customer_name}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Phone:</strong> ${order.phone_number}</p>
      <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
    `;
    document.getElementById('orderDetails').innerHTML = detailsHtml;
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${formatPrice(item.price)}</td>
      </tr>
    `).join('');
    document.getElementById('orderItems').innerHTML = itemsHtml;
    
    document.getElementById('orderTotal').textContent = formatPrice(order.total_price);
  } catch (error) {
    console.error('Error loading order:', error);
    document.querySelector('.container').innerHTML = '<div class="alert alert-error">Order not found</div>';
  }
}

function getOrderIdFromURL() {
  const path = window.location.pathname;
  return path.split('/').pop();
}
