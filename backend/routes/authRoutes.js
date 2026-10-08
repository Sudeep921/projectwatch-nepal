const express = require("express");

const {
  loginLimiter
} = require("../middleware/rateLimiter");

const {
  register,
  login,
  verifyLoginOTP,
  forgotPassword,
  resetPassword,
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
// VERIFY LOGIN 2FA OTP
// ========================================

router.post(
  "/verify-login-otp",
  verifyLoginOTP
);

// ========================================
// FORGOT PASSWORD
// ========================================

router.post(
  "/forgot-password",
  forgotPassword
);

// ========================================
// RESET PASSWORD
// ========================================

router.post(
  "/reset-password",
  resetPassword
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