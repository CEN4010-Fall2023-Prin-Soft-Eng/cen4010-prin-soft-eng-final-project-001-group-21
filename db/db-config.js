require('dotenv').config();
const knex = require('knex');

const connection = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
  };

// db-config.js
const db = knex({
    client: 'pg',
    connection: connection,
    debug:true,
    searchPath: ['knex', 'public'],
    pool: {
      min: 2,
      max: 100,
      idleTimeoutMillis: 5000,
      createTimeoutMillis: 5000,
      acquireTimeoutMillis: 10000,
      propagateCreateError: false
    }
  });
   
module.exports = db;
