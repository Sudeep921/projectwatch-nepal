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
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    profession: {
      type: String,
      required: true,
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
      type: String
    },

    experience: {
      type: Number,
      default: 0
    },

    skills: {
      type: [String],
      default: []
    },

    dailyRate: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      default: ""
    },

    profileImage: {
      type: String,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    totalJobs: {
      type: Number,
      default: 0
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Worker", workerSchema);