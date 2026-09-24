const express = require("express");

const {
  getAuditLogs,
  getAuditLog,
  createAuditLog,
  deleteAuditLog
} = require("../controllers/auditController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAuditLogs
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getAuditLog
);

router.post(
  "/",
  authMiddleware,
  createAuditLog
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAuditLog
);

module.exports = router;