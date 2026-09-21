const express = require("express");

const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin can create notification
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createNotification
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer", "citizen"),
  getNotifications
);

router.put(
  "/:id/read",
  authMiddleware,
  roleMiddleware("admin", "officer", "citizen"),
  markAsRead
);

router.put(
  "/read-all",
  authMiddleware,
  roleMiddleware("admin", "officer", "citizen"),
  markAllAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer", "citizen"),
  deleteNotification
);

module.exports = router;