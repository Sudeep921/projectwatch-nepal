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

// Create verification
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  createVerification
);

// Get all verifications
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getVerifications
);

// Get single verification
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getVerification
);

// Update verification
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  updateVerification
);

// Delete verification - Admin only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteVerification
);

module.exports = router;