import axios from "axios";

type AIAnalysis = {
  identifiedSymptoms?: string[];
  summary?: string;
  possibleConditions?: { name: string; probability: string; description: string }[];
  recommendedAction?: string;
  doctors?: { _id: string; name: string; specialty: string; contact: string; location?: string }[];
};

type ChatApiResponse = {
  userMessage: string;
  botResponse: string;
  aiAnalysis?: AIAnalysis;
  timestamp: string;
}[];

export type ChatMessage = {
  role: "user" | "bot";
  content: string;
  identifiedSymptoms?: string[];
  summary?: string;
  possibleConditions?: { name: string; probability: string; description: string }[];
  recommendedAction?: string;
  doctors?: { _id: string; name: string; specialty: string; contact: string; location?: string }[];
  timestamp: string;
};

// Fetch only new messages after the last timestamp
export const fetchChatHistory = async (windowId: string, lastTimestamp?: string): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get<ChatApiResponse>(`http://localhost:5001/api/chat/history/${windowId}`);
    console.log("Fetched chat history:", response.data);

    // Filter messages newer than lastTimestamp
    const newMessages = lastTimestamp
      ? response.data.filter(msg => new Date(msg.timestamp) > new Date(lastTimestamp))
      : response.data;

    // Only map bot responses (can include user if needed)
    const chatMessages: ChatMessage[] = newMessages.flatMap(msg => [
      { role: "user", content: msg.userMessage, timestamp: msg.timestamp },
      {
        role: "bot",
        content: msg.botResponse,
        identifiedSymptoms: msg.aiAnalysis?.identifiedSymptoms,
        summary: msg.aiAnalysis?.summary,
        possibleConditions: msg.aiAnalysis?.possibleConditions,
        recommendedAction: msg.aiAnalysis?.recommendedAction,
        doctors: msg.aiAnalysis?.doctors || [],
        timestamp: msg.timestamp,
      },
    ]);

    return chatMessages;
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
    console.log("Bot response:", response.data); // <-- log bot response
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return { message: "Sorry, something went wrong. Please try again." };
  }
};

