const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Determine which database to use - always use PostgreSQL if DATABASE_URL exists
const USE_POSTGRES = !!process.env.DATABASE_URL;

// Singleton pattern for database connection
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.db = null;
    this.pool = null;
    this.isPostgres = USE_POSTGRES;
    Database.instance = this;
  }

  async connect() {
    if (this.isPostgres) {
      return this.connectPostgres();
    } else {
      return this.connectSQLite();
    }
  }

  connectPostgres() {
    return new Promise((resolve, reject) => {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });

        this.pool.connect((err, client, release) => {
          if (err) {
            console.error('PostgreSQL connection failed:', err);
            reject(err);
          } else {
            console.log('✓ Connected to PostgreSQL (Supabase)');
            release();
            this.initializeTables().then(resolve).catch(reject);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  connectSQLite() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../../database/florist.db');

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('SQLite connection failed:', err);
          reject(err);
        } else {
          console.log('✓ Connected to SQLite database:', dbPath);
          this.db.run('PRAGMA journal_mode = WAL');
          this.initializeTables();
          resolve(this.db);
        }
      });
    });
  }

  async initializeTables() {
    const timestamp = this.isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

    // Create users table
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT ${this.isPostgres ? 'false' : '0'},
        created_at ${timestamp},
        updated_at ${timestamp}
      )
    `);

    // Create categories table
    await this.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at ${timestamp},
        updated_at ${timestamp}
      )
    `);

    // Create products table
    await this.run(`
      CREATE TABLE IF NOT EXISTS products (
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
      )
    `);

    // Create orders table
    await this.run(`
      CREATE TABLE IF NOT EXISTS orders (
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
      )
    `);

    // Create order items table
    await this.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id ${this.isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price ${this.isPostgres ? 'DECIMAL(10,2)' : 'REAL'} NOT NULL${this.isPostgres ? ',' : ''}
        ${this.isPostgres ? 'CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id),' : 'FOREIGN KEY(order_id) REFERENCES orders(id),'}
        ${this.isPostgres ? 'CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)' : 'FOREIGN KEY(product_id) REFERENCES products(id)'}
      )
    `);

    // Create sessions table
    await this.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        expires_at ${timestamp}
      )
    `);
  }

  run(sql, params = []) {
    if (this.isPostgres) {
      // Convert ? placeholders to $1, $2, etc. for PostgreSQL
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      
      // For INSERT statements, add RETURNING id if not already present
      if (querySQL.trim().toUpperCase().startsWith('INSERT') && !querySQL.toUpperCase().includes('RETURNING')) {
        querySQL = querySQL.trim().replace(/;?\s*$/, '') + ' RETURNING id';
      }
      
      return this.pool.query(querySQL, params).then(result => ({
        id: result.rows[0]?.id || null,
        changes: result.rowCount
      })).catch(err => {
        // Ignore table already exists errors
        if (err.code === '42P07') return { id: null, changes: 0 };
        throw err;
      });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      });
    }
  }

  get(sql, params = []) {
    if (this.isPostgres) {
      // Convert ? placeholders to $1, $2, etc.
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      return this.pool.query(querySQL, params).then(result => result.rows[0]);
    } else {
      return new Promise((resolve, reject) => {
        this.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }
  }

  all(sql, params = []) {
    if (this.isPostgres) {
      // Convert ? placeholders to $1, $2, etc.
      let querySQL = sql;
      let paramIndex = 1;
      querySQL = querySQL.replace(/\?/g, () => `$${paramIndex++}`);
      return this.pool.query(querySQL, params).then(result => result.rows);
    } else {
      return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  }

  async close() {
    if (this.isPostgres && this.pool) {
      await this.pool.end();
    } else if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}

module.exports = new Database();
