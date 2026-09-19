const Alert = require("../models/Alert");


// CREATE ALERT
const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      alert
    });
  } catch (error) {
    console.error("Create alert error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL ALERTS
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("project")
      .populate("createdBy", "-password")
      .populate("resolvedBy", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET SINGLE ALERT
const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate("project")
      .populate("createdBy", "-password");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE ALERT
const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
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
        message: "Alert not found"
      });
    }

    res.json({
      success: true,
      message: "Alert updated successfully",
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// RESOLVE ALERT
const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
        resolvedBy: req.body.resolvedBy || null,
        resolvedAt: new Date()
      },
      {
        new: true
      }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    res.json({
      success: true,
      message: "Alert resolved successfully",
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE ALERT
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    res.json({
      success: true,
      message: "Alert deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  resolveAlert,
  deleteAlert
};