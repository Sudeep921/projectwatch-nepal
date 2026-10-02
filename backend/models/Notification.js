const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      // ==========================================
      // RECIPIENT / USER
      // ==========================================

      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },

      // ==========================================
      // TITLE
      // ==========================================

      title: {
        type: String,
        required: true,
        trim: true
      },

      // ==========================================
      // MESSAGE
      // ==========================================

      message: {
        type: String,
        required: true,
        trim: true
      },

      // ==========================================
      // NOTIFICATION TYPE
      // ==========================================

      type: {
        type: String,
        enum: [
          "Info",
          "Success",
          "Warning",
          "Danger"
        ],
        default: "Info"
      },

      // ==========================================
      // READ STATUS
      // ==========================================

      read: {
        type: Boolean,
        default: false
      },

      // ==========================================
      // PROJECT
      // ==========================================

      project: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );