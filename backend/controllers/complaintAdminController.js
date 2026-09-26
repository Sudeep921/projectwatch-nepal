const Complaint =
  require("../models/Complaint");

const updateComplaintStatus =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found"
        });
      }

      const allowedStatuses = [
        "Pending",
        "Under Review",
        "Resolved",
        "Rejected"
      ];

      if (
        !allowedStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status"
        });
      }

      complaint.status =
        req.body.status;

      if (req.body.response) {
        complaint.response =
          req.body.response;
      }

      await complaint.save();

      res.json({
        success: true,
        message:
          "Complaint status updated",
        complaint
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update complaint",
        error: error.message
      });
    }
  };

module.exports = {
  updateComplaintStatus
};