const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { Pool } = require('pg');
const {findUserByEmail,getUsers, findUserById, createUser, updateUser, deleteUser, findUserByUsername, createStudySession } = require('./db/db-queries');
const db = require('./db/db-config');

// Set up the database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.on('connect', () => {
  console.log('Connected to the database');
});
pool.on('error', (err) => {
  console.error('Database connection error', err);
  process.exit(-1);
});
module.exports = pool;

// Initialize Express app
const app = express();

// Enable CORS and Body parser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error('Unhandled Error', err);
    res.status(500).send('Internal Server Error');
  });
app.use((err, req, res, next) => {
    console.error('Unhandled Error', err);
    if (err.code === '28P01') {
      // Handle invalid database credentials
      res.status(500).send('Internal Server Error due to database credentials');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
  
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
  
// Session configuration
app.use(session({
  secret: 'your_secret_key', // Replace with your session secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Check PostgreSQL connection
app.get('/health', async (req, res) => {
    try {
      // Perform a simple query to check the database connection
      const result = await db.raw('SELECT NOW()');
      // If the query succeeds, the database connection is healthy
      res.status(200).json({ status: 'ok', timestamp: result.rows[0].now });
    } catch (error) {
      // If the query fails, the database connection is not healthy
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  
// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).send('No user found with this username');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Password incorrect');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error during login');
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received');
    // Check the database health
    const dbHealth = await db.raw('SELECT NOW()');
    console.log('Database time:', dbHealth.rows[0].now);
    const { username, email, password } = req.body;
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log('Username already taken');
      return res.status(409).send('Username already taken');
    }
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      console.log('Email already in use');
      return res.status(409).send('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ username, email, password: hashedPassword });
    console.log('User successfully created:', userId);
    res.status(201).send({ userId, message: 'User successfully created' });

  } catch (err) {
    console.error('signup error: ', err);
    res.status(500).send({ message: 'Error signing up user', error: err.toString() });
  }
});

  


// Authentication middleware using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route to retrieve study sessions
app.get('/api/study-sessions', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  if (!userId) return res.status(400).send('User ID is missing in the token');

  try {
    const userStudySessions = await db('study_sessions').select('*').where('user_id', userId);
    res.json(userStudySessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching study sessions for user' });
  }
});

// Route to create study sessions
app.post('/api/study-sessions', authenticateToken, async (req, res) => {
  const { date, start_time, end_time, subject, notes } = req.body;
  const userId = req.user.userId;

  const sessionData = { user_id: userId, date, start_time, end_time, subject, notes };
  try {
    const createdSession = await createStudySession(sessionData);
    res.status(201).json(createdSession[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating study session' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5678; 
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
    console.log(`Webapp: http://localhost:${PORT}/`);
  });
  
  // Clean up when the Node process ends
  process.on('SIGTERM', () => {
      console.error('SIGTERM signal received: closing HTTP server');
      server.close( async () => {
        console.log('HTTP server closed');
        await db.destroy().then(() => {
        console.log('Knex connection pool destroyed');
        process.exit(0);
        });
      });
  });
  

