const FieldReport = require("../models/FieldReport");

const createFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.create(req.body);

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateFieldReport = async (req, res) => {
  try {
    const report = await FieldReport.findByIdAndUpdate(
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
        message: "Field report not found"
      });
    }

    res.json({
      success: true,
      message: "Field report updated successfully",
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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