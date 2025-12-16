const Category = require('../models/Category');

class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await Category.getAll();
      return res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json(category);
    } catch (error) {
      console.error('Get category error:', error);
      return res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const existing = await Category.findByName(name);
      if (existing) {
        return res.status(400).json({ error: 'Category already exists' });
      }

      const categoryId = await Category.create(name, description || '');
      const category = await Category.findById(categoryId);

      return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      console.error('Create category error:', error);
      return res.status(500).json({ error: 'Failed to create category' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      await Category.update(id, name, description || '');
      const updatedCategory = await Category.findById(id);

      return res.json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      console.error('Update category error:', error);
      return res.status(500).json({ error: 'Failed to update category' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await Category.delete(id);
      return res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
  }
}

module.exports = CategoryController;
