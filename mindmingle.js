const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const session = require('express-session');
require('dotenv').config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Set up PostgreSQL connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const pool = new Pool({
  connectionString: connectionString
});

// Utility function to query the database
const queryDatabase = async (queryText, queryParams) => {
  const client = await pool.connect();
  try {
    const res = await client.query(queryText, queryParams);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};

// Example database function
const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const users = await queryDatabase(query, [username]);
  return users[0]; // Assuming username is unique
};

// LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).send('No user found with this username');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Password incorrect');
    }

    const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Use the correct secret key
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '48h' });
    res.json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error during login');
  }
});

/// CREATE USER
// Example createUser function using a PostgreSQL database
async function createUser({ username, password, email }) {
  const client = await pool.connect(); // Assuming you have a PostgreSQL pool

  try {
    // Insert the new user into the database
    const query = `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const values = [username, password, email];
    const result = await client.query(query, values);

    if (result.rows.length === 1) {
      // User successfully created
      return result.rows[0].id;
    } else {
      // Insert failed
      throw new Error('User creation failed');
    }
  } finally {
    client.release(); // Release the database connection
  }
}

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).send('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user by calling the createUser function
    const userId = await createUser({ username, password: hashedPassword, email });

    return res.status(201).send('User successfully created');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Error signing up user');
  }
});

// STUDY SESSIONS ROUTES
// Authenticate Token Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  // Verify a JWT token using the correct secretKey
  const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Use the correct secret key
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = decoded;
    next();
  });
}

// Serve Vue application
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'login.html'));
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Webapp: http://localhost:${PORT}/`);
});
