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
  "/:id",
  updateComplaint
);

module.exports = router;