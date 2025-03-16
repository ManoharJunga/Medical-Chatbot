const express = require("express");
const { processMessage, getChatHistory, deleteChatHistory, getRecentChats } = require("../controllers/chatController");

const router = express.Router();

router.post("/message", processMessage); // Send a message
router.get("/history/:windowId", getChatHistory);
router.delete("/history/:userId", deleteChatHistory); // Delete chat history
router.get("/recent/:userId/:limit?", getRecentChats); // Get recent N chats (default: 10)

module.exports = router;
