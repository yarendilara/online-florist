const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// Customer routes
router.post('/', requireLogin, OrderController.create);
router.get('/my-orders', requireLogin, OrderController.getByUserId);
router.get('/:id', requireLogin, OrderController.getById);

// Admin routes
router.get('/', requireAdmin, OrderController.getAll);
router.put('/:id/status', requireAdmin, OrderController.updateStatus);

module.exports = router;
