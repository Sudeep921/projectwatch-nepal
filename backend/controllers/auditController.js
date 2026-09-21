const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error("Audit logs error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAuditLogs
};