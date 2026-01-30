const database = require('../utils/database');

class Product {
  static async create(name, description, price, stockQuantity, categoryId, imagePath = null) {
    const result = await database.run(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, image_path) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, stockQuantity, categoryId, imagePath]
    );
    return result.id;
  }

  static async findById(id) {
    const product = await database.get(
      `SELECT p.*, c.name as category_name FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );
    if (product) {
      product.price = parseFloat(product.price);
    }
    return product;
  }

  static async getAll(categoryId = null) {
    let query = `SELECT p.*, c.name as category_name FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id`;
    let params = [];
    
    if (categoryId) {
      query += ' WHERE p.category_id = ?';
      params = [categoryId];
    }
    
    query += ' ORDER BY p.created_at DESC';
    const products = await database.all(query, params);
    return products.map(p => ({ ...p, price: parseFloat(p.price) }));
  }

  static async getFeatured(limit = 6) {
    const products = await database.all(
      `SELECT p.*, c.name as category_name FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY p.created_at DESC LIMIT ?`,
      [limit]
    );
    return products.map(p => ({ ...p, price: parseFloat(p.price) }));
  }

  static async search(keyword) {
    return await database.all(
      `SELECT p.*, c.name as category_name FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.name LIKE ? OR p.description LIKE ? 
       ORDER BY p.name`,
      [`%${keyword}%`, `%${keyword}%`]
    );
  }

  static async update(id, name, description, price, stockQuantity, categoryId, imagePath) {
    const updateImageClause = imagePath ? ', image_path = ?' : '';
    const params = imagePath 
      ? [name, description, price, stockQuantity, categoryId, imagePath, id]
      : [name, description, price, stockQuantity, categoryId, id];

    await database.run(
      `UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?${updateImageClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );
  }

  static async delete(id) {
    await database.run('DELETE FROM products WHERE id = ?', [id]);
  }

  static async updateStock(id, quantity) {
    await database.run(
      'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, id]
    );
  }

  static async getCount() {
    const result = await database.get('SELECT COUNT(*) as count FROM products');
    return result.count;
  }
}

module.exports = Product;
