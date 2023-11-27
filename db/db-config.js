require('dotenv').config();
const knex = require('knex');

const connection = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_default_user',
  password: process.env.DB_PASSWORD || 'your_default_password',
  database: process.env.DB_NAME || 'mindmingle',
  port: process.env.DB_PORT || 5432
};

const db = knex({
  client: 'pg',
  connection: connection,
  searchPath: ['knex', 'public'],
  // Add pool configuration if needed, etc.
});


module.exports = db;
