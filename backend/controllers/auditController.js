const AuditLog = require("../models/AuditLog");

// ========================================
// GET AUDIT LOGS
// ========================================

const getAuditLogs = async (req, res) => {
  try {
    const {
      search = "",
      module = "all",
      action = "all",
      limit = 100
    } = req.query;

    const query = {};

    if (module !== "all") {
      query.module = module;
    }

    if (action !== "all") {
      query.action = action;
    }

    if (search.trim()) {
      query.$or = [
        {
          userName: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          userEmail: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          action: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    const logs = await AuditLog.find(query)
      .populate(
        "user",
        "name email role"
      )
      .sort({
        createdAt: -1
      })
      .limit(
        Math.min(
          Number(limit) || 100,
          500
        )
      );

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error(
      "AUDIT LOG ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load audit logs"
    });
  }
};

// ========================================
// CREATE AUDIT LOG
// ========================================

const createAuditLog = async ({
  req,
  user = null,
  action,
  module,
  description = "",
  metadata = {}
}) => {
  try {
    const currentUser =
      user || req?.user || null;

    const log = new AuditLog({
      user:
        currentUser?._id ||
        currentUser?.id ||
        null,

      userName:
        currentUser?.name ||
        currentUser?.fullName ||
        "",

      userEmail:
        currentUser?.email ||
        "",

      action,
      module,
      description,

      ipAddress:
        req?.headers?.["x-forwarded-for"] ||
        req?.socket?.remoteAddress ||
        "",

      method:
        req?.method || "",

      endpoint:
        req?.originalUrl || "",

      metadata
    });

    await log.save();

    return log;
  } catch (error) {
    console.error(
      "CREATE AUDIT LOG ERROR:",
      error
    );

    return null;
  }
};

module.exports = {
  getAuditLogs,
  createAuditLog
};