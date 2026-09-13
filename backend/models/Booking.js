const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true
    },

    service: {
      type: String,
      required: true,
      trim: true
    },

    bookingDate: {
      type: Date,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    amount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "In Progress",
        "Completed",
        "Cancelled"
      ],
      default: "Pending"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);