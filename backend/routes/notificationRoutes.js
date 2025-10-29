const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAllNotifications);
router.get("/user/:userId", notificationController.getNotificationsByUser);
router.put("/:id", notificationController.updateNotificationStatus);
router.put("/mark-all/:userId", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
