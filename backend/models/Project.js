const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    projectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    province: {
      type: String,
      required: true
    },

    district: {
      type: String,
      required: true
    },

    municipality: {
      type: String,
      required: true
    },

    contractor: {
      type: String,
      required: true
    },

    budget: {
      type: Number,
      required: true
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: ["Active", "Delayed", "Completed", "Critical"],
      default: "Active"
    },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low"
    },

    startDate: {
      type: Date
    },

    expectedEndDate: {
      type: Date
    },

    description: {
      type: String,
      default: ""
    },

    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);