const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
  try {
    const bookings =
      await Booking.find()
        .populate(
          "project",
          "projectName projectId province district"
        )
        .populate(
          "worker",
          "name email specialization"
        )
        .populate(
          "requestedBy",
          "name email role"
        )
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch bookings"
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "project",
          "projectName projectId province district"
        )
        .populate(
          "worker",
          "name email specialization"
        )
        .populate(
          "requestedBy",
          "name email role"
        );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch booking"
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      project,
      worker,
      bookingDate,
      purpose,
      notes
    } = req.body;

    if (
      !project ||
      !worker ||
      !bookingDate ||
      !purpose
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project, worker, booking date and purpose are required"
      });
    }

    const booking =
      await Booking.create({
        project,
        worker,
        requestedBy: req.user.id,
        bookingDate,
        purpose,
        notes: notes || "",
        status: "Pending"
      });

    const populated =
      await Booking.findById(
        booking._id
      )
        .populate(
          "project",
          "projectName projectId"
        )
        .populate(
          "worker",
          "name email specialization"
        )
        .populate(
          "requestedBy",
          "name email"
        );

    res.status(201).json({
      success: true,
      message:
        "Booking request created successfully",
      booking: populated
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create booking"
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
        .populate(
          "project",
          "projectName projectId"
        )
        .populate(
          "worker",
          "name email"
        )
        .populate(
          "requestedBy",
          "name email"
        );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message:
        "Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update booking"
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findByIdAndDelete(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message:
        "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete booking"
    });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
};