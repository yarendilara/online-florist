# Online Florist - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
├─────────────────────────────────────────────────────────────────┤
│  HTML Pages │ CSS Styles │ JavaScript Files │ LocalStorage Cart │
└────────────────────────┬────────────────────────────────────────┘
                         │
                   HTTP/REST APIs
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
├─────────────────────────────────────────────────────────────────┤
│  Routes          Controllers         Middleware                  │
│  ├─ /api/auth    ├─ AuthController   ├─ checkAuth              │
│  ├─ /api/products├─ ProductController├─ requireLogin           │
│  ├─ /api/orders  ├─ OrderController  ├─ requireAdmin           │
│  ├─ /api/categories                  │                         │
│  └─ /api/admin   └─ AdminController  └─ errorHandler          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                   Database Queries
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     SQLITE DATABASE                              │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                         │
│  ├─ users (id, username, email, password_hash, is_admin)       │
│  ├─ categories (id, name, description)                         │
│  ├─ products (id, name, price, stock, category_id, image_path)│
│  ├─ orders (id, user_id, total_price, status, customer_info) │
│  ├─ order_items (id, order_id, product_id, quantity, price)  │
│  └─ sessions (for session management)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

```
Customer Action
       │
       ▼
┌─────────────────┐
│ Browser/Client  │──────────────┐
│ (HTML/JS/CSS)   │              │
└─────────────────┘              │
                           HTTP Request
                                 │
                                 ▼
                         ┌──────────────────┐
                         │ Express Router   │
                         │ (routes/*.js)    │
                         └────────┬─────────┘
                                  │
                           URL Pattern Match
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Middleware       │
                         │ (auth.js)        │
                         └────────┬─────────┘
                                  │
                         Check Authentication
                           & Authorization
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Controller       │
                         │ (process request)│
                         └────────┬─────────┘
                                  │
                         Validate & Process
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Model/Database   │
                         │ (query data)     │
                         └────────┬─────────┘
                                  │
                         CRUD Operation
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ JSON Response    │
                         └────────┬─────────┘
                                  │
                         HTTP Response
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Browser Updates  │
                         │ Page/Display     │
                         └──────────────────┘
```

## MVC Architecture

```
                    ONLINE FLORIST
                       MVC PATTERN
                    
┌──────────────────────────────────────────────┐
│                 VIEW LAYER                   │
│        (HTML pages + CSS + JavaScript)       │
│                                              │
│  ├─ Public Pages (home, shop, product)     │
│  ├─ Auth Pages (login, register)           │
│  ├─ Cart Pages (cart, checkout)            │
│  ├─ Order Pages (confirmation, history)    │
│  └─ Admin Pages (dashboard, management)    │
└──────────────────────────────────────────────┘
                    │
            ▼──────────────────▼
         (HTTP Requests)  (JSON Responses)
            │─────────────────│
                    │
┌──────────────────────────────────────────────┐
│            CONTROLLER LAYER                  │
│     (Business Logic & Request Handling)      │
│                                              │
│  ├─ AuthController                         │
│  ├─ ProductController                      │
│  ├─ CategoryController                     │
│  ├─ OrderController                        │
│  └─ AdminController                        │
└──────────────────────────────────────────────┘
                    │
            ▼──────────────────▼
        (Validate)      (Query Requests)
            │─────────────────│
                    │
┌──────────────────────────────────────────────┐
│               MODEL LAYER                    │
│        (Data Access & Manipulation)          │
│                                              │
│  ├─ User Model                             │
│  ├─ Product Model                          │
│  ├─ Category Model                         │
│  └─ Order Model                            │
└──────────────────────────────────────────────┘
                    │
            ▼──────────────────▼
       (SQL Queries)    (Database Operations)
            │─────────────────│
                    │
             SQLite Database
```

## Data Flow: Shopping Process

```
START
  │
  ├─→ Browse Products
  │    └─→ GET /api/products
  │         └─→ Display Product Grid
  │
  ├─→ View Product Details
  │    └─→ GET /api/products/:id
  │         └─→ Display Product Page
  │
  ├─→ Add to Cart
  │    └─→ localStorage.setItem('cart', ...)
  │         └─→ Cart Updated Locally
  │
  ├─→ Review Cart
  │    └─→ localStorage.getItem('cart')
  │         └─→ Display Cart Items
  │
  ├─→ Checkout
  │    ├─→ Check if logged in
  │    │    └─→ Redirect to login if not
  │    │
  │    └─→ Fill Checkout Form
  │         └─→ Delivery Address
  │             Phone Number
  │             Confirmation
  │
  ├─→ Place Order
  │    └─→ POST /api/orders
  │         ├─→ Validate Items & Stock
  │         ├─→ Create Order Record
  │         ├─→ Update Product Stock
  │         ├─→ Clear Cart
  │         └─→ Redirect to Confirmation
  │
  └─→ View Confirmation
       └─→ Display Order #ID & Details
           Status Tracking
           Download Options (future)
END
```

## Admin Operations Flow

