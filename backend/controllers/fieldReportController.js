const FieldReport = require("../models/FieldReport");
const Project = require("../models/Project");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");

const calculateRisk = require("../utils/calculateRisk");


// =====================================================
// HELPER: NORMALIZE PROGRESS
// =====================================================

const normalizeProgress = (value) => {
  const progress = Number(value);

  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, progress)
  );
};


// =====================================================
// HELPER: CALCULATE PROJECT STATUS
// =====================================================

const calculateProjectStatus = (
  progress
) => {
  if (progress >= 100) {
    return "Completed";
  }

  return "Active";
};


// =====================================================
// HELPER: CALCULATE PROJECT RISK
// =====================================================

const calculateProjectRisk = (
  project
) => {
  try {
    const risk =
      calculateRisk(project);

    if (risk) {
      return risk;
    }
  } catch (error) {
    console.log(
      "Risk calculation skipped:",
      error.message
    );
  }

  return (
    project.riskLevel ||
    "Low"
  );
};


// =====================================================
// HELPER: CREATE CRITICAL ALERT
// =====================================================

const createCriticalRiskAlert = async (
  project
) => {
  try {
    if (
      project.riskLevel !==
      "Critical"
    ) {
      return null;
    }

    const existingAlert =
      await Alert.findOne({
        project: project._id,

        type: "Critical Risk",

        status: "Open"
      });

    if (existingAlert) {
      return existingAlert;
    }

    const alert =
      await Alert.create({

        project:
          project._id,

        type:
          "Critical Risk",

        title:
          "Critical Project Risk",

        message:
          `${project.projectName} (${project.projectCode}) has reached Critical risk level.`,

        severity:
          "Critical",

        status:
          "Open"

      });

    console.log(
      "Critical risk alert created:",
      alert._id
    );

    return alert;

  } catch (error) {

    console.error(
      "Critical alert creation error:",
      error.message
    );

    return null;
  }
};


// =====================================================
// HELPER: CREATE COMPLETION NOTIFICATION
// =====================================================

const createCompletionNotification =
  async (
    project
  ) => {

    try {

      const notification =
        await Notification.create({

          title:
            "Project Completed",

          message:
            `${project.projectName} (${project.projectCode}) has reached 100% completion.`,

          type:
            "Success",

          read:
            false,

          project:
            project._id

        });

      console.log(
        "Completion notification created:",
        notification._id
      );

      return notification;

    } catch (error) {

      console.error(
        "Completion notification error:",
        error.message
      );

      return null;
    }
  };


// =====================================================
// GET ALL FIELD REPORTS
// =====================================================

const getFieldReports = async (
  req,
  res
) => {

  try {

    const reports =
      await FieldReport.find()

        .populate(
          "project",
          "projectName projectCode province district municipality progress status riskLevel"
        )

        .populate(
          "officer",
          "name fullName email role"
        )

        .sort({
          createdAt: -1
        });


    return res.status(200).json({

      success: true,

      count:
        reports.length,

      reports

    });

  } catch (error) {

    console.error(
      "Get field reports error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch field reports",

      error:
        error.message

    });
  }
};


// =====================================================
// GET SINGLE FIELD REPORT
// =====================================================

const getFieldReport = async (
  req,
  res
) => {

  try {

    const report =
      await FieldReport.findById(
        req.params.id
      )

        .populate(
          "project",
          "projectName projectCode province district municipality progress status riskLevel"
        )

        .populate(
          "officer",
          "name fullName email role"
        );


    if (!report) {

      return res.status(404).json({

        success: false,

        message:
          "Field report not found"

      });
    }


    return res.status(200).json({

      success: true,

      report

    });

  } catch (error) {

    console.error(
      "Get field report error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch field report",

      error:
        error.message

    });
  }
};


// =====================================================
// CREATE FIELD REPORT
// =====================================================

