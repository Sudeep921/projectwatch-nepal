const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    fieldReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldReport",
      required: true
    },

    verifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    verificationType: {
      type: String,
      enum: [
        "Document Review",
        "Field Verification",
        "Photo Verification",
        "GPS Verification",
        "AI Verification"
      ],
      default: "Field Verification"
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Rejected",
        "Needs Human Review"
      ],
      default: "Pending"
    },

    verifiedProgress: {
      type: Number,
      min: 0,
      max: 100
    },

    remarks: {
      type: String,
      default: ""
    },

    discrepancyDetected: {
      type: Boolean,
      default: false
    },

    discrepancyDetails: {
      type: String,
      default: ""
    },

    verifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Verification", verificationSchema);