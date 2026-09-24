const Notification =
  require("../models/Notification");

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
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to load notifications"
      });
    }
  };

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
      res.status(500).json({
        success: false,
        message:
          "Failed to create notification"
      });
    }
  };

const markAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true
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
      res.status(500).json({
        success: false,
        message:
          "Failed to update notification"
      });
    }
  };

const markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          read: {
            $ne: true
          }
        },
        {
          read: true
        }
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update notifications"
      });
    }
  };

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};