const Alert =
  require("../models/Alert");

const getAlerts =
  async (req, res) => {
    try {
      const alerts =
        await Alert.find()
          .populate(
            "project",
            "name projectId progress status riskLevel"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        count:
          alerts.length,
        alerts
      });
    } catch (error) {
      console.error(
        "Get alerts error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch alerts"
      });
    }
  };

const createAlert =
  async (req, res) => {
    try {
      const alert =
        await Alert.create({
          ...req.body,
          createdBy:
            req.user?.id ||
            req.user?._id
        });

      res.status(201).json({
        success: true,
        message:
          "Alert created successfully",
        alert
      });
    } catch (error) {
      console.error(
        "Create alert error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create alert"
      });
    }
  };

const updateAlert =
  async (req, res) => {
    try {
      const alert =
        await Alert.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      res.json({
        success: true,
        message:
          "Alert updated successfully",
        alert
      });
    } catch (error) {
      console.error(
        "Update alert error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update alert"
      });
    }
  };

module.exports = {
  getAlerts,
  createAlert,
  updateAlert
};