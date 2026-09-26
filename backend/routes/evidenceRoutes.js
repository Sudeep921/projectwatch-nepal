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


const adminMiddleware =
  require(
    "../middleware/adminMiddleware"
  );


const {
  reviewEvidence
} = require(
  "../controllers/evidenceReviewController"
);
const {
  analyzeEvidenceRecord
} = require(
  "../controllers/evidenceAnalysisController"
);

const upload =
  require(
    "../config/upload"
  );


const router =
  express.Router();


// ========================================
// AUTHENTICATION
// ========================================

router.use(
  authMiddleware
);


// ========================================
// GET ALL EVIDENCE
// ========================================

router.get(
  "/",
  getEvidence
);


// ========================================
// GET EVIDENCE BY ID
// ========================================

router.get(
  "/:id",
  getEvidenceById
);


// ========================================
// UPLOAD EVIDENCE
// ========================================

router.post(
  "/upload",
  upload.single("file"),
  uploadEvidence
);


// ========================================
// CREATE EVIDENCE
// ========================================

router.post(
  "/",
  createEvidence
);


// ========================================
// DELETE EVIDENCE
// ========================================

router.delete(
  "/:id",
  deleteEvidence
);


// ========================================
// REVIEW EVIDENCE
// ADMIN ONLY
// ========================================

router.put(
  "/:id/review",
  adminMiddleware,
  reviewEvidence
);
router.post(
  "/:id/analyze",
  authMiddleware,
  adminMiddleware,
  analyzeEvidenceRecord
);


// ========================================
// EXPORT
// ========================================

module.exports = router;