const express = require("express");

const router =
  express.Router();

const {
  getNotifications,
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");


// GET ALL
router.get(
  "/",
  authMiddleware,
  getNotifications
);


// GET MY
router.get(
  "/mine",
  authMiddleware,
  getMyNotifications
);


// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createNotification
);


// MARK ALL READ
router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);


// MARK ONE READ
router.put(
  "/:id/read",
  authMiddleware,
  markAsRead
);


// DELETE
router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);


module.exports = router;