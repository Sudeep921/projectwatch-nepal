const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;