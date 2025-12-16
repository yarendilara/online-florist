#!/bin/bash
# Quick Start Script for Online Florist

echo "========================================="
echo "Online Florist - Quick Start"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Seed database
echo "Setting up database..."
npm run seed

if [ $? -ne 0 ]; then
    echo "⚠️ Database seeding failed. Database may not have sample data."
else
    echo "✓ Database initialized with sample data"
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:3000"
echo ""
echo "Admin Credentials:"
echo "  Email: admin@florist.com"
echo "  Password: admin123"
echo ""
echo "Customer Credentials:"
echo "  Email: customer@florist.com"
echo "  Password: customer123"
echo ""
echo "========================================="
