const FieldReport = require("../models/FieldReport");
const Project = require("../models/Project");
const Alert = require("../models/Alert");


// ==========================================
// CREATE FIELD REPORT
// ==========================================

const createFieldReport = async (req, res) => {
  try {
    const {
      project,
      progress,
      workStatus
    } = req.body;

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const report = await FieldReport.create({
      ...req.body,
      officer: req.user.id
    });

    // Update project progress
    if (typeof progress === "number") {
      projectExists.progress = progress;
    }

    // Update project status
    if (workStatus === "Delayed") {
      projectExists.status = "Delayed";
    }

    if (workStatus === "Critical") {
      projectExists.status = "Critical";
    }

    await projectExists.save();

    // Create alert for delayed/critical report
    if (
      workStatus === "Delayed" ||
      workStatus === "Critical"
    ) {
      await Alert.create({
        project: projectExists._id,
        title: `Field Report: ${workStatus}`,
        message: `${projectExists.projectName} has a ${workStatus.toLowerCase()} field report.`,
        type: workStatus === "Delayed"
          ? "Delay"
          : "Critical Risk",
        severity: workStatus === "Critical"
          ? "Critical"
          : "High"
      });
    }

    res.status(201).json({
      success: true,
      message: "Field report created successfully",
      report
    });

  } catch (error) {
    console.error("Create field report error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET ALL FIELD REPORTS
// ==========================================

const getFieldReports = async (req, res) => {
  try {
    const reports = await FieldReport.find()
      .populate("project")
      .populate("officer", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error("Get field reports error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE FIELD REPORT
// ==========================================

const getFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.findById(req.params.id)
      .populate("project")
      .populate("officer", "-password");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Get field report error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE FIELD REPORT
// ==========================================

const updateFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    Object.assign(report, req.body);

    await report.save();

    res.json({
      success: true,
      message: "Field report updated successfully",
      report
    });

  } catch (error) {
    console.error("Update field report error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE FIELD REPORT
// ==========================================

const deleteFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    res.json({
      success: true,
      message: "Field report deleted successfully"
    });

  } catch (error) {
    console.error("Delete field report error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createFieldReport,
  getFieldReports,
  getFieldReport,
  updateFieldReport,
  deleteFieldReport
};