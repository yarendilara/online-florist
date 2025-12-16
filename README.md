# Online Florist Website

A full-stack e-commerce platform for an online flower shop with customer shopping and admin management features.

## Features

- **Customer Features**
  - Browse flowers without login
  - Register and login
  - View product details
  - Add products to cart
  - Place orders
  - View order history

- **Admin Features**
  - Manage products (add, edit, delete)
  - Manage categories
  - Upload product images
  - View and update order status
  - Dashboard with statistics

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite3
- **Authentication**: Session-based with bcrypt password hashing

## Architecture

- **MVC Pattern**: Models, Views, Controllers
- **Design Pattern**: Singleton pattern for database connection
- **RESTful APIs**: For all backend operations

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open browser and navigate to `http://localhost:3000`

## Project Structure

```
online-florist/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Product images
│   └── index.html         # Home page
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── database/              # Database files
├── tests/                 # Test files
└── package.json
```

## Running Tests

```
npm test
```

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- Session-based authentication
- CSRF protection

## Default Admin Credentials

Email: admin@florist.com
Password: admin123

## Database

The application uses SQLite. The database is automatically initialized on first run.
