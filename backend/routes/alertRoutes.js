const express =
  require("express");

const router =
  express.Router();

const {
  getAlerts,
  createAlert,
  updateAlert,
  generateProjectAlerts,
  resolveAlert
} = require(
  "../controllers/alertController"
);

router.get(
  "/",
  getAlerts
);

router.post(
  "/",
  createAlert
);

router.post(
  "/generate",
  generateProjectAlerts
);

router.put(
  "/:id",
  updateAlert
);

router.put(
  "/:id/resolve",
  resolveAlert
);

module.exports = router;