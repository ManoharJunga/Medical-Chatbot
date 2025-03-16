const express = require("express");
const router = express.Router();
const chatWindowController = require("../controllers/chatWindowController");

router.post("/new", chatWindowController.createChatWindow); 
router.get("/user/:userId/windows", chatWindowController.getAllChatWindowsByUser);
router.delete("/window/:windowId", chatWindowController.deleteChatWindow);

module.exports = router;
