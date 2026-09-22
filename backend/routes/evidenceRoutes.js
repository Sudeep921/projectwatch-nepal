const express = require("express");

const {
  getEvidence,
  getEvidenceById,
  uploadEvidence,
  createEvidence,
  deleteEvidence
} = require(
  "../controllers/evidenceController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const upload =
  require("../config/upload");

const router =
  express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getEvidence
);

router.get(
  "/:id",
  getEvidenceById
);

router.post(
  "/upload",
  upload.single("file"),
  uploadEvidence
);

router.post(
  "/",
  createEvidence
);

router.delete(
  "/:id",
  deleteEvidence
);

module.exports = router;