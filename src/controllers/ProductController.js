const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductController {
  static async getAll(req, res) {
    try {
      const { category } = req.query;
      let products;

      if (category) {
        const categoryData = await Category.findByName(category);
        if (!categoryData) {
          return res.status(404).json({ error: 'Category not found' });
        }
        products = await Product.getAll(categoryData.id);
      } else {
        products = await Product.getAll();
      }

      return res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  static async getFeatured(req, res) {
    try {
      const products = await Product.getFeatured(6);
      return res.json(products);
    } catch (error) {
      console.error('Get featured products error:', error);
      return res.status(500).json({ error: 'Failed to fetch featured products' });
    }
  }

  static async search(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const products = await Product.search(q);
      return res.json(products);
    } catch (error) {
      console.error('Search products error:', error);
      return res.status(500).json({ error: 'Failed to search products' });
    }
  }

  static async create(req, res) {
    try {
      const { name, description, price, stockQuantity, categoryId } = req.body;
      let imagePath = null;

      // Validation
      if (!name || !description || !price || stockQuantity === undefined || !categoryId) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }

      // Check category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Handle image upload (store as data URL)
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        imagePath = `data:${req.file.mimetype};base64,${base64}`;
      }

      const productId = await Product.create(name, description, price, stockQuantity, categoryId, imagePath);
      const product = await Product.findById(productId);

      return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, stockQuantity, categoryId } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Validation
      if (!name || !description || !price || stockQuantity === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }

      let imagePath = product.image_path;
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        imagePath = `data:${req.file.mimetype};base64,${base64}`;
      }

      await Product.update(id, name, description, price, stockQuantity, categoryId, imagePath);
      const updatedProduct = await Product.findById(id);

      return res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await Product.delete(id);
      return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}

module.exports = ProductController;
