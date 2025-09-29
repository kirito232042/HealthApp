const { body } = require('express-validator');

const registerRules = () => [
  // body('nemail', 'Invalid email').isEmail().normalizeEmail(),
  // body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

const loginRules = () => [
  // body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  // body('password', 'Password is required').notEmpty(),
];

module.exports = {
  registerRules,
  loginRules,
};