const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .populate("project", "name projectCode")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error("Get audit logs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs"
    });
  }
};

const getAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate("user", "name email role")
      .populate("project", "name projectCode");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found"
      });
    }

    res.json({
      success: true,
      log
    });
  } catch (error) {
    console.error("Get audit log error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit log"
    });
  }
};

const createAuditLog = async (req, res) => {
  try {
    const {
      action,
      module,
      description,
      project,
      metadata
    } = req.body;

    const log = await AuditLog.create({
      user: req.user ? req.user.id : null,
      action,
      module,
      description,
      project: project || null,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      message: "Audit log created",
      log
    });
  } catch (error) {
    console.error("Create audit log error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create audit log"
    });
  }
};

const deleteAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found"
      });
    }

    await log.deleteOne();

    res.json({
      success: true,
      message: "Audit log deleted"
    });
  } catch (error) {
    console.error("Delete audit log error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete audit log"
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLog,
  createAuditLog,
  deleteAuditLog
};