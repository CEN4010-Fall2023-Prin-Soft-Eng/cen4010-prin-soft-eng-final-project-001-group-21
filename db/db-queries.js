//db-queries.js
const db = require('./db-config');

const getUsers = () => {
  return db('users').select('*');
};

const findUserById = (id) => {
  return db('users').select('*').where('id', id).first();
};

const createUser = (userData) => {
  return db('users').insert(userData).returning('*');
};

const updateUser = (id, userData) => {
  return db('users').where('id', id).update(userData).returning('*');
};

const deleteUser = (id) => {
  return db('users').where('id', id).del();
};


const findUserByEmail = (email) => {
  return db('users').where({ email }).first();
};

const findUserByUsername = (username) => {
    return db('users').where({ username }).first();
  };  
const createStudySession = (sessionData) => {
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
