const Complaint =
  require("../models/Complaint");

const Notification =
  require("../models/Notification");

const User =
  require("../models/User");

const Project =
  require("../models/Project");


// ==========================================
// GET ALL COMPLAINTS
// ==========================================

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
        count: complaints.length,
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


// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

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


// ==========================================
// CREATE COMPLAINT
// PUBLIC — NO LOGIN REQUIRED
// ==========================================

const createComplaint =
  async (req, res) => {
    try {
      console.log(
        "========== COMPLAINT REQUEST =========="
      );

      console.log(
        "REQ BODY:",
        req.body
      );


      const {
        project,
        citizenName,
        citizenPhone,
        citizenEmail,
        title,
        description,
        category,
        priority,
        location,
        latitude,
        longitude
      } = req.body;


      // ======================================
      // REQUIRED FIELD VALIDATION
      // ======================================

      if (!citizenName) {
        return res.status(400).json({
          success: false,
          message:
            "Citizen name is required"
        });
      }

      if (!citizenPhone) {
        return res.status(400).json({
          success: false,
          message:
            "Citizen phone is required"
        });
      }

      if (!title) {
        return res.status(400).json({
          success: false,
          message:
            "Complaint title is required"
        });
      }

      if (!description) {
        return res.status(400).json({
          success: false,
          message:
            "Complaint description is required"
        });
      }

      if (!project) {
        return res.status(400).json({
          success: false,
          message:
            "Project is required"
        });
      }


      // ======================================
      // FIND PROJECT
      // ======================================

      let projectId = null;

      const projectValue =
        String(project).trim();


      // --------------------------------------
      // If MongoDB ObjectId was sent
      // --------------------------------------

      if (
        /^[a-fA-F0-9]{24}$/.test(
          projectValue
        )
      ) {
        const projectDoc =
          await Project.findById(
            projectValue
          );

        if (!projectDoc) {
          return res.status(400).json({
            success: false,
            message:
              `Project not found: ${projectValue}`
          });
        }

        projectId =
          projectDoc._id;
      }


      // --------------------------------------
      // If project code was sent
      // Example:
      // PW-BAG-00124
      // --------------------------------------

      else {
        const projectDoc =
          await Project.findOne({
            projectCode:
              projectValue
          });

        if (!projectDoc) {
          return res.status(400).json({
            success: false,
            message:
              `Project not found: ${projectValue}`
          });
        }

        projectId =
          projectDoc._id;
      }


      // ======================================
      // CATEGORY
      // ======================================

      const categoryMap = {
        "project-delay":
          "Delay",

        "quality":
          "Quality",

        "corruption":
          "Other",

        "environment":
          "Other",

        "other":
          "Other"
      };

      const complaintCategory =
        categoryMap[
          category
        ] || "Other";


      // ======================================
      // PRIORITY
      // ======================================

      const priorityMap = {
        normal: "Medium",
        high: "High",
        critical: "Critical"
      };

      const complaintPriority =
        priorityMap[
          priority
        ] || "Medium";


      // ======================================
      // CREATE COMPLAINT
      // ======================================

      const complaint =
        await Complaint.create({
          project:
            projectId,

          citizenName:
            citizenName.trim(),

          citizenPhone:
            citizenPhone.trim(),

          citizenEmail:
            citizenEmail
              ? citizenEmail.trim()
              : "",

          title:
            title.trim(),

          description:
            description.trim(),

          category:
            complaintCategory,

          priority:
            complaintPriority,

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

          status:
            "Submitted"
        });


      // ======================================
      // FIND ALL ADMINS
      // ======================================

      const admins =
        await User.find({
          role: "admin"
        }).select("_id");


      // ======================================
      // CREATE NOTIFICATION FOR ADMINS
      // ======================================

      if (admins.length > 0) {
        const notifications =
          admins.map((admin) => ({
            recipient:
              admin._id,

            title:
              "New Complaint Submitted",

            message:
              `${citizenName} submitted a new complaint: ${title}`,

            type:
              "Info",

            project:
              projectId,

            read:
              false
          }));

        await Notification.insertMany(
          notifications
        );
      }


      // ======================================
      // RESPONSE
      // ======================================

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


// ==========================================
// UPDATE COMPLAINT
// ==========================================

const updateComplaint =
  async (req, res) => {
    try {
      const updateData = {
        ...req.body
      };


      // ======================================
      // WHEN COMPLAINT IS RESOLVED
      // ======================================

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


      // ======================================
      // UPDATE
      // ======================================

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


      // ======================================
      // RESPONSE
      // ======================================

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
          error.message ||
          "Unable to update complaint"
      });
    }
  };


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint
};