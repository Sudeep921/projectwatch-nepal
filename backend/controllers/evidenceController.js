const Evidence = require("../models/Evidence");
const FieldReport = require("../models/FieldReport");
const Project = require("../models/Project");


// ==========================================
// CREATE EVIDENCE RECORD
// ==========================================

const createEvidence = async (req, res) => {
  try {
    const {
      project,
      fieldReport
    } = req.body;

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (fieldReport) {
      const reportExists =
        await FieldReport.findById(fieldReport);

      if (!reportExists) {
        return res.status(404).json({
          success: false,
          message: "Field report not found"
        });
      }
    }

    const evidence = await Evidence.create({
      ...req.body,
      uploadedBy: req.user.id
    });

    // Increase field report evidence count
    if (fieldReport) {
      await FieldReport.findByIdAndUpdate(
        fieldReport,
        {
          $inc: {
            evidenceCount: 1
          }
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Evidence created successfully",
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


// ==========================================
// GET ALL EVIDENCE
// ==========================================

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


// ==========================================
// GET SINGLE EVIDENCE
// ==========================================

const getSingleEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(
      req.params.id
    )
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
    console.error("Get single evidence error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE EVIDENCE
// ==========================================

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


// ==========================================
// DELETE EVIDENCE
// ==========================================

const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(
      req.params.id
    );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    // Decrease evidence count
    if (evidence.fieldReport) {
      await FieldReport.findByIdAndUpdate(
        evidence.fieldReport,
        {
          $inc: {
            evidenceCount: -1
          }
        }
      );
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