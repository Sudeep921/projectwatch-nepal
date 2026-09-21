const express = require("express");

const {
  createEvidence,
  getEvidence,
  getSingleEvidence,
  updateEvidence,
  deleteEvidence
} = require("../controllers/evidenceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/upload");

const router = express.Router();

// Upload file
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  upload.single("file"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required"
      });
    }

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/evidence/${req.file.filename}`
      }
    });
  }
);

// Evidence database record
router.post(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  createEvidence
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getEvidence
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  getSingleEvidence
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("officer", "admin"),
  updateEvidence
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteEvidence
);

module.exports = router;