import axios from "axios";

export const fetchChatWindows = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/chat-windows/user/${userId}/windows`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat windows:", error);
    return [];
  }
};

export const createNewWindow = async (userId: string) => {
  try {
    const response = await axios.post("http://localhost:5001/api/chat-windows/new", { userId });
    return response.data;
  } catch (error) {
    console.error("Error creating chat window:", error);
    return null;
  }
};

export const deleteChatWindow = async (windowId: string) => {
  try {
    await axios.delete(`http://localhost:5001/api/chat-windows/window/${windowId}`);
    return true;
  } catch (error) {
    console.error("Error deleting chat window:", error);
    return false;
  }
};
