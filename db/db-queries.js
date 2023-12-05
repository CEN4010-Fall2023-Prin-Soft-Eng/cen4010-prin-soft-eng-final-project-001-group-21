const db = require('./db-config');

const getUsers = () => {
  console.log('Getting all users');
  return db('users').select('*');
};

const findUserById = (id) => {
  console.log(`Finding user by ID: ${id}`);
  return db('users').select('*').where('id', id).first();
};

const createUser = (userData) => {
  console.log('Creating user:', userData);
  return db('users').insert(userData).returning('*');
};

const updateUser = (id, userData) => {
  console.log(`Updating user ID ${id} with data:`, userData);
  return db('users').where('id', id).update(userData).returning('*');
};

const deleteUser = (id) => {
  console.log(`Deleting user ID: ${id}`);
  return db('users').where('id', id).del();
};

const findUserByEmail = (email) => {
  console.log(`Finding user by email: ${email}`);
  return db('users').where({ email }).first();
};

const findUserByUsername = (username) => {
  console.log(`Finding user by username: ${username}`);
  return db('users').where({ username }).first();
};

const createStudySession = (sessionData) => {
  console.log('Creating study session:', sessionData);
  return db('study_sessions').insert(sessionData).returning('*');
};
const findScheduledExamsByUserId = (userId) => {
  return db('scheduled_exams').where({ user_id: userId }).orderBy('exam_date', 'asc');
};

const createScheduledExam = (examData) => {
  return db('scheduled_exams').insert(examData).returning('*');
};
module.exports = {
  getUsers,
  findUserById,
  createUser,
  updateUser,
  findUserByEmail,
  deleteUser,
  findUserByUsername,
  createStudySession,
  findScheduledExamsByUserId,
  createScheduledExam
};
