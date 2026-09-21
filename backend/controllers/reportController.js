const Project = require("../models/Project");
const Complaint = require("../models/Complaint");
const FieldReport = require("../models/FieldReport");
const Verification = require("../models/Verification");

const getProjectReport = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("assignedOfficer", "-password");

    const complaints = await Complaint.countDocuments();

    const fieldReports =
      await FieldReport.countDocuments();

    const verifications =
      await Verification.countDocuments();

    const totalBudget = projects.reduce(
      (sum, project) => sum + (project.budget || 0),
      0
    );

    const averageProgress =
      projects.length > 0
        ? projects.reduce(
            (sum, project) =>
              sum + (project.progress || 0),
            0
          ) / projects.length
        : 0;

    res.json({
      success: true,

      report: {
        generatedAt: new Date(),

        totalProjects: projects.length,

        totalBudget,

        averageProgress:
          Number(averageProgress.toFixed(2)),

        complaints,

        fieldReports,

        verifications,

        projects
      }
    });
  } catch (error) {
    console.error("Report error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProjectReport
};