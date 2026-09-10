const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all projects
router.get("/", getProjects);

// Get single project
router.get("/:id", getProject);

// Create project - protected
router.post("/", authMiddleware, createProject);

// Update project - protected
router.put("/:id", authMiddleware, updateProject);

// Delete project - protected
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;