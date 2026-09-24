const express = require("express");

const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

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
  roleMiddleware("admin"),
  updateBooking
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteBooking
);

module.exports = router;