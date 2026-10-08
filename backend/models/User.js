const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
      },

      loginOTPHash: {
        type: String,
        default: ""
      },

      loginOTPExpires: {
        type: Date,
        default: null
      },

      resetOTPHash: {
        type: String,
        default: ""
      },

      resetOTPExpires: {
        type: Date,
        default: null
      },

    role: {
      type: String,
      enum: ["admin", "officer", "citizen"],
      default: "citizen"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // ========================================
    // USER SETTINGS
    // ========================================

    settings: {
      notifications: {
        type: Boolean,
        default: true
      },

      criticalAlerts: {
        type: Boolean,
        default: true
      },

      fieldReports: {
        type: Boolean,
        default: true
      },

      complaintUpdates: {
        type: Boolean,
        default: true
      },

      completionAlerts: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);