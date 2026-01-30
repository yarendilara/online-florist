const express = require('express');
const session = require('express-session');
const path = require('path');
const database = require('./utils/database');
const { checkAuth } = require('./middleware/auth');
const User = require('./models/User');
const { seedDatabase } = require('../seed');


require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration with database store
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
};

// Use PostgreSQL session store in production
if (process.env.USE_POSTGRES === 'true' || process.env.NODE_ENV === 'production') {
  const pgSession = require('connect-pg-simple')(session);
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  sessionConfig.store = new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  });
}

app.use(session(sessionConfig));

// Auth middleware
app.use(checkAuth);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/shop.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/product-detail.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/checkout.html'));
});

app.get('/order-confirmation/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/order-confirmation.html'));
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/orders', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/orders.html'));
});

app.get('/admin', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

app.get('/admin/products', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/admin/products.html'));
});

app.get('/admin/categories', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/admin/categories.html'));
});

app.get('/admin/orders', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/admin/orders.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function ensureAdminUser() {
  try {
    const existingAdmin = await User.findByEmail('admin@florist.com');
    if (!existingAdmin) {
      await User.create('admin', 'admin@florist.com', 'admin123', true);
      console.log('✓ Default admin user created: admin@florist.com / admin123');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (err) {
    console.error('Admin creation failed:', err);
  }
}

async function startServer() {
  try {
    await database.connect();
    // Wait for tables to be created
    await new Promise(resolve => setTimeout(resolve, 1000));
    await ensureAdminUser();
    
    // Only seed if database is empty (check if products exist)
    const Product = require('./models/Product');
    const existingProducts = await Product.getAll();
    if (!existingProducts || existingProducts.length === 0) {
      console.log('Database is empty, running seed...');
      await seedDatabase();
    } else {
      console.log('✓ Database already seeded, skipping...');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
