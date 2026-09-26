const Evidence =
  require("../models/Evidence");

const reviewEvidence =
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

      const allowedStatuses = [
        "Pending",
        "Verified",
        "Rejected",
        "Needs Human Review"
      ];

      if (
        !allowedStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid verification status"
        });
      }

      evidence.status =
        req.body.status;

      if (req.body.reviewNote) {
        evidence.reviewNote =
          req.body.reviewNote;
      }

      evidence.reviewedBy =
        req.user._id;

      evidence.reviewedAt =
        new Date();

      await evidence.save();

      res.json({
        success: true,
        message:
          "Evidence reviewed successfully",
        evidence
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to review evidence",
        error: error.message
      });
    }
  };

module.exports = {
  reviewEvidence
};