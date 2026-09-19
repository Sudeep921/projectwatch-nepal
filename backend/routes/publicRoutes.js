const express = require("express");

const {
  publicProjects,
  publicProjectDetails,
  publicSummary
} = require("../controllers/publicController");

const router = express.Router();


// Public project list
router.get("/projects", publicProjects);


// Public project details
router.get("/projects/:id", publicProjectDetails);


// Public statistics
router.get("/summary", publicSummary);


module.exports = router;