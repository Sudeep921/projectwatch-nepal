const express = require("express");

const {
  getProjectReport
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/projects",
  authMiddleware,
  roleMiddleware("admin", "officer"),
  getProjectReport
);

module.exports = router;