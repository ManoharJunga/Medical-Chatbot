const Notification = require("../models/Notification");

// ✅ Create notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json({ success: true, data: savedNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating notification", error: error.message });
  }
};

// ✅ Get all notifications (admin or doctor view)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};

// ✅ Get notifications by user
exports.getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user notifications", error: error.message });
  }
};

// ✅ Mark notification as read/unread
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const notification = await Notification.findByIdAndUpdate(id, { read }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notification", error: error.message });
  }
};

// ✅ Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting notification", error: error.message });
  }
};
