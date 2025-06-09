const pool = require('../database/mysqlConnection');
 
class MySQLProductRepository {
  async create(product) {
    const { name, price, description } = product;
    const [result] = await pool.execute(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      [name, price, description]
    );
    return { id: result.insertId, ...product };
  }
 
  async getAll() {
    const [rows] = await pool.execute('SELECT * FROM products');
    return rows;
  }
}
 
module.exports = MySQLProductRepository;