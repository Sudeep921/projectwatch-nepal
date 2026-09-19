const express = require("express");

const {
  createEvidence,
  getEvidence,
  getSingleEvidence,
  updateEvidence,
  deleteEvidence
} = require("../controllers/evidenceController");

const upload = require("../config/upload");

const router = express.Router();


// Upload evidence
router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
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

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


// Create evidence record
router.post("/", createEvidence);


// Get all evidence
router.get("/", getEvidence);


// Get single evidence
router.get("/:id", getSingleEvidence);


// Update evidence
router.put("/:id", updateEvidence);


// Delete evidence
router.delete("/:id", deleteEvidence);


module.exports = router;