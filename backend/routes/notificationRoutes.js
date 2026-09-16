const express = require("express");

const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const router = express.Router();

// Create notification
router.post("/", createNotification);

// Get all notifications
router.get("/", getNotifications);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;