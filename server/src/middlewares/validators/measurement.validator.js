const { body, query, param } = require('express-validator');

const measurementTypes = ["weight", "height", "spo2", "heart_rate", "blood_pressure"];

const createMeasurementRules = () => [
  body('type', `Type must be one of: ${measurementTypes.join(', ')}`).isIn(measurementTypes),
  body('value', 'Value is required and must be a number').isNumeric(),
  body('unit', 'Unit is required').notEmpty().isString(),
  body('userId', 'userId is required and must be an integer').isInt(),
  body('profileId', 'profileId is required and must be an integer').isInt(),
];

const getByUserRules = () => [
  query('userId', 'userId is required in query parameters').notEmpty().isInt(),
];

const paramIdRules = () => [
  param('id', 'A valid measurement ID is required in URL parameters').isInt(),
];

// Giả sử update có thể chỉ update một vài trường
const updateMeasurementRules = () => [
  param('id', 'A valid measurement ID is required').isInt(),
  body('type', `If provided, type must be one of: ${measurementTypes.join(', ')}`).optional().isIn(measurementTypes),
  body('value', 'If provided, value must be a number').optional().isNumeric(),
  body('unit', 'If provided, unit must be a string').optional().isString(),
];


module.exports = {
  createMeasurementRules,
  getByUserRules,
  paramIdRules,
  updateMeasurementRules,
};