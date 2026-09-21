const express = require("express");

const {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  resolveAlert,
  deleteAlert
} = require("../controllers/alertController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAlert
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getAlerts
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getAlert
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAlert
);

router.put(
  "/:id/resolve",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  resolveAlert
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAlert
);

module.exports = router;