const express = require("express");

const {
  getProjectReport
} = require(
  "../controllers/reportController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();

router.use(authMiddleware);

router.get(
  "/projects",
  getProjectReport
);

module.exports = router;