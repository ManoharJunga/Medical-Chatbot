import axios from "axios";

export const fetchChatHistory = async (windowId: string) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/chat/history/${windowId}`);
    return Array.isArray(response.data)
      ? response.data.flatMap((msg) => [
          { role: "user", content: msg.userMessage },
          { role: "bot", content: msg.botResponse },
        ])
      : [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const sendMessage = async (userId: string, windowId: string, message: string) => {
  try {
    const response = await axios.post("http://localhost:5001/api/chat/message", {
      userId,
      windowId,
      message,
    });
    return response.data.message || "I'm sorry, I didn't understand that.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};
