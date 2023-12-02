require('dotenv').config();
const { Pool } = require('pg');

// Use the environment variables from your .env file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (error, results) => {
  if (error) {
    console.error('Connection test failed:', error);
  } else {
    console.log('Connection test succeeded:', results.rows);
  }
  pool.end(); // Make sure to close the connection after the test
});
