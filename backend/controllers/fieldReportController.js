const FieldReport = require("../models/FieldReport");

const getFieldReports = async (req, res) => {
  try {
    const reports =
      await FieldReport.find()
        .populate(
          "project",
          "name projectId province district municipality progress status"
        )
        .populate(
          "officer",
          "name email role"
        )
        .sort({
          createdAt: -1
        });

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error(
      "Get field reports error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch field reports"
    });
  }
};

const getFieldReport = async (
  req,
  res
) => {
  try {
    const report =
      await FieldReport.findById(
        req.params.id
      )
        .populate("project")
        .populate(
          "officer",
          "name email role"
        );

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Field report not found"
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error(
      "Get field report error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch field report"
    });
  }
};

const createFieldReport = async (
  req,
  res
) => {
  try {
    const {
      project,
      reportedProgress,
      observation,
      location,
      latitude,
      longitude
    } = req.body;

    if (
      !project ||
      reportedProgress === undefined ||
      !observation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project, reported progress and observation are required"
      });
    }

    const report =
      await FieldReport.create({
        project,
        officer:
          req.user?.id ||
          req.user?._id,
        reportedProgress:
          Number(
            reportedProgress
          ),
        observation,
        location:
          location || "",
        latitude:
          latitude !== undefined
            ? Number(latitude)
            : undefined,
        longitude:
          longitude !== undefined
            ? Number(longitude)
            : undefined,
        status: "Submitted"
      });

    const populatedReport =
      await FieldReport.findById(
        report._id
      ).populate(
        "project",
        "name projectId"
      );

    res.status(201).json({
      success: true,
      message:
        "Field report created successfully",
      report:
        populatedReport
    });
  } catch (error) {
    console.error(
      "Create field report error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create field report"
    });
  }
};

const updateFieldReport = async (
  req,
  res
) => {
  try {
    const report =
      await FieldReport.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Field report not found"
      });
    }

    res.json({
      success: true,
      message:
        "Field report updated successfully",
      report
    });
  } catch (error) {
    console.error(
      "Update field report error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update field report"
    });
  }
};

const deleteFieldReport = async (
  req,
  res
) => {
  try {
    const report =
      await FieldReport.findByIdAndDelete(
        req.params.id
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Field report not found"
      });
    }

    res.json({
      success: true,
      message:
        "Field report deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete field report error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete field report"
    });
  }
};

module.exports = {
  getFieldReports,
  getFieldReport,
  createFieldReport,
  updateFieldReport,
  deleteFieldReport
};