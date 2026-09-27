const User = require("../models/User");

// ========================================
// GET ALL USERS
// ========================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

// ========================================
// GET MY SETTINGS
// ========================================

const getMySettings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId)
      .select("settings");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      settings: user.settings || {}
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message
    });
  }
};

// ========================================
// UPDATE MY SETTINGS
// ========================================

const updateMySettings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const {
      notifications,
      criticalAlerts,
      fieldReports,
      complaintUpdates,
      completionAlerts
    } = req.body;

    const settings = {
      notifications:
        notifications !== undefined
          ? Boolean(notifications)
          : true,

      criticalAlerts:
        criticalAlerts !== undefined
          ? Boolean(criticalAlerts)
          : true,

      fieldReports:
        fieldReports !== undefined
          ? Boolean(fieldReports)
          : true,

      complaintUpdates:
        complaintUpdates !== undefined
          ? Boolean(complaintUpdates)
          : true,

      completionAlerts:
        completionAlerts !== undefined
          ? Boolean(completionAlerts)
          : true
    };

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          settings
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Settings saved successfully",
      settings: user.settings
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save settings",
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getMySettings,
  updateMySettings
};