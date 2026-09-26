const express = require("express");

const {
  getPublicProjects,
  getPublicProject,
  getPublicSummary
} = require(
  "../controllers/publicController"
);

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
// EXPORT
// ========================================

module.exports = router;