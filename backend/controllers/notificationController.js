const Notification = require("../models/Notification");

// ✅ Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const saved = await notification.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};

// ✅ Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// ✅ Get notifications by user
exports.getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    const query = { user: userId };
    if (type) query.type = type;
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user notifications",
      error: error.message,
    });
  }
};

// ✅ Mark single notification as read/unread
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const updated = await Notification.findByIdAndUpdate(id, { read }, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// ✅ Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};

// ✅ Delete single notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};
