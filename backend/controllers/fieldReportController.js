const FieldReport = require("../models/FieldReport");
const Project = require("../models/Project");


// ===============================
// CREATE FIELD REPORT
// ===============================
const createFieldReport = async (req, res) => {
  try {
    const {
      project,
      reportTitle,
      description,
      progress,
      workStatus,
      location,
      latitude,
      longitude,
      reportDate
    } = req.body;

    // Required fields
    if (!project || !reportTitle || !description) {
      return res.status(400).json({
        success: false,
        message: "Project, report title and description are required"
      });
    }

    // Check project
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Officer from logged-in user
    const officer = req.user._id;

    const report = await FieldReport.create({
      project,
      officer,
      reportTitle,
      description,
      progress,
      workStatus,
      location,
      latitude,
      longitude,
      reportDate,
      hasGPS:
        latitude !== undefined &&
        latitude !== null &&
        longitude !== undefined &&
        longitude !== null
    });

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


// ===============================
// GET ALL FIELD REPORTS
// ===============================
const getFieldReports = async (req, res) => {
  try {
    const {
      project,
      verificationStatus,
      workStatus
    } = req.query;

    const filter = {};

    if (project) {
      filter.project = project;
    }

    if (verificationStatus) {
      filter.verificationStatus = verificationStatus;
    }

    if (workStatus) {
      filter.workStatus = workStatus;
    }

    const reports = await FieldReport.find(filter)
      .populate("project")
      .populate("officer", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
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


// ===============================
// GET SINGLE FIELD REPORT
// ===============================
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

    res.status(200).json({
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


// ===============================
// UPDATE FIELD REPORT
// ===============================
const updateFieldReport = async (req, res) => {
  try {
    // Do not allow officer to change
    // report ownership through body
    const updateData = { ...req.body };

    delete updateData.officer;

    // Automatically update GPS status
    if (
      updateData.latitude !== undefined ||
      updateData.longitude !== undefined
    ) {
      const currentReport = await FieldReport.findById(req.params.id);

      if (!currentReport) {
        return res.status(404).json({
          success: false,
          message: "Field report not found"
        });
      }

      const latitude =
        updateData.latitude !== undefined
          ? updateData.latitude
          : currentReport.latitude;

      const longitude =
        updateData.longitude !== undefined
          ? updateData.longitude
          : currentReport.longitude;

      updateData.hasGPS =
        latitude !== undefined &&
        latitude !== null &&
        longitude !== undefined &&
        longitude !== null;
    }

    const report = await FieldReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    res.status(200).json({
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


// ===============================
// DELETE FIELD REPORT
// ===============================
const deleteFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.findByIdAndDelete(
      req.params.id
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Field report not found"
      });
    }

    res.status(200).json({
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


// ===============================
// EXPORT
// ===============================
module.exports = {
  createFieldReport,
  getFieldReports,
  getFieldReport,
  updateFieldReport,
  deleteFieldReport
};