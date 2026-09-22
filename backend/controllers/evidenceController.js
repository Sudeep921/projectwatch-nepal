const Evidence = require("../models/Evidence");

const getEvidence = async (
  req,
  res
) => {
  try {
    const evidence =
      await Evidence.find()
        .populate(
          "project",
          "name projectId province district"
        )
        .populate(
          "uploadedBy",
          "name email role"
        )
        .sort({
          createdAt: -1
        });

    res.json({
      success: true,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    console.error(
      "Get evidence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch evidence"
    });
  }
};

const getEvidenceById = async (
  req,
  res
) => {
  try {
    const evidence =
      await Evidence.findById(
        req.params.id
      )
        .populate("project")
        .populate(
          "uploadedBy",
          "name email role"
        );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message:
          "Evidence not found"
      });
    }

    res.json({
      success: true,
      evidence
    });
  } catch (error) {
    console.error(
      "Get evidence by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch evidence"
    });
  }
};

const uploadEvidence = async (
  req,
  res
) => {
  try {
    const {
      project,
      evidenceType,
      description
    } = req.body;

    if (!project) {
      return res.status(400).json({
        success: false,
        message:
          "Project is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Evidence file is required"
      });
    }

    const fileUrl =
      `/uploads/evidence/${req.file.filename}`;

    const evidence =
      await Evidence.create({
        project,
        evidenceType:
          evidenceType ||
          "Photo",
        description:
          description || "",
        filename:
          req.file.filename,
        originalName:
          req.file.originalname,
        filePath:
          fileUrl,
        fileUrl,
        mimeType:
          req.file.mimetype,
        fileSize:
          req.file.size,
        uploadedBy:
          req.user?.id ||
          req.user?._id
      });

    res.status(201).json({
      success: true,
      message:
        "Evidence uploaded successfully",
      evidence
    });
  } catch (error) {
    console.error(
      "Upload evidence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to upload evidence"
    });
  }
};

const createEvidence = async (
  req,
  res
) => {
  try {
    const evidence =
      await Evidence.create({
        ...req.body,
        uploadedBy:
          req.user?.id ||
          req.user?._id
      });

    res.status(201).json({
      success: true,
      message:
        "Evidence record created successfully",
      evidence
    });
  } catch (error) {
    console.error(
      "Create evidence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create evidence"
    });
  }
};

const deleteEvidence = async (
  req,
  res
) => {
  try {
    const evidence =
      await Evidence.findByIdAndDelete(
        req.params.id
      );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message:
          "Evidence not found"
      });
    }

    res.json({
      success: true,
      message:
        "Evidence deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete evidence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete evidence"
    });
  }
};

module.exports = {
  getEvidence,
  getEvidenceById,
  uploadEvidence,
  createEvidence,
  deleteEvidence
};