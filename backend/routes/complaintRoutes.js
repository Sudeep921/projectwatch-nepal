const express = require("express");

const {
  getComplaints,
  createComplaint,
  updateComplaint
} = require("../controllers/complaintController");

const {
  updateComplaintStatus
} = require("../controllers/complaintAdminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
  "/",
  createComplaint
);

router.get(
  "/",
  authMiddleware,
  getComplaints
);

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateComplaintStatus
);

module.exports = router;