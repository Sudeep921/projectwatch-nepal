const Complaint =
  require("../models/Complaint");

const getComplaints =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find()
          .populate(
            "project",
            "projectName projectCode province district"
          )
          .populate(
            "resolvedBy",
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

const getComplaint =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        )
          .populate(
            "project",
            "projectName projectCode province district"
          )
          .populate(
            "resolvedBy",
            "name email role"
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
        complaint
      });
    } catch (error) {
      console.error(
        "Get complaint error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch complaint"
      });
    }
  };

/*
  PUBLIC SUBMISSION — no login required.
  Any citizen can submit this; there is no
  req.user here, so we never rely on it.
*/

const createComplaint =
  async (req, res) => {
    try {
      const {
        project,
        citizenName,
        citizenPhone,
        citizenEmail,
        title,
        description,
        category,
        location,
        latitude,
        longitude
      } = req.body;

      if (
        !citizenName ||
        !citizenPhone ||
        !title ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, phone, subject and description are required"
        });
      }

      const complaint =
        await Complaint.create({
          project:
            project || undefined,

          citizenName,
          citizenPhone,

          citizenEmail:
            citizenEmail || "",

          title,
          description,

          category:
            category || "Other",

          location:
            location || "",

          latitude:
            latitude !== undefined &&
            latitude !== ""
              ? Number(latitude)
              : undefined,

          longitude:
            longitude !== undefined &&
            longitude !== ""
              ? Number(longitude)
              : undefined,

          status: "Submitted"
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
      const updateData = {
        ...req.body
      };

      if (
        updateData.status ===
          "Resolved" &&
        !updateData.resolvedAt
      ) {
        updateData.resolvedAt =
          new Date();

        updateData.resolvedBy =
          req.user?.id ||
          req.user?._id;
      }

      const complaint =
        await Complaint.findByIdAndUpdate(
          req.params.id,
          updateData,
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
  getComplaint,
  createComplaint,
  updateComplaint
};