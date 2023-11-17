require('dotenv').config(); // require the dotenv package to read the .env file

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'mind12345',
      database: process.env.DB_NAME || 'mindmingle'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  },
  // ... additional configuration for other environments like staging, testing, and production ...
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // for example, provided by Heroku
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  }
};
