const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  resolveComplaint
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// SUBMIT COMPLAINT
// Citizen, Officer, Admin
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("citizen", "officer", "admin"),
  createComplaint
);


// ==========================================
// GET ALL COMPLAINTS
// Officer, Admin
// ==========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getComplaints
);


// ==========================================
// GET SINGLE COMPLAINT
// Officer, Admin
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getComplaint
);


// ==========================================
// UPDATE COMPLAINT
// Officer, Admin
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  updateComplaint
);


// ==========================================
// RESOLVE COMPLAINT
// Officer, Admin
// ==========================================

router.put(
  "/:id/resolve",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  resolveComplaint
);


// ==========================================
// DELETE COMPLAINT
// Admin ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteComplaint
);


module.exports = router;