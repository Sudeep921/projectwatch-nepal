const Alert =
  require("../models/Alert");

const resolveAlert =
  async (req, res) => {
    try {
      const alert =
        await Alert.findById(
          req.params.id
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: "Alert not found"
        });
      }

      alert.status =
        "Resolved";

      alert.resolvedAt =
        new Date();

      await alert.save();

      res.json({
        success: true,
        message:
          "Alert resolved successfully",
        alert
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to resolve alert",
        error: error.message
      });
    }
  };

module.exports = {
  resolveAlert
};