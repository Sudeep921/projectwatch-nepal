const express = require("express");

const {
  createFieldReport,
  getFieldReports,
  getFieldReport,
  updateFieldReport,
  deleteFieldReport
} = require("../controllers/fieldReportController");

const router = express.Router();

router.post("/", createFieldReport);
router.get("/", getFieldReports);
router.get("/:id", getFieldReport);
router.put("/:id", updateFieldReport);
router.delete("/:id", deleteFieldReport);

module.exports = router;