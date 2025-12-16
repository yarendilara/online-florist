// Orders listing page

document.addEventListener('DOMContentLoaded', async () => {
  await loadOrders();
});

async function loadOrders() {
  try {
    const response = await fetch('/api/orders/my-orders');
    
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      throw new Error('Failed to fetch orders');
    }
    
    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error('Error loading orders:', error);
    showAlert(document.getElementById('alertContainer'), 'Failed to load orders', 'error');
  }
}

function displayOrders(orders) {
  const emptyDiv = document.getElementById('emptyOrders');
  const container = document.getElementById('ordersContainer');
  
  if (orders.length === 0) {
    emptyDiv.style.display = 'block';
    container.style.display = 'none';
    return;
  }
  
  emptyDiv.style.display = 'none';
  container.style.display = 'block';
  
  const ordersHtml = orders.map(order => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="flex-between mb-2">
          <div>
            <h3>Order #${order.id}</h3>
            <p class="text-muted">${new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.3rem; color: var(--primary-color);">
              ${formatPrice(order.total_price)}
            </div>
            <div class="status-badge" style="
              display: inline-block;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              margin-top: 0.5rem;
              color: white;
              background-color: ${getStatusColor(order.status)};
            ">
              ${order.status}
            </div>
          </div>
        </div>
        
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #eee;">
        
        <div>
          <strong>Delivery To:</strong>
          <p>${order.customer_name}<br>${order.address}<br>${order.phone_number}</p>
        </div>
        
        <div style="margin-top: 1rem;">
          <strong>Items:</strong>
          <table style="margin-top: 0.5rem; width: 100%; border-collapse: collapse;">
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 0.5rem 0;">${item.name} x${item.quantity}</td>
                  <td style="text-align: right; padding: 0.5rem 0;">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = ordersHtml;
}

function getStatusColor(status) {
  switch(status) {
    case 'Pending': return '#f39c12';
    case 'Processing': return '#3498db';
    case 'Completed': return '#27ae60';
    case 'Cancelled': return '#e74c3c';
    default: return '#95a5a6';
  }
}
