const express = require("express");
const {
  loginLimiter
} = require("../middleware/rateLimiter");

const {
  register,
  login,
  getMe
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  loginLimiter,
  login
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;