const createFieldReport = async (
  req,
  res
) => {

  try {

    const {

      project,

      reportedProgress,

      observation,

      location,

      latitude,

      longitude,

      status

    } = req.body;


    // -------------------------------------------------
    // VALIDATE PROJECT
    // -------------------------------------------------

    if (!project) {

      return res.status(400).json({

        success: false,

        message:
          "Project is required"

      });
    }


    const existingProject =
      await Project.findById(
        project
      );


    if (!existingProject) {

      return res.status(404).json({

        success: false,

        message:
          "Project not found"

      });
    }


    // -------------------------------------------------
    // VALIDATE PROGRESS
    // -------------------------------------------------

    if (
      reportedProgress ===
        undefined ||

      reportedProgress ===
        null ||

      reportedProgress ===
        ""
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Reported progress is required"

      });
    }


    if (
      Number(reportedProgress) <
        0 ||

      Number(reportedProgress) >
        100
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Progress must be between 0 and 100"

      });
    }


    const progress =
      normalizeProgress(
        reportedProgress
      );


    // -------------------------------------------------
    // SAVE PREVIOUS PROJECT STATE
    // -------------------------------------------------

    const previousProgress =
      normalizeProgress(
        existingProject.progress
      );

    const previousRisk =
      existingProject.riskLevel ||
      "Low";


    // -------------------------------------------------
    // CREATE FIELD REPORT
    // -------------------------------------------------

    const reportData = {

      project,

      reportedProgress:
        progress,

      observation:
        observation || "",

      location:
        location || "",

      status:
        status ||
        (
          progress >= 100
            ? "Completed"
            : "Active"
        )

    };


    // -------------------------------------------------
    // OPTIONAL LOCATION
    // -------------------------------------------------

    if (
      latitude !==
        undefined &&

      latitude !==
        null &&

      latitude !==
        ""
    ) {

      reportData.latitude =
        Number(latitude);

    }


    if (
      longitude !==
        undefined &&

      longitude !==
        null &&

      longitude !==
        ""
    ) {

      reportData.longitude =
        Number(longitude);

    }


    // -------------------------------------------------
    // OFFICER
    // -------------------------------------------------

    if (
      req.user &&
      req.user._id
    ) {

      reportData.officer =
        req.user._id;

    }


    const report =
      await FieldReport.create(
        reportData
      );


    // -------------------------------------------------
    // UPDATE PROJECT PROGRESS
    // -------------------------------------------------

    existingProject.progress =
      progress;


    // -------------------------------------------------
    // UPDATE PROJECT STATUS
    // -------------------------------------------------

    existingProject.status =
      calculateProjectStatus(
        progress
      );


    // -------------------------------------------------
    // UPDATE PROJECT RISK
    // -------------------------------------------------

    existingProject.riskLevel =
      calculateProjectRisk(
        existingProject
      );


    await existingProject.save();


    // =================================================
    // AUTOMATIC CRITICAL ALERT
    // =================================================

    if (
      existingProject.riskLevel ===
      "Critical"
    ) {

      await createCriticalRiskAlert(
        existingProject
      );

    }


    // =================================================
    // AUTOMATIC COMPLETION NOTIFICATION
    // =================================================

    if (
      previousProgress <
        100 &&

      progress >=
        100
    ) {

      await createCompletionNotification(
        existingProject
      );

    }


    // -------------------------------------------------
    // POPULATE RESPONSE
    // -------------------------------------------------

    const populatedReport =
      await FieldReport.findById(
        report._id
      )

        .populate(
          "project",
          "projectName projectCode province district municipality progress status riskLevel"
        )

        .populate(
          "officer",
          "name fullName email role"
        );


    return res.status(201).json({

      success: true,

      message:
        "Field report created successfully",

      report:
        populatedReport,

      project: {

        id:
          existingProject._id,

        projectName:
          existingProject.projectName,

        projectCode:
          existingProject.projectCode,

        progress:
          existingProject.progress,

        status:
          existingProject.status,

        riskLevel:
          existingProject.riskLevel

      }

    });

  } catch (error) {

    console.error(
      "Create field report error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create field report",

      error:
        error.message

    });
  }
};


// =====================================================
// UPDATE FIELD REPORT
// =====================================================

