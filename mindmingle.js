const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Import Pool from 'pg' directly
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
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      res.json({ token });
  
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server error during login');
    }
});

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  try {
      const existingUser = await findUserByUsername(username);
      if (existingUser) {
          return res.status(409).send('Username already taken');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // You should implement createUser function or the logic to insert the user into the database here.
      // Example:
      // await createUser({ username, password: hashedPassword });
      
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
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/study-sessions', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const userStudySessions = await db('study_sessions').select('*').where('user_id', userId);
    res.json(userStudySessions);
  } catch (err) {
    console.error('Error fetching study sessions for user:', err);
    res.status(500).json({ error: 'Server error while fetching study sessions for user' });
  }
});

// Create Study Session
app.post('/api/study-sessions', authenticateToken, async (req, res) => {
  try {
    const { date, start_time, end_time, subject, notes } = req.body;
    const userId = req.user.userId; 

    const sessionData = {
      user_id: userId, 
      date,
      start_time,
      end_time,
      subject,
      notes,
    };

    const createdSession = await createStudySession(sessionData);
    res.status(201).json(createdSession[0]);
  } catch (err) {
    console.error('Error creating study session:', err);
    res.status(500).json({ error: 'Server error while creating study session' });
  }
});
// Error handling for the authenticateToken middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
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
