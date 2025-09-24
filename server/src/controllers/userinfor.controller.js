const profileService = require("../services/profile.service");
const { successResponse, errorResponse } = require("../utils/respondHandler");

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const profiles = await profileService.findAllByUserId(userId);
    return successResponse(res, 200, "Profiles fetched successfully", profiles);
  } catch (err) {
    // Lỗi 404 từ service sẽ được chuyển tiếp ở đây
    const statusCode = err.message.includes("No profiles found") ? 404 : 500;
    return errorResponse(res, statusCode, err.message);
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileId, ...updateData } = req.body;
    
    const updatedProfile = await profileService.setActiveAndUpdate(userId, profileId, updateData);
    return successResponse(res, 200, "Profile updated successfully", updatedProfile);
  } catch (err) {
    // Lỗi 404 từ service sẽ được chuyển tiếp ở đây
    const statusCode = err.message.includes("Profile not found") ? 404 : 500;
    return errorResponse(res, statusCode, err.message);
  }
};

exports.createNewProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const newProfile = await profileService.createForUser(userId, req.body);
    return successResponse(res, 201, "New profile created successfully", newProfile);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};