const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getPublicProjects
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// PUBLIC PROJECTS
// ========================================
// Citizen / Public Portal
// GET /api/projects/public
router.get("/public", getPublicProjects);


// ========================================
// GET ALL PROJECTS
// ========================================
// Admin + Officer
// GET /api/projects
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProjects
);


// ========================================
// GET SINGLE PROJECT
// ========================================
// Admin + Officer
// GET /api/projects/:id
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProject
);


// ========================================
// CREATE PROJECT
// ========================================
// Only Admin
// POST /api/projects
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);


// ========================================
// UPDATE PROJECT
// ========================================
// Only Admin
// PUT /api/projects/:id
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateProject
);


// ========================================
// DELETE PROJECT
// ========================================
// Only Admin
// DELETE /api/projects/:id
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProject
);


module.exports = router;