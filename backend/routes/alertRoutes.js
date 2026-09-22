const express = require("express");

const {
  getAlerts,
  createAlert,
  updateAlert
} = require(
  "../controllers/alertController"
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
  getAlerts
);

router.post(
  "/",
  createAlert
);

router.put(
  "/:id",
  updateAlert
);

module.exports = router;