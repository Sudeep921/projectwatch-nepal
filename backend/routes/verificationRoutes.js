const express = require("express");

const {
  createVerification,
  getVerifications,
  getVerification,
  updateVerification,
  deleteVerification
} = require("../controllers/verificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  createVerification
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getVerifications
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getVerification
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  updateVerification
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteVerification
);

module.exports = router;