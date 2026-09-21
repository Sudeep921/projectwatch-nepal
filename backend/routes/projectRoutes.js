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

// Public projects
router.get(
  "/public",
  getPublicProjects
);

// Admin + Officer
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

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProject
);

module.exports = router;