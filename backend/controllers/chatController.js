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
You are MedBot, a friendly, empathetic, and professional AI medical assistant.

Your primary goal is to **collect complete information about the user's symptoms** in a conversational and polite manner.

Follow these rules strictly:

1. **Acknowledge the user’s input** in every message.  
2. **Ask only one focused follow-up question at a time** to gather all details about symptoms, including:
   - Type of symptom (pain, fever, cough, dizziness, etc.)
   - Location of symptom
   - Duration of symptom
   - Intensity or severity (1–10 scale if applicable)
   - Associated symptoms (shortness of breath, nausea, arm pain, etc.)
   - Triggering or relieving factors
3. Continue asking follow-ups until you have a **clear and complete picture** of all reported symptoms.
4. **Once enough information is gathered**, provide a **summary sentence** starting exactly with:
   "Got it. Based on what you've shared, here's what I understand about your symptoms:"  
   - Include all key details: symptoms, location, duration, intensity, and any other relevant info.
5. **Do NOT suggest doctors or treatments until the summary is made**.  
6. **If the user asks about a doctor or says something like “suggest a doctor”**, reply politely:
   "Sure! Please tell me more about what you are experiencing so that I can suggest the best doctor for you."
7. After the summary, **trigger AI analysis** to generate:
   - Identified symptoms  
   - Summary  
   - Possible conditions  
   - Recommended actions  
   - Recommended doctors (if symptoms indicate medical attention)
8. **Maintain a polite, empathetic, human-like tone** throughout the conversation.
9. Always ensure the summary is **clear and complete** so that downstream analysis can work reliably.

Example Flow:

User: "I have chest pain"  
Bot: "Okay, I understand you have chest pain. Can you describe the type of pain – sharp, dull, or crushing?"  
User: "Dull"  
Bot: "Thank you. Where exactly in your chest is the pain?"  
User: "Middle"  
Bot: "Got it. Based on what you've shared, here's what I understand about your symptoms: You have had a dull chest pain in the middle of your chest for 4 days with a severity of 5/10."  

User: "Can you suggest a doctor?"  
Bot: "Sure! Please tell me more about what you are experiencing so that I can suggest the best doctor for you."  

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
        if (/Got it\. Based on what you've shared/i.test(aiResponse.trim())) {
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

            // ✅ Set chat window name using the first symptom only
            const firstSymptom = analysisResult.identifiedSymptoms?.[0] || "Symptom Chat";
            chatWindow.name = `Chat: ${firstSymptom}`;
            await chatWindow.save();
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

        if (!windowId) {
            return res.status(400).json({ error: "Window ID is required" });
        }

        // Fetch chat messages for this window, sorted by timestamp
        const chatHistory = await Chat.find({ windowId })
            .sort({ timestamp: 1 })
            .select("userMessage botResponse aiAnalysis timestamp"); // include aiAnalysis

        // If no messages found, just return empty array (do not 404)
        res.status(200).json(chatHistory || []);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getChatHistory };


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
