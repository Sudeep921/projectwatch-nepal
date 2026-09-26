const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  getPublicProjects,
  generateCode
} = require("../controllers/projectController");

const {
  updateProject,
  deleteProject
} = require(
  "../controllers/projectAdminController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

// ========================================
// GENERATE PROJECT CODE
// ========================================

router.get(
  "/generate-code",
  authMiddleware,
  adminMiddleware,
  generateCode
);

// ========================================
// PUBLIC PROJECTS
// ========================================

router.get(
  "/public",
  getPublicProjects
);

// ========================================
// ADMIN + OFFICER
// ========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProjects
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProject
);

// ========================================
// ADMIN ONLY - CREATE
// ========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);

// ========================================
// ADMIN ONLY - UPDATE
// ========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminMiddleware,
  updateProject
);

// ========================================
// ADMIN ONLY - DELETE
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminMiddleware,
  deleteProject
);

// ========================================
// EXPORT
// ========================================

module.exports = router;