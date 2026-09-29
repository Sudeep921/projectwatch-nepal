const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    userName: {
      type: String,
      default: ""
    },

    userEmail: {
      type: String,
      default: ""
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    module: {
      type: String,
      default: "System",
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    ipAddress: {
      type: String,
      default: ""
    },

    method: {
      type: String,
      default: ""
    },

    endpoint: {
      type: String,
      default: ""
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model("AuditLog", auditLogSchema);