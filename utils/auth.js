const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hashes a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Compares a plain text password with a hash
async function checkPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

module.exports = {
  hashPassword,
  checkPassword,
};
