#!/usr/bin/env bash
# Installation and setup verification script

echo "=================================================="
echo "Online Florist - Project Verification"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js first."
    exit 1
fi

echo ""

# Check npm
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found."
    exit 1
fi

echo ""

# Check project files
echo "Checking project files..."
FILES_TO_CHECK=(
    "package.json"
    "src/server.js"
    "src/models/User.js"
    "src/models/Product.js"
    "src/models/Category.js"
    "src/models/Order.js"
    "src/controllers/AuthController.js"
    "src/controllers/ProductController.js"
    "src/controllers/CategoryController.js"
    "src/controllers/OrderController.js"
    "src/controllers/AdminController.js"
    "src/routes/auth.js"
    "src/routes/products.js"
    "src/routes/categories.js"
    "src/routes/orders.js"
    "src/routes/admin.js"
    "src/middleware/auth.js"
    "src/utils/database.js"
    "public/index.html"
    "public/shop.html"
    "public/login.html"
    "public/register.html"
    "public/cart.html"
    "public/checkout.html"
    "public/orders.html"
    "public/admin/dashboard.html"
    "public/css/style.css"
    "public/js/app.js"
    "seed.js"
)

MISSING_FILES=0
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        ((MISSING_FILES++))
    fi
done

echo ""

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}All project files found!${NC}"
else
    echo -e "${YELLOW}Warning: $MISSING_FILES files are missing.${NC}"
fi

echo ""
echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo ""
echo "1. Install dependencies:"
echo "   npm install"
echo ""
echo "2. Seed the database:"
echo "   npm run seed"
echo ""
echo "3. Start the server:"
echo "   npm start"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "5. Admin access:"
echo "   Email: admin@florist.com"
echo "   Password: admin123"
echo ""
echo "=================================================="
