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
  secret: process.env.SESSION_SECRET || 'mindovermatter',
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

    // Fetch the user's name from the database here
    const userName = user.name; // Replace 'name' with the actual field name

    const secretKey = process.env.JWT_SECRET || 'mindovermatter'; // Use the correct secret key
    const token = jwt.sign({ userId: user.id, userName }, secretKey, { expiresIn: '48h' });
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

// GET route to retrieve usernames and emails of all users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT username, email FROM users';
    const users = await queryDatabase(query);

    // Send the list of users as a JSON response
    res.json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).send('Server error while retrieving users');
  }
});

function calculateStreak(activityTimestamps) {
  let streakCount = 0;
  let currentStreak = 0;
  const threshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  for (let i = 0; i < activityTimestamps.length - 1; i++) {
    const currentTime = new Date(activityTimestamps[i]);
    const nextTime = new Date(activityTimestamps[i + 1]);
    const timeDifference = nextTime - currentTime;

    if (timeDifference <= threshold) {
      currentStreak++;
    } else {
      // Streak is broken, reset the current streak
      currentStreak = 0;
    }

    if (currentStreak > streakCount) {
      streakCount = currentStreak;
    }
  }

  return streakCount;
}

// Record user activity and update streaks
app.post('/record-activity', async (req, res) => {
  const { user_id } = req.body;
  
  try {
    // Implement logic to record user activity and update streaks in the database here
    // Example: Store the activity timestamp in the database
    const timestamp = new Date(); // Replace this with the actual timestamp
    // Insert the timestamp into the database with the user_id
    const query = 'INSERT INTO user_activity (user_id, activity_timestamp) VALUES ($1, $2)';
    const values = [user_id, timestamp];
    await queryDatabase(query, values);

    // Respond with a success message
    res.status(200).json({ message: 'Activity recorded successfully.' });
  } catch (error) {
    console.error('Error recording activity:', error);
    res.status(500).json({ error: 'An error occurred while recording activity.' });
  }
});


// Calculate and retrieve streak information for a user
app.get('/get-streak', async (req, res) => {
  const { user_id } = req.query;
  
  try {
    // Implement logic to calculate and retrieve streak information based on user_id
    // Retrieve user activity timestamps from the database
    const query = 'SELECT activity_timestamp FROM user_activity WHERE user_id = $1 ORDER BY activity_timestamp ASC';
    const activityTimestamps = await queryDatabase(query, [user_id]);
    
    // Calculate the streak based on activity timestamps
    const streakCount = calculateStreak(activityTimestamps);

    // Respond with streak data (e.g., current streak count, friendly message, etc.)
    res.status(200).json({ streakCount, message: `Keep up the good work with a streak of ${streakCount}!` });
  } catch (error) {
    console.error('Error retrieving streak data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving streak data.' });
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
  const secretKey = process.env.JWT_SECRET || 'mind'; // Use the correct secret key
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
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Define a route for the personalized home page
app.get('/homePage', authenticateToken, (req, res) => {
  // Serve the 'homePage.html' file when the user is authenticated
  res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Webapp: http://localhost:${PORT}/`);
});
