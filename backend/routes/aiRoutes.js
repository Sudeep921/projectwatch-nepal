const express = require("express");

const {
  analyzeEvidenceWithAI
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/evidence/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  analyzeEvidenceWithAI
);

module.exports = router;