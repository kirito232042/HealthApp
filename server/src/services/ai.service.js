const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  async getAIResponse(userMessage, healthData) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // --- Xây dựng prompt chi tiết ---
      const healthDataString = healthData 
        ? `Dưới đây là dữ liệu sức khỏe gần đây của người dùng (định dạng JSON): ${JSON.stringify(healthData, null, 2)}`
        : "Không có dữ liệu sức khỏe nào được cung cấp.";

      const prompt = `
        Bạn là một trợ lý sức khỏe AI. Vai trò của bạn là đưa ra những lời khuyên hữu ích dựa trên dữ liệu người dùng cung cấp.
        
        **Dữ liệu sức khỏe của người dùng:**
        ${healthDataString}

        **Câu hỏi của người dùng:**
        "${userMessage}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error getting AI response:", error);
      throw new Error("Could not get response from AI");
    }
  }
}

module.exports = new AIService();