```
ADMIN LOGIN
  │
  ├─→ Authentication
  │    ├─→ POST /api/auth/login
  │    ├─→ Verify Email & Password
  │    ├─→ Check is_admin Flag
  │    └─→ Create Session
  │
  ├─→ Admin Dashboard
  │    ├─→ GET /api/admin/dashboard
  │    ├─→ Total Products Count
  │    ├─→ Total Orders Count
  │    ├─→ Total Revenue
  │    └─→ Recent Orders Display
  │
  ├─→ Product Management
  │    ├─→ GET /api/products (View All)
  │    ├─→ POST /api/products (Add New)
  │    │    ├─→ Upload Image
  │    │    └─→ Store in Database
  │    ├─→ PUT /api/products/:id (Edit)
  │    └─→ DELETE /api/products/:id (Delete)
  │
  ├─→ Category Management
  │    ├─→ GET /api/categories (View All)
  │    ├─→ POST /api/categories (Add New)
  │    ├─→ PUT /api/categories/:id (Edit)
  │    └─→ DELETE /api/categories/:id (Delete)
  │
  ├─→ Order Management
  │    ├─→ GET /api/orders (View All)
  │    ├─→ GET /api/orders/:id (View Details)
  │    └─→ PUT /api/orders/:id/status (Update Status)
  │         ├─→ Pending
  │         ├─→ Processing
  │         ├─→ Completed
  │         └─→ Cancelled
  │
  └─→ Logout
       └─→ POST /api/auth/logout
           Clear Session
```

## Database Relationships

```
                USERS (customers/admins)
                       │
                       │ (user_id)
                       │
                      ▼
                    ORDERS
                       │
        ┌──────────────┴──────────────┐
        │                             │
        │                            ▼
        │                      ORDER_ITEMS
        │                             │
        │                    ┌────────┘
        │                    │ (product_id)
        │                    │
        │                    ▼
        └───────────→    PRODUCTS
                             │
                      (category_id)
                             │
                             ▼
                        CATEGORIES

RELATIONSHIPS:
  Users (1) ──→ (Many) Orders
  Orders (1) ──→ (Many) OrderItems
  OrderItems (Many) ──→ (1) Products
  Products (Many) ──→ (1) Categories
```

## File Organization

```
online-florist/
│
├── PUBLIC/ (Frontend - Client Side)
│   ├── css/
│   │   └── style.css            (Main Stylesheet)
│   ├── js/
│   │   ├── app.js               (Shared Utils)
│   │   ├── home.js              (Home Page)
│   │   ├── shop.js              (Shop Page)
│   │   ├── product-detail.js    (Product Details)
│   │   ├── cart.js              (Cart Logic)
│   │   ├── checkout.js          (Checkout)
│   │   ├── login.js             (Login Form)
│   │   ├── register.js          (Register Form)
│   │   ├── orders.js            (Order History)
│   │   └── order-confirmation.js (Confirmation)
│   ├── admin/
│   │   ├── js/admin.js          (Admin Dashboard)
│   │   └── css/admin.css        (Admin Styles)
│   ├── images/                  (Product Images)
│   ├── index.html               (Home)
│   ├── shop.html                (Shop)
│   ├── login.html               (Login)
│   ├── register.html            (Register)
│   ├── cart.html                (Cart)
│   ├── checkout.html            (Checkout)
│   ├── order-confirmation.html  (Confirmation)
│   ├── orders.html              (Order History)
│   └── admin/dashboard.html     (Admin Panel)
│
├── SRC/ (Backend - Server Side)
│   ├── models/
│   │   ├── User.js              (User Model)
│   │   ├── Product.js           (Product Model)
│   │   ├── Category.js          (Category Model)
│   │   └── Order.js             (Order Model)
│   ├── controllers/
│   │   ├── AuthController.js    (Auth Logic)
│   │   ├── ProductController.js (Product Ops)
│   │   ├── CategoryController.js(Category Ops)
│   │   ├── OrderController.js   (Order Ops)
│   │   └── AdminController.js   (Admin Data)
│   ├── routes/
│   │   ├── auth.js              (Auth Routes)
│   │   ├── products.js          (Product Routes)
│   │   ├── categories.js        (Category Routes)
│   │   ├── orders.js            (Order Routes)
│   │   └── admin.js             (Admin Routes)
│   ├── middleware/
│   │   └── auth.js              (Auth Middleware)
│   ├── utils/
│   │   └── database.js          (Database Connection)
│   └── server.js                (Main Server)
│
├── DATABASE/
│   └── florist.db               (SQLite Database)
│
├── TESTS/
│   └── api.test.js              (Test Suite)
│
├── package.json
├── seed.js
└── [Documentation Files]
```

## Security Architecture

```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
         ▼
    VALIDATION
    ├─ Email Format Check
    ├─ Required Fields
    ├─ Input Sanitization
    └─ Type Checking
         │
         ▼
    AUTHENTICATION
    ├─ Check Session Exists
    ├─ Verify User ID
    └─ Load User Data
         │
         ▼
    AUTHORIZATION
    ├─ Check User Role
    ├─ Verify Admin Flag
    ├─ Check Resource Ownership
    └─ Apply Permissions
         │
         ▼
    DATABASE OPERATION
    ├─ Parameterized Query
    ├─ Foreign Key Check
    ├─ Constraint Validation
    └─ Transaction Handling
         │
         ▼
    RESPONSE
    ├─ JSON Encoding
    ├─ HTTP Status Code
    └─ Secure Headers
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Scalable code structure
- ✅ Security at multiple layers
- ✅ Proper data flow
- ✅ Maintainable codebase