const updateFieldReport = async (
  req,
  res
) => {

  try {

    const report =
      await FieldReport.findById(
        req.params.id
      );


    if (!report) {

      return res.status(404).json({

        success: false,

        message:
          "Field report not found"

      });
    }


    // -------------------------------------------------
    // PROJECT
    // -------------------------------------------------

    const projectId =
      req.body.project ||
      report.project;


    const project =
      await Project.findById(
        projectId
      );


    if (!project) {

      return res.status(404).json({

        success: false,

        message:
          "Project not found"

      });
    }


    // -------------------------------------------------
    // PREVIOUS PROJECT STATE
    // -------------------------------------------------

    const previousProgress =
      normalizeProgress(
        project.progress
      );


    // -------------------------------------------------
    // UPDATE BASIC FIELDS
    // -------------------------------------------------

    if (
      req.body.observation !==
      undefined
    ) {

      report.observation =
        req.body.observation;

    }


    if (
      req.body.location !==
      undefined
    ) {

      report.location =
        req.body.location;

    }


    if (
      req.body.status !==
      undefined
    ) {

      report.status =
        req.body.status;

    }


    if (
      req.body.latitude !==
      undefined
    ) {

      report.latitude =
        Number(
          req.body.latitude
        );

    }


    if (
      req.body.longitude !==
      undefined
    ) {

      report.longitude =
        Number(
          req.body.longitude
        );

    }


    // -------------------------------------------------
    // UPDATE PROJECT REFERENCE
    // -------------------------------------------------

    report.project =
      project._id;


    // -------------------------------------------------
    // UPDATE PROGRESS
    // -------------------------------------------------

    if (
      req.body.reportedProgress !==
      undefined
    ) {

      if (
        Number(
          req.body.reportedProgress
        ) < 0 ||

        Number(
          req.body.reportedProgress
        ) > 100
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Progress must be between 0 and 100"

        });
      }


      const progress =
        normalizeProgress(
          req.body.reportedProgress
        );


      report.reportedProgress =
        progress;


      project.progress =
        progress;


      project.status =
        calculateProjectStatus(
          progress
        );


      project.riskLevel =
        calculateProjectRisk(
          project
        );

    }


    // -------------------------------------------------
    // AUTO STATUS
    // -------------------------------------------------

    if (
      report.reportedProgress >=
      100
    ) {

      report.status =
        "Completed";

    }


    await report.save();

    await project.save();


    // =================================================
    // AUTOMATIC CRITICAL ALERT
    // =================================================

    if (
      project.riskLevel ===
      "Critical"
    ) {

      await createCriticalRiskAlert(
        project
      );

    }


    // =================================================
    // AUTOMATIC COMPLETION NOTIFICATION
    // =================================================

    if (
      previousProgress <
        100 &&

      project.progress >=
        100
    ) {

      await createCompletionNotification(
        project
      );

    }


    // -------------------------------------------------
    // POPULATED RESPONSE
    // -------------------------------------------------

    const updatedReport =
      await FieldReport.findById(
        report._id
      )

        .populate(
          "project",
          "projectName projectCode province district municipality progress status riskLevel"
        )

        .populate(
          "officer",
          "name fullName email role"
        );


    return res.status(200).json({

      success: true,

      message:
        "Field report updated successfully",

      report:
        updatedReport,

      project: {

        id:
          project._id,

        projectName:
          project.projectName,

        projectCode:
          project.projectCode,

        progress:
          project.progress,

        status:
          project.status,

        riskLevel:
          project.riskLevel

      }

    });

  } catch (error) {

    console.error(
      "Update field report error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to update field report",

      error:
        error.message

    });
  }
};


// =====================================================
// DELETE FIELD REPORT
// =====================================================

const deleteFieldReport = async (
  req,
  res
) => {

  try {

    const report =
      await FieldReport.findById(
        req.params.id
      );


    if (!report) {

      return res.status(404).json({

        success: false,

        message:
          "Field report not found"

      });
    }


    const projectId =
      report.project;


    await FieldReport.findByIdAndDelete(
      req.params.id
    );


    // -------------------------------------------------
    // RECALCULATE PROJECT
    // -------------------------------------------------

    const project =
      await Project.findById(
        projectId
      );


    if (project) {

      const latestReport =
        await FieldReport.findOne({

          project:
            projectId

        }).sort({

          createdAt:
            -1

        });


      if (latestReport) {

        const progress =
          normalizeProgress(
            latestReport.reportedProgress
          );


        project.progress =
          progress;


        project.status =
          calculateProjectStatus(
            progress
          );


        project.riskLevel =
          calculateProjectRisk(
            project
          );

      } else {

        // ---------------------------------------------
        // NO REPORTS REMAINING
        // ---------------------------------------------

        project.progress =
          0;

        project.status =
          "Active";

        project.riskLevel =
          calculateProjectRisk(
            project
          );

      }


      await project.save();


      // =================================================
      // CRITICAL ALERT AFTER RECALCULATION
      // =================================================

      if (
        project.riskLevel ===
        "Critical"
      ) {

        await createCriticalRiskAlert(
          project
        );

      }

    }


    return res.status(200).json({

      success: true,

      message:
        "Field report deleted successfully",

      project:

        project

          ? {

              id:
                project._id,

              projectName:
                project.projectName,

              projectCode:
                project.projectCode,

              progress:
                project.progress,

              status:
                project.status,

              riskLevel:
                project.riskLevel

            }

          : null

    });

  } catch (error) {

    console.error(
      "Delete field report error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete field report",

      error:
        error.message

    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  getFieldReports,

  getFieldReport,

  createFieldReport,

  updateFieldReport,

  deleteFieldReport

};