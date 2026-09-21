const express = require("express");

const {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getDashboardStats
);

router.get(
  "/project-status",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProjectStatusSummary
);

router.get(
  "/provinces",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProvinceSummary
);

module.exports = router;