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

const findUserByUsername = (username) => {
    return db('users').where({ username }).first();
  };  
const createStudySession = (sessionData) => {
    return db('study_sessions').insert(sessionData).returning('*');
  };


module.exports = {
  getUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByUsername,
  createStudySession
};
