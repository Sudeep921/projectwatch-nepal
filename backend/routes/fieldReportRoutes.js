const express = require("express");

const {
  getFieldReports,
  getFieldReport,
  createFieldReport,
  updateFieldReport,
  deleteFieldReport
} = require(
  "../controllers/fieldReportController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getFieldReports
);

router.get(
  "/:id",
  getFieldReport
);

router.post(
  "/",
  createFieldReport
);

router.put(
  "/:id",
  updateFieldReport
);

router.delete(
  "/:id",
  deleteFieldReport
);

module.exports = router;