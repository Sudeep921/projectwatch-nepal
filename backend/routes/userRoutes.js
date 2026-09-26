const express = require("express");

const {
  getUsers
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
// ========================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);


// ========================================
// UPDATE USER STATUS
// ========================================

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus
);


// ========================================
// UPDATE USER ROLE
// ========================================

router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);


module.exports = router;