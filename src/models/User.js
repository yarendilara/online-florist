const database = require('../utils/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await database.run(
      'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, isAdmin ? 1 : 0]
    );
    return result.id;
  }

  static async findById(id) {
    const user = await database.get('SELECT id, username, email, is_admin FROM users WHERE id = ?', [id]);
    if (user) {
      user.is_admin = user.is_admin ? true : false;
    }
    return user;
  }

  static async findByEmail(email) {
    return await database.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findByUsername(username) {
    return await database.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
    
    return { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      is_admin: user.is_admin ? true : false 
    };
  }

  static async getAllAdmins() {
    return await database.all('SELECT id, username, email FROM users WHERE is_admin = 1');
  }
}

module.exports = User;
