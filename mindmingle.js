const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { Pool } = require('pg');
const { getUsers, findUserById, createUser, updateUser, deleteUser, findUserByUsername, createStudySession,findScheduledExamsByUserId, createScheduledExam} = require('./db/db-queries');
const db = require('./db/db-config');

// Initialize Express app
const app = express();

// Enable CORS and Body parser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

// Session configuration
app.use(session({
  secret: 'mindovermatter', // Replace with your session secret
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
  const { username, email, password } = req.body;
  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    // If the insert was successful, send back a success response
    res.status(201).json({ userId: result.rows[0].id, message: 'User successfully created' });
  } catch (error) {
    // Check for unique constraint violation errors
    if (error.code === '23505') {
      if (error.detail.includes('username')) {
        res.status(409).json({ error: 'Username already taken' });
      } else if (error.detail.includes('email')) {
        res.status(409).json({ error: 'Email already in use' });
      }
    } else {
      // If the error is not a unique constraint violation, send a generic server error
      res.status(500).json({ error: 'Error signing up user' });
    }
  }
});

// GET endpoint to fetch scheduled exams

app.get('/api/calendar', async (req, res) => {
  try {
    let query = 'SELECT * FROM scheduled_exams';
    const queryParams = [];

    if (req.query.query) {
      query += ' WHERE subject ILIKE $1'; 
      queryParams.push(`%${req.query.query}%`);
    }

    const results = await pool.query(query, queryParams);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error('Error retrieving scheduled exams:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/calendar', async (req, res) => {
  try {
    const examData = {
      user_id: req.body.user_id,
      subject: req.body.subject,
      exam_date: req.body.exam_date,
      start_time: req.body.start_time,
      notes: req.body.notes
    };

    const newExam = await createScheduledExam(examData);
    res.status(201).json(newExam[0]); // Assuming 'returning("*")' in your query
  } catch (err) {
    console.error('Error creating scheduled exam:', err);
    res.status(500).json({ error: 'Server error while creating scheduled exam', details: err.message });
  }
});

app.delete('/api/calendar/:examId', async (req, res) => {
  const examId = req.params.examId;

  try {
    // Execute the DELETE query using the PostgreSQL pool
    const result = await pool.query('DELETE FROM scheduled_exams WHERE id = $1', [examId]);

    // Check if a row was deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Scheduled exam not found' });
    }

    // Send a success response if deletion is successful 
      return res.status(204).json({ message: 'Scheduled exam deleted successfully' });
  } catch (err) {
    console.error('Error deleting scheduled exam:', err);
    res.status(500).json({ error: 'Server error while deleting scheduled exam', details: err.message });
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

// Serve Vue application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Webapp: http://localhost:${PORT}/`);
});
