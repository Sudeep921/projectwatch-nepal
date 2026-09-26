const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    type: {
      type: String,
      enum: [
        "Risk",
        "Critical Risk",
        "Delay",
        "Budget",
        "Verification",
        "Evidence",
        "System"
      ],
      default: "Risk"
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical"
      ],
      default: "Medium"
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Resolved"
      ],
      default: "Open"
    },

    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Alert", alertSchema);