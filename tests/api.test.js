// Basic tests for the Online Florist application

const request = require('supertest');
const app = require('./src/server');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const database = require('./src/utils/database');

describe('Online Florist API Tests', () => {
  let adminSession = null;
  let customerSession = null;

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.close();
  });

  describe('Authentication Tests', () => {
    test('Register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');
    });

    test('Login with valid credentials', async () => {
      await User.create('logintest', 'login@test.com', 'test123', false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'test123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    test('Login fails with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Product Tests', () => {
    test('Get all products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('Get product by ID', async () => {
      const products = await request(app).get('/api/products');
      
      if (products.body.length > 0) {
        const productId = products.body[0].id;
        const res = await request(app)
          .get(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
      }
    });

    test('Get featured products', async () => {
      const res = await request(app)
        .get('/api/products/featured');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Category Tests', () => {
    test('Get all categories', async () => {
      const res = await request(app)
        .get('/api/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Order Tests', () => {
    test('Create order requires login', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [],
          customerName: 'Test User',
          address: '123 Test St',
          phoneNumber: '555-0000'
        });

      expect(res.status).toBe(401);
    });
  });
});
