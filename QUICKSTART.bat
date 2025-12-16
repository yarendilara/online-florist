@echo off
REM Quick Start Script for Online Florist (Windows)

echo =========================================
echo Online Florist - Quick Start
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✓ Dependencies installed
echo.

REM Seed database
echo Setting up database...
call npm run seed

if %errorlevel% neq 0 (
    echo ⚠️ Database seeding failed. Database may not have sample data.
) else (
    echo ✓ Database initialized with sample data
)

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo To start the server, run:
echo   npm start
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo Admin Credentials:
echo   Email: admin@florist.com
echo   Password: admin123
echo.
echo Customer Credentials:
echo   Email: customer@florist.com
echo   Password: customer123
echo.
echo =========================================
pause
