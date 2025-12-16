const database = require('../utils/database');

class Order {
  static async create(userId, totalPrice, customerName, address, phoneNumber, items) {
    // Insert order
    const orderResult = await database.run(
      `INSERT INTO orders (user_id, total_price, customer_name, address, phone_number, status) 
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [userId, totalPrice, customerName, address, phoneNumber]
    );

    const orderId = orderResult.id;

    // Insert order items
    for (const item of items) {
      await database.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    return orderId;
  }

  static async findById(id) {
    return await database.get('SELECT * FROM orders WHERE id = ?', [id]);
  }

  static async getByUserId(userId) {
    return await database.all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  static async getAll() {
    return await database.all(
      `SELECT o.*, u.username, u.email FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
  }

  static async getOrderItems(orderId) {
    return await database.all(
      `SELECT oi.*, p.name, p.image_path FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
  }

  static async updateStatus(id, status) {
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }
    
    await database.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  }

  static async getCount() {
    const result = await database.get('SELECT COUNT(*) as count FROM orders');
    return result.count;
  }

  static async getRecentOrders(limit = 10) {
    return await database.all(
      `SELECT o.*, u.username, u.email FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC LIMIT ?`,
      [limit]
    );
  }

  static async getTotalRevenue() {
    const result = await database.get(
      "SELECT SUM(total_price) as revenue FROM orders WHERE status IN ('Completed', 'Processing')"
    );
    return result.revenue || 0;
  }
}

module.exports = Order;
