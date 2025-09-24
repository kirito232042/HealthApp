const bcrypt = require("bcryptjs");

const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, 10);
};

const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };