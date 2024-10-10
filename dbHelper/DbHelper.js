const { Client } = require("pg");

class DbHelper {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    this.client = new Client({ connectionString });
  }

  async connect() {
    await this.client.connect();
  }

  async disConnect() {
    await this.client.end();
  }

  async getAllUsers() {
    const result = await this.client.query(
      `SELECT username,first_name AS "firstName", last_name AS "lastName",email, role
      FROM users`
    );

    return result.rows;
  }

  async addUser(user) {
    await this.client.query(
      `INSERT INTO users 
        (username,password,first_name,last_name,email,role)
        VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        user.username,
        user.password,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
      ]
    );
  }

  async deleteUser(username) {
    await this.client.query(`DELETE FROM users WHERE username = $1`, [
      username,
    ]);
  }

  async getUserByUsername(username) {
    const result = await this.client.query(
      `SELECT username,first_name AS "firstName", last_name AS "lastName",email, role
      FROM users WHERE username = $1`,
      [username]
    );

    return result.rows[0];
  }
}

module.exports = DbHelper;
