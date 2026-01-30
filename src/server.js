const express = require('express');
const session = require('express-session');
const path = require('path');
const database = require('./utils/database');
const { checkAuth } = require('./middleware/auth');
const User = require('./models/User');


require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: false, // Set to true in production with HTTPS
    httpOnly: true
  }
}));

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
      // Güvenli admin şifresi - çıktıyı gösterek
      const bcrypt = require('bcryptjs');
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await database.run(
        'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@florist.com', hashedPassword, true]
      );
      console.log('✓ Default admin user created');
      console.log('  Email: admin@florist.com');
      console.log('  Password: admin123');
      console.log('  (Production için şifreyi değiştir!)');
    }
  } catch (err) {
    console.error('Admin creation failed:', err);
  }
}

async function startServer() {
  try {
    // Veritabanına bağlan ve tabloları oluştur
    await database.connect();
    console.log('✓ Database bağlantı havuzu oluşturuldu');
    
    // Admin kullanıcı oluştur (eğer yoksa)
    setTimeout(ensureAdminUser, 500);
    
    app.listen(PORT, () => {
      console.log(`✓ Server çalışıyor: http://localhost:${PORT}`);
      console.log(`✓ Admin paneli: http://localhost:${PORT}/admin`);
    });
  } catch (error) {
    console.error('❌ Server başlatma hatası:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
