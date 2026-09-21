const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
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
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    specialization: {
      type: String,
      default: ""
    },

    province: {
      type: String,
      default: ""
    },

    district: {
      type: String,
      default: ""
    },

    municipality: {
      type: String,
      default: ""
    },

    experience: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Inactive"],
      default: "Available"
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;