const express = require("express");

const {
  publicProjects,
  publicProjectDetails,
  publicSummary
} = require("../controllers/publicController");

const router = express.Router();

// No authentication required

router.get(
  "/projects",
  publicProjects
);

router.get(
  "/projects/:id",
  publicProjectDetails
);

router.get(
  "/summary",
  publicSummary
);

module.exports = router;
