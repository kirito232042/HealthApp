const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/respondHandler");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await authService.register(email, password);
    return successResponse(res, 201, "User registered successfully", newUser);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    console.log("User logged in with email:", email);
    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};