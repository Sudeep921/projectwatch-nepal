const express = require("express");

const router = express.Router();

const {
  getAlerts,
  createAlert,
  updateAlert,
  generateProjectAlerts
} = require("../controllers/alertController");

const {
  resolveAlert
} = require("../controllers/alertAdminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

// Get alerts
router.get(
  "/",
  authMiddleware,
  getAlerts
);

// Create alert
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createAlert
);

// Generate project alerts
router.post(
  "/generate",
  authMiddleware,
  adminMiddleware,
  generateProjectAlerts
);

// Update alert
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateAlert
);

// Resolve alert
router.put(
  "/:id/resolve",
  authMiddleware,
  adminMiddleware,
  resolveAlert
);

module.exports = router;