const express = require('express');
const isAuthenticatedSession= require('./middleware/sessionAuth');
//initialize database connection using knex
const knexConfig=require('./knexfile').development;
const knex = require('knex')(require('./knexfile').development);
// Use destructuring assignment if you're exporting multiple functions
const { getUsers, findUserById, createUser, updateUser, deleteUser, findUserByUsername, createStudySession } = require('./db/db-queries');
console.log(createStudySession); // This should log the function if imported correctly

require('dotenv').config();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./db/db-config'); // Ensure this path is correct for your project
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { hashPassword, checkPassword} = require('./utils/auth');
// Initialize express-session
const request = require('supertest');
const router = express.Router();


app.use(session({
  // Session configuration
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/protected', isAuthenticatedSession, (req, res) => {
  res.status(200).send('Access granted to protected route');
});



// CORS setup
app.use(cors());
// Body-parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully. knex and .env are correct');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

  

// Adjust the Swagger definition for managing users instead of students
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'User Server API',
      version: '1.0.0'
    }
  },
  apis: ['mindmingle.js'] // Make sure this points to your new file name
};
 // EXPRESS ROUTES 
 app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser({ username, password: hashedPassword });
        res.redirect('/login.html');
    } catch (error) {
        if (error.code === '23505') {
            // This code is for unique violation
            res.status(409).send('Username already exists. Please choose another one.');
        } else {
            console.error(error);
            res.status(500).send('Error during signup');
        }
    }
});
  
// Login Route
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
      
      req.session.userId = user.id; // Set the user ID in the session
      res.redirect('/'); // Redirect to the root, which should be your main page
    } catch (err) {
      console.error(err);
      res.status(500).send('Error logging in user');
    }
});

  
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/protected-route');
      }
  
      res.clearCookie('connect.sid'); // this may vary based on your session cookie's name
      res.redirect('/login.html');
    });
  });

/* PROTECTED ROUTES */
 
app.get('/protected', (req, res) => {
  res.status(200).send('Access granted to protected route');
});


/*******************STUDY SESSIONS API***************************/
// Express route for creating a new study session
 
app.post('/api/study-sessions', isAuthenticatedSession, async (req, res) => {
    if (!req.session.userId) {
      return res.status(403).send('You must be logged in to create a study session.');
    }
    
    // Destructure and validate the input
    const { date, start_time, end_time, subject, notes } = req.body;
    if (!date || !start_time || !end_time || !subject) { // Basic validation
      return res.status(400).send('Missing required fields: date, start_time, end_time, subject.');
    }
  
    // Further validation can be performed here (e.g., date format, time validation, etc.)
    try {
        // Attempt to create a study session in the database
        const newSession = await createStudySession({
          user_id: req.session.userId,
          date,
          start_time,
          end_time,
          subject,
          notes
        });
        res.status(201).json(newSession);
      } catch (error) {
        // Log the error for server side debugging
        console.error("An error occurred:", error);
      
        // Handle specific known error types
        if (error.name === 'ValidationError') {
          res.status(400).json({ error: error.message });
        } else if (error.name === 'UniqueConstraintError') {
          res.status(409).json({ error: "A study session with the given details already exists." });
        } else {
          // For all other errors, send a generic error message
          res.status(500).json({ error: "Could not create study session due to an unexpected error." });
        }
      }      
  });
  

/******************* END STUDY SESSIONS API ************************/
/******* CHECK USER *********/
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Now, a request to the root would automatically serve "index.html" from the "public" directory

app.get('/', (req, res) => {
    // You should adjust the path to where your `index.html` is actually located.
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
// check for a logged in user
app.get('/session', (req, res) => {
    if (req.session.userId) {
      res.json({ userId: req.session.userId });
    } else {
      res.status(401).json({ userId: null });
    }
  });
  

 
const PORT = process.env.PORT || 5678;
app.use(express.static('public'));
const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}...`);
   console.log(`Webapp:   http://localhost:${PORT}/`);
   console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = { app, server }; // Keep exporting both for testing purposes
