const express = require("express");

const {
  getComplaints,
  createComplaint,
  updateComplaint
} = require(
  "../controllers/complaintController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );
  const {
  updateComplaintStatus
} = require(
  "../controllers/complaintAdminController"
);
const adminMiddleware =
  require("../middleware/adminMiddleware");

const router =
  express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getComplaints
);

router.post(
  "/",
  createComplaint
);

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateComplaintStatus
);
module.exports = router;