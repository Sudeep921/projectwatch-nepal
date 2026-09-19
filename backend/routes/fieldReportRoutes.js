const express = require("express");

const {
  createFieldReport,
  getFieldReports,
  getFieldReport,
  updateFieldReport,
  deleteFieldReport
} = require("../controllers/fieldReportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// CREATE FIELD REPORT
// ========================================
// Admin + Officer

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  createFieldReport
);


// ========================================
// GET ALL FIELD REPORTS
// ========================================
// Admin + Officer

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getFieldReports
);


// ========================================
// GET SINGLE FIELD REPORT
// ========================================
// Admin + Officer

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getFieldReport
);


// ========================================
// UPDATE FIELD REPORT
// ========================================
// Admin + Officer

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  updateFieldReport
);


// ========================================
// DELETE FIELD REPORT
// ========================================
// Admin only

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteFieldReport
);


module.exports = router;