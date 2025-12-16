// Home page functionality

document.addEventListener('DOMContentLoaded', async () => {
  await loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  try {
    const container = document.getElementById('featuredProducts');
    const response = await fetch('/api/products/featured');
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No products available yet</p></div>';
      return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Error loading featured products:', error);
    const container = document.getElementById('featuredProducts');
    container.innerHTML = '<div class="alert alert-error">Failed to load products</div>';
  }
}
