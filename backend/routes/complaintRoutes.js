const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  resolveComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Citizen + Officer + Admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("citizen", "officer", "admin"),
  createComplaint
);

// Officer + Admin
router.get(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getComplaints
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getComplaint
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  updateComplaint
);

router.put(
  "/:id/resolve",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  resolveComplaint
);

// Admin only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteComplaint
);

module.exports = router;