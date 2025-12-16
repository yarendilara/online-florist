// Admin panel functionality

let currentEditingProductId = null;
let currentEditingCategoryId = null;
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Check admin access
  try {
    const response = await fetch('/api/auth/profile');
    if (!response.ok || !(await response.json()).is_admin) {
      window.location.href = '/';
    }
  } catch (error) {
    window.location.href = '/';
  }

  updateAuthUI();
  await loadDashboard();
  await loadCategories();
  setupEventListeners();
});

async function loadDashboard() {
  try {
    const response = await fetch('/api/admin/dashboard');
    const data = await response.json();

    document.getElementById('totalProducts').textContent = data.totalProducts;
    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalRevenue').textContent = formatPrice(data.totalRevenue);

    const tbody = document.querySelector('#recentOrdersTable tbody');
    tbody.innerHTML = data.recentOrders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.username}</td>
        <td>${formatPrice(order.total_price)}</td>
        <td>
          <span style="
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            color: white;
            background-color: ${getStatusColor(order.status)};
            font-size: 0.85rem;
          ">
            ${order.status}
          </span>
        </td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    allCategories = await response.json();

    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Select Category</option>';
    allCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });

    loadCategoriesTable();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadCategoriesTable() {
  const tbody = document.querySelector('#categoriesTable tbody');
  tbody.innerHTML = allCategories.map(category => `
    <tr>
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td>${category.description || '-'}</td>
      <td class="action-buttons">
        <button class="btn btn-secondary btn-small" onclick="editCategory(${category.id})">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteCategory(${category.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();

    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${formatPrice(product.price)}</td>
        <td>${product.stock_quantity}</td>
        <td>${product.category_name || '-'}</td>
        <td class="action-buttons">
          <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function loadOrders() {
  try {
    const response = await fetch('/api/orders');
    const orders = await response.json();

    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.username}</td>
        <td>${formatPrice(order.total_price)}</td>
        <td>
          <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 0.3rem;">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td class="action-buttons">
          <button class="btn btn-secondary btn-small" onclick="viewOrderDetails(${order.id})">Details</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.dataset.section;
      showSection(section);
    });
  });

  // Forms
  document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
  document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);

  // Cancel buttons
  document.getElementById('cancelEditBtn').addEventListener('click', () => {
    currentEditingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.querySelector('#productForm button[type="submit"]').textContent = 'Add Product';
  });

  document.getElementById('cancelCategoryEditBtn').addEventListener('click', () => {
    currentEditingCategoryId = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('cancelCategoryEditBtn').style.display = 'none';
    document.querySelector('#categoryForm button[type="submit"]').textContent = 'Add Category';
  });
}

function showSection(section) {
  document.querySelectorAll('.admin-container').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(section).classList.add('active');

  document.querySelectorAll('.admin-nav-link').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  if (section === 'products') loadProducts();
  if (section === 'orders') loadOrders();
}

async function handleProductSubmit(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDescription').value);
  formData.append('price', document.getElementById('productPrice').value);
  formData.append('stockQuantity', document.getElementById('productStock').value);
  formData.append('categoryId', document.getElementById('productCategory').value);

  if (document.getElementById('productImage').files.length > 0) {
    formData.append('image', document.getElementById('productImage').files[0]);
  }

  try {
    const url = currentEditingProductId 
      ? `/api/products/${currentEditingProductId}` 
      : '/api/products';
    const method = currentEditingProductId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    showAlert(document.getElementById('alertContainer'), 
      `Product ${currentEditingProductId ? 'updated' : 'added'} successfully!`, 
      'success');

    currentEditingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.querySelector('#productForm button[type="submit"]').textContent = 'Add Product';
    loadProducts();
  } catch (error) {
    showAlert(document.getElementById('alertContainer'), error.message, 'error');
  }
}

async function handleCategorySubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('categoryName').value,
    description: document.getElementById('categoryDescription').value
  };

  try {
    const url = currentEditingCategoryId 
      ? `/api/categories/${currentEditingCategoryId}` 
      : '/api/categories';
    const method = currentEditingCategoryId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    showAlert(document.getElementById('categoryAlertContainer'), 
      `Category ${currentEditingCategoryId ? 'updated' : 'added'} successfully!`, 
      'success');

    currentEditingCategoryId = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('cancelCategoryEditBtn').style.display = 'none';
    document.querySelector('#categoryForm button[type="submit"]').textContent = 'Add Category';
    await loadCategories();
  } catch (error) {
    showAlert(document.getElementById('categoryAlertContainer'), error.message, 'error');
  }
}

async function editProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();

    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock_quantity;
    document.getElementById('productCategory').value = product.category_id;

    currentEditingProductId = id;
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    document.querySelector('#productForm button[type="submit"]').textContent = 'Update Product';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');

    showAlert(document.getElementById('alertContainer'), 'Product deleted successfully!', 'success');
    loadProducts();
  } catch (error) {
    showAlert(document.getElementById('alertContainer'), error.message, 'error');
  }
}

async function editCategory(id) {
  const category = allCategories.find(c => c.id === id);
  if (!category) return;

  document.getElementById('categoryName').value = category.name;
  document.getElementById('categoryDescription').value = category.description || '';

  currentEditingCategoryId = id;
  document.getElementById('cancelCategoryEditBtn').style.display = 'inline-block';
  document.querySelector('#categoryForm button[type="submit"]').textContent = 'Update Category';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');

    showAlert(document.getElementById('categoryAlertContainer'), 'Category deleted successfully!', 'success');
    await loadCategories();
  } catch (error) {
    showAlert(document.getElementById('categoryAlertContainer'), error.message, 'error');
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update');
    loadOrders();
  } catch (error) {
    console.error('Error updating order:', error);
    loadOrders(); // Reload to reset dropdown
  }
}

async function viewOrderDetails(orderId) {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) throw new Error('Order not found');

    const order = await response.json();

    const html = `
      <div>
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Customer:</strong> ${order.customer_name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Phone:</strong> ${order.phone_number}</p>
        <p><strong>Total:</strong> ${formatPrice(order.total_price)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>

        <h4 style="margin-top: 1rem;">Items:</h4>
        <table style="width: 100%; margin-top: 0.5rem;">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('orderDetailsContent').innerHTML = html;
    document.getElementById('orderDetailsModal').style.display = 'block';
  } catch (error) {
    console.error('Error loading order details:', error);
  }
}

function closeOrderDetails() {
  document.getElementById('orderDetailsModal').style.display = 'none';
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
