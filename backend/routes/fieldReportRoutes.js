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

// Officer + Admin can create
router.post(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  createFieldReport
);

// Officer + Admin
router.get(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getFieldReports
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getFieldReport
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  updateFieldReport
);

// Admin only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteFieldReport
);

module.exports = router;