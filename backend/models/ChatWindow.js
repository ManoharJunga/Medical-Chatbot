const mongoose = require("mongoose");

const chatWindowSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  windowId: { type: String, required: true, unique: true }, // Each chat window must be unique
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatWindow", chatWindowSchema);
