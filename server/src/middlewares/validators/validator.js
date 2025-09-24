const { validationResult } = require('express-validator');
const { errorResponse } = require("../../utils/respondHandler");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array()[0].msg);
  }
  next();
};

exports.validate = validate;