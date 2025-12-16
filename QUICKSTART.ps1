#!/usr/bin/env pwsh
# Windows PowerShell setup script for Online Florist

Write-Host "========================================" -ForegroundColor Green
Write-Host "Online Florist - Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "[✓] Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[✗] Node.js not found. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "[✓] npm found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "[✗] npm not found." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[✓] Dependencies installed" -ForegroundColor Green
Write-Host ""

# Seed database
Write-Host "Setting up database..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Database initialized" -ForegroundColor Green
} else {
    Write-Host "[!] Database seeding had issues, but you can continue" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Then open your browser:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@florist.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"
