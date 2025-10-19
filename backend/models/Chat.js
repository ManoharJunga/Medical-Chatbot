// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  windowId: { type: String, required: true },       // Links the chat to a specific window
  userId: { type: String, required: true },         // Ensures tracking per user
  userMessage: { type: String, required: true },    // User's message
  botResponse: { type: String, required: true },    // Bot's conversational response
  aiAnalysis: { type: mongoose.Schema.Types.Mixed },// 🧠 Optional structured analysis or extra AI info
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
