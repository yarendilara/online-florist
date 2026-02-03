const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { requireAdmin } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for in-memory image uploads (serverless safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Public routes
router.get('/', ProductController.getAll);
router.get('/featured', ProductController.getFeatured);
router.get('/search', ProductController.search);
router.get('/:id', ProductController.getById);

// Admin routes
router.post('/', requireAdmin, upload.single('image'), ProductController.create);
router.put('/:id', requireAdmin, upload.single('image'), ProductController.update);
router.delete('/:id', requireAdmin, ProductController.delete);

module.exports = router;
