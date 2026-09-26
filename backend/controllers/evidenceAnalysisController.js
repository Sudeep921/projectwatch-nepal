const Evidence =
  require("../models/Evidence");

const {
  analyzeEvidence
} = require(
  "../services/aiService"
);

const analyzeEvidenceRecord =
  async (req, res) => {
    try {
      const evidence =
        await Evidence.findById(
          req.params.id
        );

      if (!evidence) {
        return res.status(404).json({
          success: false,
          message: "Evidence not found"
        });
      }

      const projectProgress =
        Number(
          req.body.projectProgress || 0
        );

      const reportedProgress =
        Number(
          req.body.reportedProgress || 0
        );

      const result =
        await analyzeEvidence({
          projectProgress,
          reportedProgress,
          evidenceType:
            evidence.type
        });

      evidence.aiStatus =
        result.status;

      evidence.aiMessage =
        result.message;

      evidence.aiDifference =
        result.difference;

      evidence.aiAnalyzedAt =
        result.analyzedAt;

      await evidence.save();

      res.json({
        success: true,
        result,
        evidence
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Evidence analysis failed",
        error: error.message
      });
    }
  };

module.exports = {
  analyzeEvidenceRecord
};