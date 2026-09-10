const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    province: {
      type: String,
      required: true,
      trim: true
    },

    district: {
      type: String,
      required: true,
      trim: true
    },

    budget: {
      type: Number,
      required: true,
      min: 0
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Completed",
        "Delayed",
        "Critical"
      ],
      default: "Active"
    },

    risk: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical"
      ],
      default: "Low"
    },

    contractor: {
      type: String,
      default: "",
      trim: true
    },

    department: {
      type: String,
      default: "",
      trim: true
    },

    startDate: {
      type: Date
    },

    endDate: {
      type: Date
    },

    location: {
      type: String,
      default: "",
      trim: true
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    },

    description: {
      type: String,
      default: "",
      trim: true
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;