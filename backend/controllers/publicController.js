const Project = require("../models/Project");
const Complaint = require("../models/Complaint");


// ==========================================
// PUBLIC PROJECT LIST
// ==========================================

const publicProjects = async (req, res) => {
  try {

    const filter = {
      isPublished: true
    };

    // Search
    if (req.query.search) {
      filter.$or = [
        {
          projectName: {
            $regex: req.query.search,
            $options: "i"
          }
        },
        {
          projectCode: {
            $regex: req.query.search,
            $options: "i"
          }
        }
      ];
    }

    // Province filter
    if (req.query.province) {
      filter.province = req.query.province;
    }

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .select(
        "projectName projectCode province district municipality contractor budget progress status riskLevel description startDate endDate"
      )
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {

    console.error(
      "Public projects error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load public projects"
    });
  }
};


// ==========================================
// PUBLIC PROJECT DETAILS
// ==========================================

const publicProjectDetails = async (req, res) => {
  try {

    const project = await Project.findOne({
      _id: req.params.id,
      isPublished: true
    }).select(
      "projectName projectCode province district municipality contractor budget progress status riskLevel description startDate endDate"
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Public project not found"
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load project"
    });
  }
};


// ==========================================
// PUBLIC SUMMARY
// ==========================================

const publicSummary = async (req, res) => {
  try {

    const totalProjects =
      await Project.countDocuments({
        isPublished: true
      });

    const activeProjects =
      await Project.countDocuments({
        isPublished: true,
        status: "Active"
      });

    const delayedProjects =
      await Project.countDocuments({
        isPublished: true,
        status: "Delayed"
      });

    const completedProjects =
      await Project.countDocuments({
        isPublished: true,
        status: "Completed"
      });

    const criticalProjects =
      await Project.countDocuments({
        isPublished: true,
        status: "Critical"
      });

    const complaintCount =
      await Complaint.countDocuments();


    res.json({
      success: true,

      summary: {
        totalProjects,
        activeProjects,
        delayedProjects,
        completedProjects,
        criticalProjects,
        complaintCount
      }
    });

  } catch (error) {

    console.error(
      "Public summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load public summary"
    });
  }
};


module.exports = {
  publicProjects,
  publicProjectDetails,
  publicSummary
};