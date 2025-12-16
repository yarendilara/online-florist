const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', requireAdmin, CategoryController.create);
router.put('/:id', requireAdmin, CategoryController.update);
router.delete('/:id', requireAdmin, CategoryController.delete);

module.exports = router;
