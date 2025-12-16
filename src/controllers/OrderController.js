const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {
  static async create(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Please login to place an order' });
      }

      const { items, customerName, address, phoneNumber } = req.body;

      // Validation
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order items are required' });
      }

      if (!customerName || !address || !phoneNumber) {
        return res.status(400).json({ error: 'Customer information is required' });
      }

      let totalPrice = 0;
      const processedItems = [];

      // Validate items and calculate total
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` });
        }

        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ error: `Not enough stock for ${product.name}` });
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;

        processedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });

        // Update stock
        await Product.updateStock(item.productId, item.quantity);
      }

      const orderId = await Order.create(
        req.session.user.id,
        totalPrice,
        customerName,
        address,
        phoneNumber,
        processedItems
      );

      const order = await Order.findById(orderId);
      const orderItems = await Order.getOrderItems(orderId);

      return res.status(201).json({ 
        message: 'Order placed successfully', 
        order: { ...order, items: orderItems }
      });
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if user owns this order or is admin
      if (order.user_id !== req.session.user?.id && !req.session.user?.is_admin) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const items = await Order.getOrderItems(id);
      return res.json({ ...order, items });
    } catch (error) {
      console.error('Get order error:', error);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  static async getByUserId(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Please login' });
      }

      const orders = await Order.getByUserId(req.session.user.id);
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await Order.getOrderItems(order.id);
          return { ...order, items };
        })
      );

      return res.json(ordersWithItems);
    } catch (error) {
      console.error('Get user orders error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  static async getAll(req, res) {
    try {
      const orders = await Order.getAll();
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await Order.getOrderItems(order.id);
          return { ...order, items };
        })
      );

      return res.json(ordersWithItems);
    } catch (error) {
      console.error('Get all orders error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await Order.updateStatus(id, status);
      const updatedOrder = await Order.findById(id);

      return res.json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
      console.error('Update order status error:', error);
      return res.status(500).json({ error: error.message || 'Failed to update order status' });
    }
  }
}

module.exports = OrderController;
