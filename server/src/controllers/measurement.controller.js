const measurementService = require('../services/measurement.service');
const { successResponse, errorResponse } = require("../utils/respondHandler");

exports.createMeasurement = async (req, res) => {
  try {
    const measurement = await measurementService.create(req.body);
    return successResponse(res, 201, "Measurement created successfully", measurement);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

exports.getAllMeasurementsByUser = async (req, res) => {
  console.log("Query parameters:", req.query);
  try {
    const userId = req.query.userId || req.query.userid;
    const measurements = await measurementService.findAllByUser(userId);
    return successResponse(res, 200, "Measurements fetched successfully", measurements);
  } catch (err) {
    console.error("Error fetching all measurements:", err);
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

exports.deleteMeasurement = async (req, res) => {
  try {
    await measurementService.deleteById(req.params.id);
    return successResponse(res, 200, "Measurement deleted successfully");
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

exports.updateMeasurement = async (req, res) => {
  try {
      const updatedMeasurement = await measurementService.updateById(req.params.id, req.body);
      return successResponse(res, 200, "Measurement updated successfully", updatedMeasurement);
  } catch (err) {
      return errorResponse(res, err.statusCode || 500, err.message);
  }
};