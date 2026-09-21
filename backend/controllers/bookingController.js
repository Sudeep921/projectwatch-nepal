const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("project", "name province district")
      .populate("worker", "name email phone specialization")
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate("project")
        .populate("worker")
        .populate("requestedBy", "name email");

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
      message: error.message
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking =
      await Booking.create({
        project: req.body.project,
        worker: req.body.worker,
        requestedBy:
          req.user?.id || req.body.requestedBy,
        bookingDate: req.body.bookingDate,
        purpose: req.body.purpose,
        notes: req.body.notes || ""
      });

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("project")
        .populate("worker")
        .populate("requestedBy", "name email");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
        .populate("project")
        .populate("worker")
        .populate("requestedBy", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      message: "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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