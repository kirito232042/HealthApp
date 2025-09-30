const aiService = require("../services/ai.service");
const { successResponse, errorResponse } = require("../utils/respondHandler");

exports.chatWithAI = async (req, res) => {
  try {
    const { message, healthData } = req.body;
    console.log("Received message:", message);
    console.log("Received healthData:", healthData);
    if (!message) {
      return errorResponse(res, 400, "Message is required");
    }

    const reply = await aiService.getAIResponse(message, healthData);
    return successResponse(res, 200, "Success", { reply });
  } catch (err) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }
};