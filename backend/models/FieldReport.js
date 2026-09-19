const mongoose = require("mongoose");

const fieldReportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reportTitle: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    workStatus: {
      type: String,
      enum: ["On Track", "Delayed", "Critical"],
      default: "On Track"
    },

    location: {
      type: String,
      default: ""
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    },

    reportDate: {
      type: Date,
      default: Date.now
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending"
    },

    evidenceCount: {
      type: Number,
      default: 0
    },

    hasGPS: {
      type: Boolean,
      default: false
    },

    verificationNote: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FieldReport", fieldReportSchema);