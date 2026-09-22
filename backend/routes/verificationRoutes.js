const express = require("express");

const {
  getVerifications,
  createVerification
} = require(
  "../controllers/verificationController"
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
  getVerifications
);

router.post(
  "/",
  createVerification
);

module.exports = router;