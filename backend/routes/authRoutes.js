const express = require("express");

const {
  loginLimiter
} = require("../middleware/rateLimiter");

const {
  register,
  login,
  getMe,
  changeEmail
} = require("../controllers/authController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router =
  express.Router();

// ========================================
// REGISTER
// ========================================

router.post(
  "/register",
  register
);

// ========================================
// LOGIN
// ========================================

router.post(
  "/login",
  loginLimiter,
  login
);

// ========================================
// GET CURRENT USER
// ========================================

router.get(
  "/me",
  authMiddleware,
  getMe
);

// ========================================
// CHANGE EMAIL
// ========================================

router.put(
  "/change-email",
  authMiddleware,
  changeEmail
);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;