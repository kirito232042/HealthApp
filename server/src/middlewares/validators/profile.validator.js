const { body, param } = require('express-validator');

const userIdParamRule = () => [
  param('userId', 'A valid User ID is required in the URL').isInt(),
];

const createProfileRules = () => [
  param('userId', 'A valid User ID is required').isInt(),
  body('firstName', 'First name is required').notEmpty().isString(),
  body('lastName', 'Last name is required').notEmpty().isString(),
  body('dob', 'Date of birth must be a valid date').optional().isISO8601().toDate(),
  body('profile', 'Profile status must be a boolean').optional().isBoolean(),
];

const updateProfileRules = () => [
    param('userId', 'A valid User ID is required').isInt(),
    body('profileId', 'A valid Profile ID is required in the body').isInt(),
    body('firstName', 'First name must be a string').optional().isString(),
    body('lastName', 'Last name must be a string').optional().isString(),
    body('dob', 'Date of birth must be a valid date').optional().isISO8601().toDate(),
];

module.exports = {
  userIdParamRule,
  createProfileRules,
  updateProfileRules,
};