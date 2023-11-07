// test-db.js
const db = require('./db/db-config');

db.raw('SELECT 1+1 AS result')
  .then((result) => {
    console.log('Database connection successful:', result);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
