// Shop page functionality

let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  await loadProducts();
  setupEventListeners();
});

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    allCategories = categories;
    
    const select = document.getElementById('categoryFilter');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadProducts(categoryName = null, searchQuery = null) {
  try {
    let url = '/api/products';
    if (categoryName) {
      url += `?category=${encodeURIComponent(categoryName)}`;
    }
    
    const response = await fetch(url);
    let products = await response.json();
    
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    allProducts = products;
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    const container = document.getElementById('productsContainer');
    container.innerHTML = '<div class="alert alert-error">Failed to load products</div>';
  }
}

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>No products found</h3></div>';
    return;
  }
  
  container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function setupEventListeners() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  
  categoryFilter.addEventListener('change', async (e) => {
    const categoryName = e.target.value;
    const searchQuery = searchInput.value;
    await loadProducts(categoryName, searchQuery);
  });
  
  searchInput.addEventListener('input', async (e) => {
    const searchQuery = e.target.value;
    const categoryName = categoryFilter.value;
    await loadProducts(categoryName, searchQuery);
  });
}
