const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { Pool } = require('pg');
const { getUsers, findUserById, createUser, updateUser, deleteUser, findUserByUsername, createStudySession } = require('./db/db-queries');
const db = require('./db/db-config');
db.debug(true);
console.log('Database URL:', process.env.DATABASE_URL);

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'your_secret_key', // Replace with your session secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Set up PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // If you're using SSL, you'll need the following line
    // ssl: { rejectUnauthorized: false }
  });
  
  /* LOGIN ROUTE */
app.post('/login', async (req, res) => {
    console.log('req.body: ',req.body)
    const { username, password } = req.body;
    try {
      // Retrieve user from the database using knex
      const user = await findUserByUsername(username);
      console.log('findUserByUsername called with:', username); // Add this line
      if (!user) {
        return res.status(401).send('No user found with this username');
      }
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send('Password incorrect');
      }
  
      // Create token  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      console.log('token variable: ', token)
      res.json({token}); // Send the token to the client
  
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server error during login');
    }
  });


/* SIGNUP ROUTE */
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(409).send('Username already taken'); // Conflict status
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10); // the number 10 is the salt rounds

        // Create the user in the database
        const newUser = await createUser({ username, password: hashedPassword });
        
        // Respond with a success message or token
        return res.status(201).send('User successfully created');
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Error signing up user');
    }
});

/* STUDY SESSIONS */
 

//Route to retrieve study sessions from the 'studysessions' table
app.get('/api/study-sessions', authenticateToken, async (req, res) => {
  console.log(req.user);
  const userId = req.user.userId;
  console.log('User ID:', userId); // Check if userId is correctly retrieved
  
  try {
    const userStudySessions = await db('study_sessions').select('*').where('user_id', userId);
    console.log(userStudySessions.toString());
    console.log('Fetched Study Sessions:', userStudySessions); // Check the fetched study sessions
    res.json(userStudySessions);
  } catch (err) {
    console.error('Error fetching study sessions for user:', err);
    res.status(500).json({ error: 'Server error while fetching study sessions for user' });
  }
});



// Import the createStudySession function from db-queries.js
app.post('/api/study-sessions', authenticateToken, async (req, res) => {
  try {
    // Extract study session data from the request body
    const { date, start_time, end_time, subject, notes } = req.body;
    const userId = req.user.userId;; //Get from JWT token 

    // Create an object with the session data
    const sessionData = {
      user_id: userId, //associate each session with user
      date,
      start_time,
      end_time,
      subject,
      notes,
    };

    // Insert the study session data into the 'study_sessions' table
    const createdSession = await createStudySession(sessionData);

    // Return a success response with the created study session
    res.status(201).json(createdSession[0]); // Assuming createdSession is an array with one item
  } catch (err) {
    console.error('Error creating study session:', err);
    res.status(500).json({ error: 'Server error while creating study session' });
  }
});




/*END STUDY SESSIONS API'S*/
// Database configuration

// Authentication middleware using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  // Decoding token without verifying - should only be used for debugging
  const decoded = jwt.decode(token);
  console.log(decoded); // Check the decoded payload

  // Verify token as usual
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log('Decoded JWT payload:', user); // This should display the decoded JWT payload
    next();
  });
}

// API routes
// (Define your API routes here)

// Serve Vue application
// Make sure the path to 'dist' is correct
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'homePage.html'));
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Webapp: http://localhost:${PORT}/`);
});
