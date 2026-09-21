const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const Alert = require("../models/Alert");
const Project = require("../models/Project");


// ==========================================
// CREATE COMPLAINT
// ==========================================

const createComplaint = async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const complaint = await Complaint.create({
      ...req.body
    });

    // Critical / High complaint creates alert
    if (
      complaint.priority === "High" ||
      complaint.priority === "Critical"
    ) {
      await Alert.create({
        project: complaint.project,
        title: `New ${complaint.priority} Complaint`,
        message: complaint.title,
        type: "Complaint",
        severity: complaint.priority
      });
    }

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET ALL COMPLAINTS
// ==========================================

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("project")
      .populate("resolvedBy", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("project")
      .populate("resolvedBy", "-password");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.json({
      success: true,
      complaint
    });

  } catch (error) {
    console.error("Get complaint error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE COMPLAINT
// ==========================================

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("project");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.json({
      success: true,
      message: "Complaint updated successfully",
      complaint
    });

  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// RESOLVE COMPLAINT
// ==========================================

const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("project");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    complaint.status = "Resolved";

    complaint.resolutionNote =
      req.body.resolutionNote || "";

    // Use logged-in user
    complaint.resolvedBy = req.user.id;

    complaint.resolvedAt = new Date();

    await complaint.save();

    res.json({
      success: true,
      message: "Complaint resolved successfully",
      complaint
    });

  } catch (error) {
    console.error("Resolve complaint error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE COMPLAINT
// ==========================================

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    await Alert.deleteMany({
      project: complaint.project,
      type: "Complaint"
    });

    res.json({
      success: true,
      message: "Complaint deleted successfully"
    });

  } catch (error) {
    console.error("Delete complaint error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  resolveComplaint,
  deleteComplaint
};