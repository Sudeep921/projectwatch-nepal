const express =
  require("express");

const {
  createProject,
  getProjects,
  getProject,
  getPublicProjects,
  generateCode,
  updateProject,
  deleteProject,
  searchProjects,
  getProjectTimeline
} = require(
  "../controllers/projectController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router =
  express.Router();


// ==========================================
// GENERATE PROJECT CODE
// ==========================================

router.get(
  "/generate-code",
  authMiddleware,
  adminMiddleware,
  generateCode
);


// ==========================================
// PUBLIC PROJECTS
// ==========================================

router.get(
  "/public",
  getPublicProjects
);


// ==========================================
// SEARCH / FILTER PROJECTS
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
  "/search",
  authMiddleware,
  roleMiddleware(
    "admin",
    "officer"
  ),
  searchProjects
);


// ==========================================
// PROJECT TIMELINE
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
  "/:id/timeline",
  authMiddleware,
  roleMiddleware(
    "admin",
    "officer"
  ),
  getProjectTimeline
);


// ==========================================
// GET ALL PROJECTS
// ==========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "admin",
    "officer"
  ),
  getProjects
);


// ==========================================
// GET SINGLE PROJECT
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "admin",
    "officer"
  ),
  getProject
);


// ==========================================
// CREATE PROJECT
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);


// ==========================================
// UPDATE PROJECT
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminMiddleware,
  updateProject
);


// ==========================================
// DELETE PROJECT
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminMiddleware,
  deleteProject
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
  router;