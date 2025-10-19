require("dotenv").config();
const axios = require("axios");
const Chat = require("../models/Chat");
const ChatWindow = require("../models/ChatWindow");
const { analyzeSymptomsInternal } = require("./symptomAnalysisHelper");
const { analyzeSymptoms } = require("./aiController"); // 👈 added

const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const processMessage = async (req, res) => {
    try {
        const { userId, message, windowId } = req.body;
        if (!userId || !message || !windowId) {
            return res.status(400).json({ error: "User ID, message, and window ID are required" });
        }

        let chatWindow = await ChatWindow.findOne({ userId, windowId });
        if (!chatWindow) {
            chatWindow = new ChatWindow({ userId, windowId });
            await chatWindow.save();
        }

        const chatHistory = await Chat.find({ windowId }).sort({ timestamp: 1 });
        const conversationParts = chatHistory.map(chat => ({
            text: `User: ${chat.userMessage}\nBot: ${chat.botResponse}`
        }));
        conversationParts.push({ text: `User: ${message}` });

        const prompt = `
You are MedBot, a friendly and empathetic AI medical assistant.

Your goal is to collect **enough information about the user's symptoms through natural conversation**.  

👉 Follow this structured flow:
1. Acknowledge what the user said.
2. Ask 1 focused follow-up question at a time to learn more (e.g., duration, intensity, additional symptoms).
3. Keep asking follow-up questions until you're confident you have a clear picture.
4. **When you're confident you have enough info**, respond with a **summary sentence starting EXACTLY with**:
   "Got it. Based on what you've shared, here's what I understand about your symptoms:"
5. Do NOT give doctor suggestions or analysis until the summary is made.
`;

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "API Key not found" });

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        ...conversationParts.map(p => ({ text: p.text }))
                    ]
                }
            ]
        };

        const response = await axios.post(`${GOOGLE_API_URL}?key=${apiKey}`, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm sorry, I couldn't process that. Could you please repeat?";

        // Create chat with botResponse first, aiAnalysis null initially
        const chat = new Chat({
            windowId,
            userId,
            userMessage: message,
            botResponse: aiResponse,
            aiAnalysis: null
        });
        await chat.save();

        let finalResponse = { message: aiResponse, windowId };

        // 🩺 Trigger symptom analysis if bot gives summary
        if (aiResponse.startsWith("Got it. Based on what you've shared")) {
            const allMessages = chatHistory.map(c => c.userMessage).concat(message).join(". ");

            const mockReq = { body: { message: allMessages } };
            const mockRes = {
                json: (data) => data,
                status: (code) => ({ json: (data) => ({ code, ...data }) })
            };

            const analysisResult = await new Promise((resolve, reject) => {
                try {
                    analyzeSymptoms(mockReq, {
                        json: resolve,
                        status: (code) => ({
                            json: (data) => reject({ code, ...data })
                        })
                    });
                } catch (err) {
                    reject(err);
                }
            });

            // Update chat with aiAnalysis
            chat.aiAnalysis = analysisResult;
            await chat.save();

            finalResponse.analysis = analysisResult;
        }

        res.status(200).json(finalResponse);


    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// 🔹 Get Full Chat History for a Specific Chat Window
const getChatHistory = async (req, res) => {
  try {
    const { windowId } = req.params;
    if (!windowId) return res.status(400).json({ error: "Window ID is required" });

    const chatHistory = await Chat.find({ windowId })
      .sort({ timestamp: 1 })
      .select("userMessage botResponse aiAnalysis timestamp"); // <-- include aiAnalysis

    if (chatHistory.length === 0) {
      return res.status(404).json({ error: "No chat history found" });
    }

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// 🔹 Delete Chat History for a Chat Window
const deleteChatHistory = async (req, res) => {
    try {
        const { windowId } = req.params;

        if (!windowId) {
            return res.status(400).json({ error: "Window ID is required" });
        }

        await Chat.deleteMany({ windowId });
        await ChatWindow.deleteOne({ windowId });

        res.status(200).json({ message: "Chat history deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 🔹 Get Recent Chats (Last N Messages)
const getRecentChats = async (req, res) => {
    try {
        const { userId, limit } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const chatWindow = await ChatWindow.findOne({ userId });
        if (!chatWindow) {
            return res.status(404).json({ error: "Chat window not found" });
        }

        const recentChats = await Chat.find({ windowId: chatWindow.windowId })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit, 10) || 10)
            .select("userMessage botResponse timestamp");

        res.status(200).json(recentChats);
    } catch (error) {
        console.error("Error fetching recent chats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { processMessage, getChatHistory, deleteChatHistory, getRecentChats };
