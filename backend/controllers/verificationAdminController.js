const Verification =
  require("../models/Verification");

const reviewVerification =
  async (req, res) => {
    try {
      const verification =
        await Verification.findById(
          req.params.id
        );

      if (!verification) {
        return res.status(404).json({
          success: false,
          message:
            "Verification not found"
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

      verification.status =
        req.body.status;

      verification.reviewedBy =
        req.user._id;

      verification.reviewedAt =
        new Date();

      if (req.body.note) {
        verification.note =
          req.body.note;
      }

      await verification.save();

      res.json({
        success: true,
        message:
          "Verification reviewed",
        verification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to review verification",
        error: error.message
      });
    }
  };

module.exports = {
  reviewVerification
};