const Verification = require("../models/Verification");
const FieldReport = require("../models/FieldReport");
const Project = require("../models/Project");
const Alert = require("../models/Alert");


// ==========================================
// CREATE VERIFICATION
// ==========================================

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

    const verification = await Verification.create({
      project,
      fieldReport,
      verifier: req.user.id,
      verificationType,
      status,
      verifiedProgress,
      remarks,
      discrepancyDetected,
      discrepancyDetails,
      verifiedAt:
        status === "Verified" ||
        status === "Rejected"
          ? new Date()
          : null
    });

    // Update field report status
    if (status === "Verified") {
      reportExists.verificationStatus = "Verified";
    }

    if (status === "Rejected") {
      reportExists.verificationStatus = "Rejected";
    }

    await reportExists.save();

    // Sync verified progress to project
    if (
      status === "Verified" &&
      typeof verifiedProgress === "number"
    ) {
      projectExists.progress = verifiedProgress;
      await projectExists.save();
    }

    // Discrepancy alert
    if (discrepancyDetected) {
      await Alert.create({
        project,
        title: "Potential Discrepancy Detected",
        message:
          discrepancyDetails ||
          "Verification requires human review.",
        type: "Verification",
        severity: "High"
      });
    }

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


// ==========================================
// GET ALL VERIFICATIONS
// ==========================================

const getVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find()
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
    console.error("Get verifications error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE VERIFICATION
// ==========================================

const getVerification = async (req, res) => {
  try {
    const verification = await Verification.findById(
      req.params.id
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


// ==========================================
// UPDATE VERIFICATION
// ==========================================

const updateVerification = async (req, res) => {
  try {
    const verification = await Verification.findById(
      req.params.id
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    Object.assign(verification, req.body);

    if (
      req.body.status === "Verified" ||
      req.body.status === "Rejected"
    ) {
      verification.verifiedAt = new Date();
    }

    await verification.save();

    // Sync project progress after verification
    if (
      verification.status === "Verified" &&
      typeof verification.verifiedProgress === "number"
    ) {
      await Project.findByIdAndUpdate(
        verification.project,
        {
          progress: verification.verifiedProgress
        }
      );
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


// ==========================================
// DELETE VERIFICATION
// ==========================================

const deleteVerification = async (req, res) => {
  try {
    const verification =
      await Verification.findByIdAndDelete(
        req.params.id
      );

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