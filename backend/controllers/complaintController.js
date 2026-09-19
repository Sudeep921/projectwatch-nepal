const Complaint = require("../models/Complaint");
const Project = require("../models/Project");

// CREATE COMPLAINT
const createComplaint = async (req, res) => {
  try {
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

    if (!project || !citizenName || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project, citizen name, title and description are required"
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const complaint = await Complaint.create({
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
    });

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


// GET ALL COMPLAINTS
const getComplaints = async (req, res) => {
  try {
    const {
      project,
      category,
      priority,
      status
    } = req.query;

    const filter = {};

    if (project) filter.project = project;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate("project")
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


// GET SINGLE COMPLAINT
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("project");

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


// UPDATE COMPLAINT
const updateComplaint = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Project change गर्न नदिने
    delete updateData.project;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
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


// DELETE COMPLAINT
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

const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
        resolutionNote: req.body.resolutionNote || "",
        resolvedBy: req.body.resolvedBy || null,
        resolvedAt: new Date()
      },
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

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
   resolveComplaint
};