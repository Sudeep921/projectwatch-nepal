const Evidence = require("../models/Evidence");
const Project = require("../models/Project");
const Verification = require("../models/Verification");

const {
  analyzeEvidence
} = require("../services/aiService");

const analyzeProjectEvidence = async (
  req,
  res
) => {
  try {
    const { evidenceId } = req.params;

    const {
      reportedProgress
    } = req.body;

    const evidence =
      await Evidence.findById(
        evidenceId
      );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    const project =
      await Project.findById(
        evidence.project
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const result =
      await analyzeEvidence({
        projectProgress:
          project.progress,
        reportedProgress:
          reportedProgress,
        evidenceType:
          evidence.evidenceType
      });

    const verification =
      await Verification.create({
        project: project._id,
        evidence: evidence._id,
        reportedProgress:
          Number(
            reportedProgress || 0
          ),
        verificationStatus:
          result.status,
        notes: result.message
      });

    res.status(201).json({
      success: true,
      message:
        "Evidence analysis completed",
      analysis: result,
      verification
    });
  } catch (error) {
    console.error(
      "AI analysis error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to analyze evidence"
    });
  }
};

const getVerificationResults =
  async (req, res) => {
    try {
      const results =
        await Verification.find()
          .populate(
            "project",
            "name projectCode progress status"
          )
          .populate(
            "evidence"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        count: results.length,
        results
      });
    } catch (error) {
      console.error(
        "Verification results error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch verification results"
      });
    }
  };

module.exports = {
  analyzeProjectEvidence,
  getVerificationResults
};