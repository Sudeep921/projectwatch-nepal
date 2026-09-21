const express = require("express");

const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getBookings
);

router.get(
  "/:id",
  authMiddleware,
  getBooking
);

router.post(
  "/",
  authMiddleware,
  createBooking
);

router.put(
  "/:id",
  authMiddleware,
  updateBooking
);

router.delete(
  "/:id",
  authMiddleware,
  deleteBooking
);

module.exports = router;