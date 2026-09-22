const Complaint =
  require("../models/Complaint");

const getComplaints =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find()
          .populate(
            "project",
            "name projectId province district"
          )
          .populate(
            "submittedBy",
            "name email role"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        count:
          complaints.length,
        complaints
      });
    } catch (error) {
      console.error(
        "Get complaints error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch complaints"
      });
    }
  };

const createComplaint =
  async (req, res) => {
    try {
      const {
        project,
        subject,
        description,
        location
      } = req.body;

      if (
        !subject ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Subject and description are required"
        });
      }

      const complaint =
        await Complaint.create({
          project:
            project || undefined,
          subject,
          description,
          location:
            location || "",
          submittedBy:
            req.user?.id ||
            req.user?._id,
          status: "Pending"
        });

      res.status(201).json({
        success: true,
        message:
          "Complaint submitted successfully",
        complaint
      });
    } catch (error) {
      console.error(
        "Create complaint error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to submit complaint"
      });
    }
  };

const updateComplaint =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            "Complaint not found"
        });
      }

      res.json({
        success: true,
        message:
          "Complaint updated successfully",
        complaint
      });
    } catch (error) {
      console.error(
        "Update complaint error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update complaint"
      });
    }
  };

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaint
};