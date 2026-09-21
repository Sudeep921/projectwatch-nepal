const Evidence = require("../models/Evidence");
const Project = require("../models/Project");
const Alert = require("../models/Alert");

const {
  analyzeEvidence
} = require("../services/aiVerificationService");

const analyzeEvidenceWithAI = async (req, res) => {
  try {
    const evidence = await Evidence.findById(
      req.params.id
    );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    const project = await Project.findById(
      evidence.project
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    evidence.aiStatus = "Processing";

    await evidence.save();

    const result = await analyzeEvidence({
      projectProgress: project.progress,
      reportedProgress: req.body.reportedProgress,
      evidenceType: evidence.fileType
    });

    if (result.status === "Potential Discrepancy") {
      evidence.aiStatus =
        "Potential Discrepancy";

      evidence.verificationStatus =
        "Needs Human Review";

      evidence.verificationNote =
        result.message;

      await Alert.create({
        project: project._id,

        title:
          "Potential Discrepancy Detected",

        message:
          result.message,

        type: "Verification",

        severity: "High"
      });
    } else {
      evidence.aiStatus = "Verified";

      evidence.verificationStatus =
        "Verified";

      evidence.verificationNote =
        result.message;
    }

    await evidence.save();

    res.json({
      success: true,

      message:
        "Evidence AI analysis completed",

      result,

      evidence
    });
  } catch (error) {
    console.error(
      "AI verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  analyzeEvidenceWithAI
};