const express = require("express");

const {
  analyzeProjectEvidence,
  getVerificationResults
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/verifications",
  authMiddleware,
  getVerificationResults
);

router.post(
  "/evidence/:evidenceId",
  authMiddleware,
  analyzeProjectEvidence
);

module.exports = router;