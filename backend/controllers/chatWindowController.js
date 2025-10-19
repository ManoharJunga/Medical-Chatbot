const ChatWindow = require("../models/ChatWindow");
const { v4: uuidv4 } = require("uuid"); // Generate unique window IDs

// Create or get chat window for a user
exports.createChatWindow = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const windowId = uuidv4(); // Generate a unique window ID

    const newChatWindow = new ChatWindow({ userId, windowId });
    await newChatWindow.save();

    console.log("Created Chat Window:", newChatWindow); // Log for debugging

    res.status(201).json(newChatWindow);
  } catch (error) {
    console.error("Error in createChatWindow:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get chat window by userId
exports.getAllChatWindowsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all chat windows associated with the userId
    const chatWindows = await ChatWindow.find({ userId });

    if (!chatWindows.length) {
      return res.status(404).json({ message: "No chat windows found for this user." });
    }

    res.status(200).json(chatWindows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a chat window
exports.deleteChatWindow = async (req, res) => {
  try {
    const { windowId } = req.params; // Use windowId instead of userId
    await ChatWindow.findOneAndDelete({ windowId });

    res.status(200).json({ message: "Chat window deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update chat window name
exports.updateChatWindowName = async (req, res) => {
  try {
    const { windowId } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const updatedWindow = await ChatWindow.findOneAndUpdate(
      { windowId },
      { name },
      { new: true }
    );

    if (!updatedWindow) {
      return res.status(404).json({ error: "Chat window not found" });
    }

    res.status(200).json(updatedWindow);
  } catch (error) {
    console.error("Error updating chat window name:", error);
    res.status(500).json({ error: error.message });
  }
};

