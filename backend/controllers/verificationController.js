const Verification = require("../models/verification");
const Project = require("../models/Project");
const FieldReport = require("../models/FieldReport");

// CREATE VERIFICATION
const createVerification = async (req, res) => {
  try {
    const {
      project,
      fieldReport,
      verificationType,
      status,
      verifiedProgress,
      remarks,
      discrepancyDetected,
      discrepancyDetails
    } = req.body;

    if (!project || !fieldReport || !verificationType) {
      return res.status(400).json({
        success: false,
        message: "Project, field report and verification type are required"
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const reportExists = await FieldReport.findById(fieldReport);

    if (!reportExists) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    if (reportExists.project.toString() !== project.toString()) {
      return res.status(400).json({
        success: false,
        message: "Field report does not belong to this project"
      });
    }

    const verifier = req.user._id;

    const verification = await Verification.create({
      project,
      fieldReport,
      verifier,
      verificationType,
      status,
      verifiedProgress,
      remarks,
      discrepancyDetected,
      discrepancyDetails
    });

    res.status(201).json({
      success: true,
      message: "Verification created successfully",
      verification
    });

  } catch (error) {
    console.error("Create verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL VERIFICATIONS
const getVerifications = async (req, res) => {
  try {
    const { project, fieldReport, status } = req.query;

    const filter = {};

    if (project) filter.project = project;
    if (fieldReport) filter.fieldReport = fieldReport;
    if (status) filter.status = status;

    const verifications = await Verification.find(filter)
      .populate("project")
      .populate("fieldReport")
      .populate("verifier", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: verifications.length,
      verifications
    });

  } catch (error) {
    console.error("Get verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET SINGLE VERIFICATION
const getVerification = async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate("project")
      .populate("fieldReport")
      .populate("verifier", "-password");

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    res.json({
      success: true,
      verification
    });

  } catch (error) {
    console.error("Get verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE VERIFICATION
const updateVerification = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Verifier user बाट मात्र लिने
    delete updateData.verifier;

    const verification = await Verification.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("project")
      .populate("fieldReport")
      .populate("verifier", "-password");

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    res.json({
      success: true,
      message: "Verification updated successfully",
      verification
    });

  } catch (error) {
    console.error("Update verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE VERIFICATION
const deleteVerification = async (req, res) => {
  try {
    const verification =
      await Verification.findByIdAndDelete(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    res.json({
      success: true,
      message: "Verification deleted successfully"
    });

  } catch (error) {
    console.error("Delete verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createVerification,
  getVerifications,
  getVerification,
  updateVerification,
  deleteVerification
};