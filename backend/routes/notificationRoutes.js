const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create notification
router.post("/", notificationController.createNotification);

// Get all notifications
router.get("/", notificationController.getAllNotifications);

// Get notifications by user
router.get("/user/:userId", notificationController.getNotificationsByUser);

// Update read/unread status
router.put("/:id", notificationController.updateNotificationStatus);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
