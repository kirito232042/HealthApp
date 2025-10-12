const measurementService = require('../services/measurement.service');
const { successResponse, errorResponse } = require("../utils/respondHandler");



/**
 * Tạo một measurement mới.
 * Dữ liệu được lấy từ req.body.
 */
exports.createMeasurement = async (req, res) => {
  try {
    // Để đảm bảo user_id được lấy từ người dùng đã xác thực, thay vì từ body
    // bạn nên lấy từ req.user (được gắn vào từ middleware xác thực)
    // const measurementData = { ...req.body, user_id: req.user.id };
    const measurement = await measurementService.create(req.body);
    return successResponse(res, 201, "Measurement created successfully", measurement);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Lấy tất cả measurements của một user.
 * userId được lấy từ req.params.
 */
exports.getAllMeasurementsByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy từ params sẽ chuẩn hơn
    const measurements = await measurementService.findAllByUser(userId);
    return successResponse(res, 200, "Measurements fetched successfully", measurements);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Cập nhật một measurement.
 * ID lấy từ req.params, dữ liệu cập nhật từ req.body.
 */
exports.updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMeasurement = await measurementService.updateById(id, req.body);
    return successResponse(res, 200, "Measurement updated successfully", updatedMeasurement);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Xóa một measurement.
 * ID lấy từ req.params.
 */
exports.deleteMeasurement = async (req, res) => {
  try {
    await measurementService.deleteById(req.params.id);
    return successResponse(res, 200, "Measurement deleted successfully");
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Lấy chỉ số mới nhất mỗi ngày của tất cả user.
 */
exports.getLatestDailyMeasurements = async (req, res) => {
  try {
    const measurements = await measurementService.findLatestOfEachDayForAllUsers();
    return successResponse(res, 200, "Latest daily measurements fetched successfully", measurements);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Lấy chỉ số mới nhất của user trong một ngày.
 * Yêu cầu query params: userId và date (YYYY-MM-DD).
 */
exports.getLatestForUserByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return errorResponse(res, 400, "userId and date are required query parameters.");
    }
    const measurement = await measurementService.findLatestForUserByDate(userId, date);
    return successResponse(res, 200, "Latest measurement for the day fetched successfully", measurement);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};

/**
 * Lấy chỉ số mới nhất của user trong một khoảng thời gian.
 * Yêu cầu query params: userId, startDate, endDate (YYYY-MM-DD).
 */
exports.getLatestForUserInDateRange = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    if (!userId || !startDate || !endDate) {
      return errorResponse(res, 400, "userId, startDate, and endDate are required query parameters.");
    }
    const measurement = await measurementService.findLatestForUserInDateRange(userId, startDate, endDate);
    return successResponse(res, 200, "Latest measurement in date range fetched successfully", measurement);
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};