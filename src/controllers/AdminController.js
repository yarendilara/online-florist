const Product = require('../models/Product');
const Order = require('../models/Order');

class AdminController {
  static async getDashboard(req, res) {
    try {
      const productCount = await Product.getCount();
      const orderCount = await Order.getCount();
      const recentOrders = await Order.getRecentOrders(5);
      const totalRevenue = await Order.getTotalRevenue();

      const recentOrdersWithItems = await Promise.all(
        recentOrders.map(async (order) => {
          const items = await Order.getOrderItems(order.id);
          return { ...order, items };
        })
      );

      return res.json({
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        recentOrders: recentOrdersWithItems
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
}

module.exports = AdminController;
