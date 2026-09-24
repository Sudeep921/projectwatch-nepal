const express = require("express");

const {
  getPublicProjects,
  getPublicProject,
  getPublicSummary
} = require("../controllers/publicController");

const router = express.Router();

router.get(
  "/summary",
  getPublicSummary
);

router.get(
  "/projects",
  getPublicProjects
);

router.get(
  "/projects/:id",
  getPublicProject
);

module.exports = router;