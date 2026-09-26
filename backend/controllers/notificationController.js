const Notification =
  require("../models/Notification");


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

const getNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .sort({
            createdAt: -1
          })
          .limit(100);

      res.json({
        success: true,
        notifications
      });

    } catch (error) {
      console.error(
        "Get notifications error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load notifications"
      });
    }
  };


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          recipient: req.user._id
        })
          .sort({
            isRead: 1,
            createdAt: -1
          });

      res.json({
        success: true,
        notifications
      });

    } catch (error) {
      console.error(
        "Get my notifications error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load your notifications"
      });
    }
  };


// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.create(
          req.body
        );

      res.status(201).json({
        success: true,
        notification
      });

    } catch (error) {
      console.error(
        "Create notification error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create notification"
      });
    }
  };


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            isRead: true
          },
          {
            new: true
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found"
        });
      }

      res.json({
        success: true,
        notification
      });

    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notification"
      });
    }
  };


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          recipient: req.user._id,
          isRead: {
            $ne: true
          }
        },
        {
          isRead: true
        }
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read"
      });

    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notifications"
      });
    }
  };


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getNotifications,
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};