## Online Florist - Setup & Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Windows PowerShell or Command Prompt

### Quick Start

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Initialize Database
The database will be automatically created on first run. To seed with sample data:
```bash
npm run seed
```

#### 3. Start the Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Seeding Sample Data

The seed script creates:
- 5 product categories (Roses, Tulips, Lilies, Sunflowers, Bouquets)
- 8 sample products with detailed descriptions
- Admin account: admin@florist.com / admin123
- Customer account: customer@florist.com / customer123

Run the seed script:
```bash
npm run seed
```

### Default Admin Credentials
- Email: admin@florist.com
- Password: admin123

⚠️ **Important**: Change these credentials in production!

### Project Structure

```
online-florist/
├── public/                          # Frontend files served to browser
│   ├── css/
│   │   └── style.css               # Main stylesheet
│   ├── js/                         # Client-side JavaScript
│   │   ├── app.js                  # Shared utilities
│   │   ├── home.js, shop.js        # Page-specific scripts
│   │   ├── cart.js, checkout.js    # Shopping functionality
│   │   ├── login.js, register.js   # Authentication
│   │   └── orders.js               # Order management
│   ├── admin/                      # Admin panel
│   │   ├── dashboard.html
│   │   ├── js/admin.js
│   │   └── css/admin.css
│   ├── images/                     # Product images
│   ├── index.html, shop.html       # Public pages
│   ├── login.html, register.html   # Auth pages
│   ├── cart.html, checkout.html    # Shopping pages
│   └── orders.html                 # Order history
│
├── src/                            # Backend code
│   ├── controllers/                # Request handlers
│   │   ├── AuthController.js
│   │   ├── ProductController.js
│   │   ├── CategoryController.js
│   │   ├── OrderController.js
│   │   └── AdminController.js
│   ├── models/                     # Data models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/                     # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/                 # Express middleware
│   │   └── auth.js
│   ├── utils/                      # Utility functions
│   │   └── database.js             # Singleton database connection
│   └── server.js                   # Main server entry point
│
├── database/                       # SQLite database
│   └── florist.db
│
├── tests/                          # Test files
│   └── api.test.js
│
├── package.json
├── seed.js                         # Database seeding script
└── README.md
```

### Architecture

#### MVC Pattern
- **Models** (`src/models/`): Database models for User, Product, Category, Order
- **Views** (`public/*.html`): HTML templates and pages
- **Controllers** (`src/controllers/`): Business logic and request handling

#### Design Patterns
- **Singleton Pattern**: Database connection (`src/utils/database.js`)
  - Ensures only one database connection instance
  - Reused across all models

#### Database Schema
- **users**: Customer and admin accounts
- **categories**: Product categories
- **products**: Flower products with details
- **orders**: Customer orders
- **order_items**: Products in each order

### Features

#### Customer Features
- ✓ Browse products without login
- ✓ Register and login
- ✓ View product details
- ✓ Add products to cart (localStorage)
- ✓ Checkout and place orders
- ✓ View order history

#### Admin Features
- ✓ Admin dashboard with statistics
- ✓ Manage products (CRUD)
- ✓ Manage categories (CRUD)
- ✓ Upload product images
- ✓ View and update order status
- ✓ Recent orders overview

### Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Never stored in plaintext

2. **Session Management**
   - Express-session with 7-day expiration
   - Secure HTTP-only cookies

3. **Input Validation**
   - Required field validation
   - Email format validation
   - Price and quantity validation
   - Enum validation for status values

4. **Authorization**
   - Middleware checks for admin/user roles
   - Protected routes for admin features
   - User can only view their own orders

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

#### Orders
- `POST /api/orders` - Create order (requires login)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

#### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics

### Running Tests

```bash
npm test
```

Tests include:
- User registration and login
- Product fetching
- Category management
- Order authorization

### Performance Considerations

1. **Database Optimization**
   - Indexed columns for faster queries
   - Proper foreign keys for data integrity

2. **Frontend**
   - Cart stored in localStorage (no server calls)
   - Lazy loading images
   - CSS animations with hardware acceleration

3. **Response Times**
   - Target: < 2 seconds per page load
   - Database queries optimized with proper indexing

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
NODE_ENV=development
DB_PATH=./database/florist.db
SESSION_SECRET=your-secret-key-change-in-production
UPLOAD_PATH=./public/images
```

### Development Tips

1. **Hot Reload**
   - Use `npm start` for development
   - Restart server after backend changes

2. **Database Reset**
   - Delete `database/florist.db` to reset
   - Run `npm run seed` to repopulate

3. **Debugging**
   - Check browser console for client errors
   - Check terminal for server errors
   - Use browser DevTools Network tab

4. **Admin Panel Access**
   - Login with admin account
   - Navigate to `/admin`
   - Use navigation tabs to manage features

### Deployment Checklist

- [ ] Change `SESSION_SECRET` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Change admin credentials
- [ ] Set up proper HTTPS (set `cookie.secure = true`)
- [ ] Configure proper database backup
- [ ] Set up error logging
- [ ] Review security headers

### Troubleshooting

**Database Connection Error**
- Ensure `database/` directory exists
- Check file permissions
- Clear `database/florist.db` and restart

**Port Already in Use**
- Change PORT in `.env`
- Or kill existing process on port 3000

**Session Not Working**
- Clear browser cookies
- Ensure cookies are enabled
- Check SESSION_SECRET is set

**Image Upload Failed**
- Check `public/images/` directory permissions
- Ensure enough disk space
- Verify file is valid image format

### Support

For issues or questions:
1. Check error messages in browser console and server terminal
2. Review API endpoints in documentation above
3. Check database schema structure
4. Verify all dependencies are installed: `npm install`

---

**Version**: 1.0.0  
**Last Updated**: December 2024
