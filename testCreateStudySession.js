const db = require('./db/db-config');

// Assuming createStudySession is defined in db-queries.js, not db-config.js
const { createStudySession } = require('./db/db-queries');

// Mock session data
const mockSessionData = {
  user_id: 1, // Replace with a valid user ID from your users table
  date: '2023-01-01',
  start_time: '10:00:00', // Make sure to match the expected format in your DB
  end_time: '11:00:00', // Make sure to match the expected format in your DB
  subject: 'Math',
  notes: 'Trigonometry study session',
};

// Function call for testing
createStudySession(mockSessionData)
  .then(result => {
    console.log('Session created:', result);
    process.exit(); // Exit the script once done
  })
  .catch(error => {
    console.error('Error creating session:', error);
    process.exit(1); // Exit with an error code
  });
