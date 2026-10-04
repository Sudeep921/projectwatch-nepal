const express = require("express");

const {
  getUsers,
  getMySettings,
  updateMySettings,
  changeMyCredentials
} = require("../controllers/userController");

const {
  updateUserStatus,
  updateUserRole
} = require("../controllers/userAdminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================
// GET ALL USERS
// ADMIN ONLY
// ========================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);


// ========================================
// GET MY SETTINGS
// ADMIN / OFFICER
// ========================================

router.get(
  "/settings",
  authMiddleware,
  getMySettings
);


// ========================================
// UPDATE MY SETTINGS
// ADMIN / OFFICER
// ========================================

router.put(
  "/settings",
  authMiddleware,
  updateMySettings
);


// ========================================
// UPDATE USER STATUS
// ADMIN ONLY
// ========================================

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus
);


// ========================================
// UPDATE USER ROLE
// ADMIN ONLY
// ========================================

router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);
router.put(
  "/credentials",
  authMiddleware,
  changeMyCredentials
);


module.exports = router;