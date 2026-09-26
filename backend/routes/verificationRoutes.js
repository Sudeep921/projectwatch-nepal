const express = require("express");

const {
  getVerifications,
  createVerification
} = require(
  "../controllers/verificationController"
);

const {
  reviewVerification
} = require(
  "../controllers/verificationAdminController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const adminMiddleware =
  require(
    "../middleware/adminMiddleware"
  );

const router =
  express.Router();

// All verification routes require login
router.use(authMiddleware);

// Get verifications
router.get(
  "/",
  getVerifications
);

// Create verification
router.post(
  "/",
  createVerification
);

// Admin review verification
router.put(
  "/:id/review",
  adminMiddleware,
  reviewVerification
);

module.exports = router;