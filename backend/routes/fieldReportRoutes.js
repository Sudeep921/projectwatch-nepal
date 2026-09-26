const express = require("express");

const {
  getFieldReports,
  getFieldReport,
  deleteFieldReport
} = require(
  "../controllers/fieldReportController"
);

const {
  createFieldReport,
  updateFieldReport
} = require(
  "../controllers/fieldReportAdminController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();


// ========================================
// AUTHENTICATION
// ========================================

router.use(
  authMiddleware
);


// ========================================
// GET ALL FIELD REPORTS
// ========================================

router.get(
  "/",
  getFieldReports
);


// ========================================
// GET SINGLE FIELD REPORT
// ========================================

router.get(
  "/:id",
  getFieldReport
);


// ========================================
// CREATE FIELD REPORT
// ========================================

router.post(
  "/",
  createFieldReport
);


// ========================================
// UPDATE FIELD REPORT
// ========================================

router.put(
  "/:id",
  updateFieldReport
);


// ========================================
// DELETE FIELD REPORT
// ========================================

router.delete(
  "/:id",
  deleteFieldReport
);


module.exports = router;