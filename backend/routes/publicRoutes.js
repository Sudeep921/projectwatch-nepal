const express = require("express");

const {
  getPublicProjects,
  getPublicProject,
  getPublicSummary
} = require("../controllers/publicController");

const {
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC SUMMARY
// ========================================

router.get(
  "/summary",
  getPublicSummary
);

// ========================================
// PUBLIC PROJECTS
// ========================================

router.get(
  "/projects",
  getPublicProjects
);

// ========================================
// PUBLIC PROJECT DETAILS
// ========================================

router.get(
  "/projects/:id",
  getPublicProject
);

// ========================================
// UPDATE PROJECT
// ========================================

router.put(
  "/:id",
  authMiddleware,
  updateProject
);

// ========================================
// DELETE PROJECT
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

// ========================================
// EXPORT
// ========================================

module.exports = router;