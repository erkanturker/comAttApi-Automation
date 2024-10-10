const Client = require("pg");

class DbHelper {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    this.client = new Client({ connectionString });
  }

  async connect() {
    await this.client.connect();
  }

  async getAllUsers() {
    const result = await this.client.query(
      `SELECT username,first_name AS "firstName", last_name AS "lastName,email, role
      FROM users`
    );

    return result.rows;
  }

  async disConnect() {
    await this.client.end();
  }
}

module.exports = DbHelper;
