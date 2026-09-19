const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    citizenName: {
      type: String,
      required: true,
      trim: true
    },

    citizenPhone: {
      type: String,
      required: true,
      trim: true
    },

    citizenEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: [
        "Delay",
        "Quality",
        "Budget",
        "Contractor",
        "Safety",
        "Other"
      ],
      default: "Other"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved",
        "Rejected"
      ],
      default: "Submitted"
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

    resolutionNote: {
      type: String,
      default: ""
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
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

module.exports = mongoose.model("Complaint", complaintSchema);