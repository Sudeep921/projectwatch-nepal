const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "Project",
        "Complaint",
        "Field Report",
        "Alert",
        "System"
      ],
      default: "System"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    relatedComplaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);