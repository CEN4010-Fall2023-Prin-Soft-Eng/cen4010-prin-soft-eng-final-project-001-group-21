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

// Initialize Express app
const app = express();

// Enable CORS and Body parser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

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
    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(409).send('Username already taken');

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) return res.status(409).send('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ username, email, password: hashedPassword });
    res.status(201).send({ userId, message: 'User successfully created' });
  } catch (err) {
    res.status(500).send('Error signing up user');
  }
});

app.post('/calendar', async (req, res) => {
  const { user_id, subject, exam_date, start_time, notes } = req.body;
  try {
    // Assuming you have a 'pool' for database connections
    const result = await pool.query(
      'INSERT INTO scheduled_exams (user_id, subject, exam_date, start_time, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, subject, exam_date, start_time, notes]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error scheduling exam:', err);
    res.status(500).send('Server error');
  }
});


app.get('/calendar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scheduled_exams');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scheduled exams:', err);
    res.status(500).send('Server error');
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
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Webapp: http://localhost:${PORT}/`);
});
