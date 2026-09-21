const Project = require("../models/Project");
const Complaint = require("../models/Complaint");
const FieldReport = require("../models/FieldReport");
const Verification = require("../models/Verification");
const Alert = require("../models/Alert");


// ==========================================
// GOVERNMENT DASHBOARD STATS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {

    // -------------------------------
    // PROJECT COUNTS
    // -------------------------------

    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "Active"
    });

    const completedProjects = await Project.countDocuments({
      status: "Completed"
    });

    const delayedProjects = await Project.countDocuments({
      status: "Delayed"
    });

    const criticalProjects = await Project.countDocuments({
      status: "Critical"
    });


    // -------------------------------
    // BUDGET
    // -------------------------------

    const budgetResult = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: {
            $sum: "$budget"
          }
        }
      }
    ]);

    const totalBudget =
      budgetResult.length > 0
        ? budgetResult[0].totalBudget
        : 0;


    // -------------------------------
    // AVERAGE PROGRESS
    // -------------------------------

    const progressResult = await Project.aggregate([
      {
        $group: {
          _id: null,
          averageProgress: {
            $avg: "$progress"
          }
        }
      }
    ]);

    const averageProgress =
      progressResult.length > 0
        ? progressResult[0].averageProgress
        : 0;


    // -------------------------------
    // FIELD REPORTS
    // -------------------------------

    const totalFieldReports =
      await FieldReport.countDocuments();


    // -------------------------------
    // COMPLAINTS
    // -------------------------------

    const totalComplaints =
      await Complaint.countDocuments();

    const pendingComplaints =
      await Complaint.countDocuments({
        status: {
          $in: [
            "Submitted",
            "Under Review",
            "In Progress"
          ]
        }
      });

    const resolvedComplaints =
      await Complaint.countDocuments({
        status: "Resolved"
      });


    // -------------------------------
    // VERIFICATIONS
    // -------------------------------

    const totalVerifications =
      await Verification.countDocuments();

    const pendingVerifications =
      await Verification.countDocuments({
        status: "Pending"
      });


    // -------------------------------
    // ALERTS
    // -------------------------------

    const openAlerts =
      await Alert.countDocuments({
        status: "Open"
      });

    const criticalAlerts =
      await Alert.countDocuments({
        status: "Open",
        severity: "Critical"
      });


    // -------------------------------
    // RESPONSE
    // -------------------------------

    res.json({
      success: true,

      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        delayedProjects,
        criticalProjects,

        totalBudget,

        averageProgress:
          Number(averageProgress.toFixed(2)),

        totalFieldReports,

        totalComplaints,
        pendingComplaints,
        resolvedComplaints,

        totalVerifications,
        pendingVerifications,

        openAlerts,
        criticalAlerts
      }
    });

  } catch (error) {

    console.error(
      "Dashboard statistics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    });
  }
};


// ==========================================
// PROJECT STATUS SUMMARY
// ==========================================

const getProjectStatusSummary = async (req, res) => {
  try {

    const summary = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1
          }
        }
      }
    ]);

    res.json({
      success: true,
      summary
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// PROJECT PROVINCE SUMMARY
// ==========================================

const getProvinceSummary = async (req, res) => {
  try {

    const summary = await Project.aggregate([
      {
        $group: {
          _id: "$province",
          count: {
            $sum: 1
          },
          totalBudget: {
            $sum: "$budget"
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    res.json({
      success: true,
      summary
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
};