const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/dashboard', requireAdmin, AdminController.getDashboard);

module.exports = router;
