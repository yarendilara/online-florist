const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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
