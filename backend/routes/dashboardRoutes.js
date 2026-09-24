const express = require("express");

const {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

router.get(
  "/project-status",
  authMiddleware,
  getProjectStatusSummary
);

router.get(
  "/provinces",
  authMiddleware,
  getProvinceSummary
);

module.exports = router;