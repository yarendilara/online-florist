// Seed data script to populate database with sample products

const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const database = require('./src/utils/database');

async function seedDatabase() {
  try {
    await database.connect();
    console.log('Database connected. Starting seed...');

    // Create categories
    console.log('Creating categories...');
    async function getOrCreateCategory(name, description) {
      const existing = await Category.findByName(name);
      if (existing && existing.id) return existing.id;
      return await Category.create(name, description);
    }

    const roses = await getOrCreateCategory('Roses', 'Beautiful red and pink roses');
    const tulips = await getOrCreateCategory('Tulips', 'Vibrant tulips for spring');
    const lilies = await getOrCreateCategory('Lilies', 'Elegant white and pink lilies');
    const sunflowers = await getOrCreateCategory('Sunflowers', 'Bright and cheerful sunflowers');
    const bouquets = await getOrCreateCategory('Bouquets', 'Mixed flower arrangements');

    console.log('Categories created');

    // Create sample products
    console.log('Creating products...');
    async function createProductOnce(name, description, price, stock, categoryId, imagePath) {
      const existing = await database.get('SELECT id FROM products WHERE name = ?', [name]);
      if (existing && existing.id) return existing.id;
      return await Product.create(name, description, price, stock, categoryId, imagePath);
    }

    await createProductOnce(
      'Red Rose Bouquet',
      'Classic red roses for romantic occasions. Perfect for anniversaries and special dates.',
      29.99,
      50,
      roses,
      '/images/roses.jpg'
    );

    await createProductOnce(
      'Pink Rose Romance',
      'Dozen pink roses beautifully arranged in a vase.',
      34.99,
      30,
      roses,
      '/images/pink-roses.jpg'
    );

    await createProductOnce(
      'White Lily Arrangement',
      'Elegant white lilies with green foliage. Perfect for sympathy and peaceful moments.',
      34.99,
      25,
      lilies,
      '/images/lilies.jpg'
    );

    await createProductOnce(
      'Tulip Spring Mix',
      'Colorful mix of spring tulips in purple, red, and yellow.',
      24.99,
      40,
      tulips,
      '/images/tulips.jpg'
    );

    await createProductOnce(
      'Sunflower Happiness Box',
      'Bright sunflowers that bring sunshine and happiness to any room.',
      19.99,
      45,
      sunflowers,
      '/images/sunflowers.jpg'
    );

    await createProductOnce(
      'Mixed Rainbow Bouquet',
      'A vibrant mix of roses, tulips, and lilies in multiple colors.',
      39.99,
      20,
      bouquets,
      '/images/rainbow.jpg'
    );

    await createProductOnce(
      'Romantic Red Dozen',
      '12 premium red roses arranged with baby breath and greenery.',
      49.99,
      15,
      roses,
      '/images/red-dozen.jpg'
    );

    await createProductOnce(
      'Garden Fresh Mix',
      'Fresh assortment of seasonal flowers and greenery.',
      29.99,
      35,
      bouquets,
      '/images/garden-mix.jpg'
    );

    console.log('Products created');

    // Create admin user
    console.log('Creating admin user...');
    try {
      await User.create('admin', 'admin@florist.com', 'admin123', true);
      console.log('Admin user created - Email: admin@florist.com, Password: admin123');
    } catch (error) {
      console.log('Admin user may already exist');
    }

    // Create regular user
    console.log('Creating test customer...');
    try {
      await User.create('customer', 'customer@florist.com', 'customer123', false);
      console.log('Customer user created - Email: customer@florist.com, Password: customer123');
    } catch (error) {
      console.log('Customer user may already exist');
    }

    console.log('Database seeding completed successfully!');
    await database.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
