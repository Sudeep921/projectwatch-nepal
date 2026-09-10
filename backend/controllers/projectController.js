const Project = require("../models/Project");

// ===============================
// CREATE PROJECT
// ===============================
async function createProject(req, res) {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
}

// ===============================
// GET ALL PROJECTS
// ===============================
async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
}

// ===============================
// GET SINGLE PROJECT
// ===============================
async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

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
      message: "Failed to fetch project"
    });
  }
}

// ===============================
// UPDATE PROJECT
// ===============================
async function updateProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
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
      message: "Failed to update project"
    });
  }
}

// ===============================
// DELETE PROJECT
// ===============================
async function deleteProject(req, res) {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project"
    });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
};