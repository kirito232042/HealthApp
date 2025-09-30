import API_URL from "../../config/apiConfig";
import { getTokenAndUserId } from "./authService";


export const sendMessageToAI = async (message, healthData) => {
  try {
    // const { userId } = await getTokenAndUserId();
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}` // Bỏ comment nếu API của bạn yêu cầu token
      },
      body: JSON.stringify({ message, healthData }), // Gửi cả tin nhắn và dữ liệu sức khỏe
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to send message");
    }
    console.log("AI Response:", data.data.reply);
    return data.data.reply;
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw error; // Ném lỗi ra để component có thể xử lý
  }
};