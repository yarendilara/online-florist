const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Global connection pool - reuse across serverless invocations
let globalPool = null;
let globalDb = null;

const USE_POSTGRES = !!process.env.DATABASE_URL;

class Database {
  constructor() {
    this.isPostgres = USE_POSTGRES;
  }

  async connect() {
    if (this.isPostgres) {
      if (!globalPool) {
        console.log('🔌 Creating new PostgreSQL pool...');
        globalPool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        });
        
        try {
          const client = await globalPool.connect();
          console.log('✅ Connected to PostgreSQL (Supabase)');
          client.release();
          await this.initializeTables();
        } catch (err) {
          console.error('❌ PostgreSQL connection failed:', err);
          throw err;
        }
      }
      return globalPool;
    } else {
      if (!globalDb) {
        const dbPath = path.join(__dirname, '../../database/florist.db');
        globalDb = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
              console.error('SQLite connection failed:', err);
              reject(err);
            } else {
              console.log('✓ Connected to SQLite database:', dbPath);
              db.run('PRAGMA journal_mode = WAL');
              resolve(db);
            }
          });
        });
        await this.initializeTables();
      }
      return globalDb;
    }
  }

  async initializeTables() {
    const timestamp = this.isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT ${this.isPostgres ? 'false' : '0'},
        created_at ${timestamp},
        updated_at ${timestamp}
      )`,
      
      `CREATE TABLE IF NOT EXISTS categories (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at ${timestamp},
        updated_at ${timestamp}
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        name TEXT NOT NULL,
        description TEXT,
        price ${this.isPostgres ? 'DECIMAL(10,2)' : 'REAL'} NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER,
        image_path TEXT,
        created_at ${timestamp},
        updated_at ${timestamp}${this.isPostgres ? ',' : ''}
        ${this.isPostgres ? 'CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES categories(id)' : 'FOREIGN KEY(category_id) REFERENCES categories(id)'}
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        user_id INTEGER NOT NULL,
        total_price ${this.isPostgres ? 'DECIMAL(10,2)' : 'REAL'} NOT NULL,
        status TEXT DEFAULT 'Pending',
        customer_name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        created_at ${timestamp},
        updated_at ${timestamp}${this.isPostgres ? ',' : ''}
        ${this.isPostgres ? 'CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)' : 'FOREIGN KEY(user_id) REFERENCES users(id)'}
      )`,
      
      `CREATE TABLE IF NOT EXISTS order_items (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price ${this.isPostgres ? 'DECIMAL(10,2)' : 'REAL'} NOT NULL${this.isPostgres ? ',' : ''}
        ${this.isPostgres ? 'CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id),' : 'FOREIGN KEY(order_id) REFERENCES orders(id),'}
        ${this.isPostgres ? 'CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)' : 'FOREIGN KEY(product_id) REFERENCES products(id)'}
      )`
    ];

    for (const sql of tables) {
      try {
        await this.run(sql);
      } catch (err) {
        if (err.code !== '42P07' && !err.message.includes('already exists')) {
          console.error('Table creation error:', err);
        }
      }
    }
  }

  run(sql, params = []) {
    if (this.isPostgres) {
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      
      if (querySQL.trim().toUpperCase().startsWith('INSERT') && !querySQL.toUpperCase().includes('RETURNING')) {
        querySQL = querySQL.trim().replace(/;?\s*$/, '') + ' RETURNING id';
      }
      
      return globalPool.query(querySQL, params).then(result => ({
        id: result.rows[0]?.id || null,
        changes: result.rowCount
      })).catch(err => {
        if (err.code === '42P07') return { id: null, changes: 0 };
        throw err;
      });
    } else {
      return new Promise((resolve, reject) => {
        globalDb.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, changes: this.changes });
        });
      });
    }
  }

  get(sql, params = []) {
    if (this.isPostgres) {
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      return globalPool.query(querySQL, params).then(result => result.rows[0]);
    } else {
      return new Promise((resolve, reject) => {
        globalDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  }

  all(sql, params = []) {
    if (this.isPostgres) {
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      return globalPool.query(querySQL, params).then(result => result.rows);
    } else {
      return new Promise((resolve, reject) => {
        globalDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  }

  async close() {
    if (this.isPostgres && globalPool) {
      await globalPool.end();
      globalPool = null;
    } else if (globalDb) {
      await new Promise((resolve, reject) => {
        globalDb.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      globalDb = null;
    }
  }
}

module.exports = new Database();
