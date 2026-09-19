const Evidence = require("../models/Evidence");


// ========================================
// CREATE EVIDENCE
// ========================================

const createEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.create(req.body);

    res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      evidence
    });
  } catch (error) {
    console.error("Create evidence error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// GET ALL EVIDENCE
// ========================================

const getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find()
      .populate("project")
      .populate("fieldReport")
      .populate("uploadedBy", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    console.error("Get evidence error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// GET SINGLE EVIDENCE
// ========================================

const getSingleEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate("project")
      .populate("fieldReport")
      .populate("uploadedBy", "-password");

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    res.json({
      success: true,
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// UPDATE EVIDENCE
// ========================================

const updateEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    res.json({
      success: true,
      message: "Evidence updated successfully",
      evidence
    });
  } catch (error) {
    console.error("Update evidence error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// DELETE EVIDENCE
// ========================================

const deleteEvidence = async (req, res) => {
  try {
    const evidence =
      await Evidence.findByIdAndDelete(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    res.json({
      success: true,
      message: "Evidence deleted successfully"
    });
  } catch (error) {
    console.error("Delete evidence error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createEvidence,
  getEvidence,
  getSingleEvidence,
  updateEvidence,
  deleteEvidence
};