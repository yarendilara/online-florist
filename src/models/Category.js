const database = require('../utils/database');

class Category {
  static async create(name, description = '') {
    const result = await database.run(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.id;
  }

  static async findById(id) {
    return await database.get('SELECT * FROM categories WHERE id = ?', [id]);
  }

  static async findByName(name) {
    return await database.get('SELECT * FROM categories WHERE name = ?', [name]);
  }

  static async getAll() {
    return await database.all('SELECT * FROM categories ORDER BY name');
  }

  static async update(id, name, description) {
    await database.run(
      'UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, id]
    );
  }

  static async delete(id) {
    await database.run('DELETE FROM categories WHERE id = ?', [id]);
  }
}

module.exports = Category;
