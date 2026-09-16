const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "-password")
      .populate("relatedProject")
      .populate("relatedComplaint")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
};