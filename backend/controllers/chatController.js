require("dotenv").config();
const axios = require("axios");
const Chat = require("../models/Chat");
const ChatWindow = require("../models/ChatWindow");

// 🔹 Process User Message and Get AI Response
const processMessage = async (req, res) => {
    try {
        const { userId, message, windowId } = req.body; // ✅ Accept `windowId`

        if (!userId || !message || !windowId) {
            return res.status(400).json({ error: "User ID, message, and window ID are required" });
        }

        console.log("Received request with:", { userId, message, windowId });

        // 🔹 Find or create a chat window with the given `windowId`
        let chatWindow = await ChatWindow.findOne({ userId, windowId });
        if (!chatWindow) {
            chatWindow = new ChatWindow({ userId, windowId });
            await chatWindow.save();
        }

        // 🔹 Call Google API for AI Response
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API Key not found" });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `You are MedBot, a friendly and knowledgeable AI medical assistant. Engage users with clear, concise, and medically informative responses. Provide evidence-based health guidance in an easy-to-understand way.  
        
        - Be empathetic and conversational.  
        - Ask follow-up questions when needed.  
        - Offer general health insights but avoid diagnosing conditions, prescribing medications, or giving emergency advice.  
        
        If a question requires urgent medical attention, **strongly** advise the user to consult a healthcare professional.  
        
        Here is the user’s message: "${message}"`
                        }
                    ]
                }
            ]
        };


        const response = await axios.post(url, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        console.log("AI Response:", aiResponse);

        // 🔹 Save Chat to MongoDB with `windowId`
        const chat = new Chat({ windowId, userId, userMessage: message, botResponse: aiResponse });
        await chat.save();

        res.status(200).json({ message: aiResponse, windowId });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// 🔹 Get Full Chat History for a Specific User
const getChatHistory = async (req, res) => {
    try {
        const { windowId } = req.params; // Change userId to windowId

        if (!windowId) {
            return res.status(400).json({ error: "Window ID is required" });
        }

        // No need to find the chat window separately, just query messages directly
        const chatHistory = await Chat.find({ windowId })
            .sort({ timestamp: 1 })
            .select("userMessage botResponse timestamp");

        if (chatHistory.length === 0) {
            return res.status(404).json({ error: "No chat history found" });
        }

        res.status(200).json(chatHistory);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// 🔹 Delete Chat History for a User
const deleteChatHistory = async (req, res) => {
    try {
        const { windowId } = req.params;

        if (!windowId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const chatWindow = await ChatWindow.findOne({ windowId });

        if (!chatWindow) {
            return res.status(404).json({ error: "Chat window not found" });
        }

        await Chat.deleteMany({ windowId: chatWindow.windowId });

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
