const Project = require("../models/Project");
const Alert = require("../models/Alert");
const { calculateRisk } = require("../services/riskService");


// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body
    };

    // Automatic risk calculation
    const calculatedRisk = calculateRisk(projectData);

    projectData.riskLevel = calculatedRisk;

    const project = await Project.create(projectData);

    // Create alert for High/Critical risk
    if (calculatedRisk === "High" || calculatedRisk === "Critical") {
      await Alert.create({
        project: project._id,
        title: `${calculatedRisk} Project Risk`,
        message: `${project.projectName} has been classified as ${calculatedRisk} risk.`,
        type: "Critical Risk",
        severity: calculatedRisk
      });
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET ALL PROJECTS
// ==========================================

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("assignedOfficer", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE PROJECT
// ==========================================

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("assignedOfficer", "-password");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE PROJECT
// ==========================================

const updateProject = async (req, res) => {
  try {
    const oldProject = await Project.findById(req.params.id);

    if (!oldProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const updatedData = {
      ...oldProject.toObject(),
      ...req.body
    };

    delete updatedData._id;
    delete updatedData.__v;

    // Recalculate risk
    updatedData.riskLevel = calculateRisk(updatedData);

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    ).populate("assignedOfficer", "-password");

    // Create alert if high/critical
    if (
      project.riskLevel === "High" ||
      project.riskLevel === "Critical"
    ) {
      await Alert.create({
        project: project._id,
        title: `${project.riskLevel} Project Risk`,
        message: `${project.projectName} is currently classified as ${project.riskLevel} risk.`,
        type: "Critical Risk",
        severity: project.riskLevel
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      project
    });

  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE PROJECT
// ==========================================

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await Alert.deleteMany({
      project: project._id
    });

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// PUBLIC PROJECTS
// ==========================================

const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isPublished: true
    })
      .select(
        "projectName projectCode province district municipality contractor budget progress status riskLevel description startDate endDate"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error("Public projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load public projects"
    });
  }
};


module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getPublicProjects
};