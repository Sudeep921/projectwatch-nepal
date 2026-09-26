const Project = require("../models/Project");

const {
  createAuditLog
} = require("../services/auditService");

const {
  validateProject
} = require("../utils/projectValidation");

// ========================================
// UPDATE PROJECT
// ========================================

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // ========================================
    // VALIDATE PROJECT
    // ========================================

    const validationErrors =
      validateProject(req.body);

    if (validationErrors.length) {
      return res.status(400).json({
        success: false,
        message: "Project validation failed",
        errors: validationErrors
      });
    }

    // ========================================
    // ALLOWED FIELDS
    // ========================================

    const allowedFields = [
      "name",
      "projectCode",
      "description",
      "province",
      "district",
      "municipality",
      "budget",
      "progress",
      "status",
      "risk",
      "contractor",
      "startDate",
      "endDate",
      "isPublic"
    ];

    // ========================================
    // UPDATE FIELDS
    // ========================================

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    // ========================================
    // UPDATE AUDIT LOG
    // ========================================

    await createAuditLog({
      user: req.user._id,
      action: "UPDATE_PROJECT",
      description:
        `Project ${project.name} was updated`,
      entity: "Project",
      entityId: project._id
    });

    // ========================================
    // RESPONSE
    // ========================================

    res.json({
      success: true,
      message: "Project updated successfully",
      project
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

// ========================================
// DELETE PROJECT
// ========================================

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // ========================================
    // DELETE AUDIT LOG
    // ========================================

    await createAuditLog({
      user: req.user._id,
      action: "DELETE_PROJECT",
      description:
        `Project ${project.name} was deleted`,
      entity: "Project",
      entityId: project._id
    });

    // ========================================
    // DELETE PROJECT
    // ========================================

    await Project.findByIdAndDelete(
      req.params.id
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  updateProject,
  deleteProject
};