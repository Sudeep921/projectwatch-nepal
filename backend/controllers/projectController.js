const Project =
  require("../models/Project");

const FieldReport =
  require("../models/FieldReport");

const Alert =
  require("../models/Alert");

const {
  calculateRisk
} = require("../services/riskService");

const {
  generateProjectCode
} = require("../utils/projectCodeGenerator");


const validateProjectData = (
  data
) => {
  const errors = [];

  const name =
    String(
      data.name ||
      data.projectName ||
      ""
    ).trim();

  if (!name) {
    errors.push(
      "Project name is required."
    );
  }

  const budget =
    Number(data.budget);

  if (
    data.budget !== undefined &&
    (
      Number.isNaN(budget) ||
      budget < 0
    )
  ) {
    errors.push(
      "Budget must be a valid positive number."
    );
  }

  const progress =
    Number(data.progress ?? 0);

  if (
    Number.isNaN(progress) ||
    progress < 0 ||
    progress > 100
  ) {
    errors.push(
      "Progress must be between 0 and 100."
    );
  }

  if (
    data.latitude !== undefined &&
    data.latitude !== "" &&
    (
      Number.isNaN(
        Number(data.latitude)
      ) ||
      Number(data.latitude) < -90 ||
      Number(data.latitude) > 90
    )
  ) {
    errors.push(
      "Invalid latitude."
    );
  }

  if (
    data.longitude !== undefined &&
    data.longitude !== "" &&
    (
      Number.isNaN(
        Number(data.longitude)
      ) ||
      Number(data.longitude) < -180 ||
      Number(data.longitude) > 180
    )
  ) {
    errors.push(
      "Invalid longitude."
    );
  }

  return errors;
};


// ==========================================
// CREATE PROJECT
// ==========================================

const createProject =
  async (req, res) => {
    try {

      const projectData = {
        ...req.body
      };


      // ======================================
      // PROJECT CODE
      // ======================================

      if (
        !projectData.projectCode
      ) {
        projectData.projectCode =
          await generateProjectCode();
      }


      // ======================================
      // PROJECT NAME
      // ======================================

      if (
        !projectData.projectName &&
        projectData.name
      ) {
        projectData.projectName =
          projectData.name;
      }


      // ======================================
      // NUMBER CONVERSION
      // ======================================

      if (
        projectData.budget !==
        undefined
      ) {
        projectData.budget =
          Number(
            projectData.budget
          );
      }


      if (
        projectData.progress !==
        undefined
      ) {
        projectData.progress =
          Number(
            projectData.progress
          );
      }


      // ======================================
      // LATITUDE
      // ======================================

      if (
        projectData.latitude !==
          undefined &&
        projectData.latitude !==
          null &&
        projectData.latitude !==
          ""
      ) {
        projectData.latitude =
          Number(
            projectData.latitude
          );
      } else {
        projectData.latitude =
          null;
      }


      // ======================================
      // LONGITUDE
      // ======================================

      if (
        projectData.longitude !==
          undefined &&
        projectData.longitude !==
          null &&
        projectData.longitude !==
          ""
      ) {
        projectData.longitude =
          Number(
            projectData.longitude
          );
      } else {
        projectData.longitude =
          null;
      }


      // ======================================
      // RISK CALCULATION
      // ======================================

      const calculatedRisk =
        calculateRisk(
          projectData
        );

      projectData.riskLevel =
        calculatedRisk;


      // ======================================
      // CREATE PROJECT
      // ======================================

      const project =
        await Project.create(
          projectData
        );


      // ======================================
      // HIGH / CRITICAL ALERT
      // ======================================

      if (
        calculatedRisk ===
          "High" ||
        calculatedRisk ===
          "Critical"
      ) {

        await Alert.create({

          project:
            project._id,

          title:
            `${calculatedRisk} Project Risk`,

          message:
            `${project.projectName} has been classified as ${calculatedRisk} risk.`,

          type:
            "Critical Risk",

          severity:
            calculatedRisk
        });
      }


      // ======================================
      // RESPONSE
      // ======================================

      res.status(201).json({

        success: true,

        message:
          "Project created successfully",

        project
      });

    } catch (error) {

      console.error(
        "Create project error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };


// ==========================================
// GET ALL PROJECTS
// ==========================================

const getProjects =
  async (req, res) => {
    try {

      const projects =
        await Project.find()
          .populate(
            "assignedOfficer",
            "-password"
          )
          .sort({
            createdAt: -1
          });


      res.json({

        success: true,

        count:
          projects.length,

        projects
      });

    } catch (error) {

      console.error(
        "Get projects error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };


// ==========================================
// GET SINGLE PROJECT
// ==========================================

const getProject =
  async (req, res) => {
    try {

      const project =
        await Project.findById(
          req.params.id
        )
          .populate(
            "assignedOfficer",
            "-password"
          );


      if (!project) {

        return res.status(404).json({

          success: false,

          message:
            "Project not found"
        });
      }


      res.json({

        success: true,

        project
      });

    } catch (error) {

      console.error(
        "Get project error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };


// ==========================================
// UPDATE PROJECT
// ==========================================

const updateProject =
  async (req, res) => {
    try {

      const oldProject =
        await Project.findById(
          req.params.id
        );


      if (!oldProject) {

        return res.status(404).json({

          success: false,

          message:
            "Project not found"
        });
      }


      // ======================================
      // MERGE OLD + NEW DATA
      // ======================================

      const updatedData = {

        ...oldProject.toObject(),

        ...req.body
      };


      // ======================================
      // FRONTEND NAME SUPPORT
      // ======================================

      if (
        !updatedData.projectName &&
        updatedData.name
      ) {

        updatedData.projectName =
          updatedData.name;
      }


      // ======================================
      // REMOVE MONGOOSE INTERNAL FIELDS
      // ======================================

      delete updatedData._id;

      delete updatedData.__v;

      delete updatedData.createdAt;

      delete updatedData.updatedAt;


      // ======================================
      // NUMBER CONVERSION
      // ======================================

      if (
        updatedData.budget !==
        undefined
      ) {

        updatedData.budget =
          Number(
            updatedData.budget
          );
      }


      if (
        updatedData.progress !==
        undefined
      ) {

        updatedData.progress =
          Number(
            updatedData.progress
          );
      }


      // ======================================
      // LATITUDE
      // ======================================

      if (
        updatedData.latitude !==
          undefined &&
        updatedData.latitude !==
          null &&
        updatedData.latitude !==
          ""
      ) {

        updatedData.latitude =
          Number(
            updatedData.latitude
          );

      } else {

        updatedData.latitude =
          null;
      }


      // ======================================
      // LONGITUDE
      // ======================================

      if (
        updatedData.longitude !==
          undefined &&
        updatedData.longitude !==
          null &&
        updatedData.longitude !==
          ""
      ) {

        updatedData.longitude =
          Number(
            updatedData.longitude
          );

      } else {

        updatedData.longitude =
          null;
      }


      // ======================================
      // RECALCULATE RISK
      // ======================================

      updatedData.riskLevel =
        calculateRisk(
          updatedData
        );


      // ======================================
      // UPDATE DATABASE
      // ======================================

      const project =
        await Project.findByIdAndUpdate(

          req.params.id,

          updatedData,

          {
            new: true,

            runValidators: true
          }

        ).populate(
          "assignedOfficer",
          "-password"
        );


      // ======================================
      // HIGH / CRITICAL ALERT
      // ======================================

      if (
        project.riskLevel ===
          "High" ||
        project.riskLevel ===
          "Critical"
      ) {

        await Alert.create({

          project:
            project._id,

          title:
            `${project.riskLevel} Project Risk`,

          message:
            `${project.projectName} is currently classified as ${project.riskLevel} risk.`,

          type:
            "Critical Risk",

          severity:
            project.riskLevel
        });
      }


      // ======================================
      // RESPONSE
      // ======================================

      res.json({

        success: true,

        message:
          "Project updated successfully",

        project
      });

    } catch (error) {

      console.error(
        "Update project error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };


// ==========================================
// DELETE PROJECT
// ==========================================

const deleteProject =
  async (req, res) => {
    try {

      const project =
        await Project.findByIdAndDelete(
          req.params.id
        );


      if (!project) {

        return res.status(404).json({

          success: false,

          message:
            "Project not found"
        });
      }


      // ======================================
      // DELETE RELATED ALERTS
      // ======================================

      await Alert.deleteMany({

        project:
          project._id
      });


      // ======================================
      // DELETE RELATED FIELD REPORTS
      // ======================================

      await FieldReport.deleteMany({

        project:
          project._id
      });


      res.json({

        success: true,

        message:
          "Project deleted successfully"
      });

    } catch (error) {

      console.error(
        "Delete project error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };


// ==========================================
// SEARCH / FILTER PROJECTS
// ==========================================

const searchProjects =
  async (req, res) => {
    try {

      const {
        search,
        province,
        status,
        risk
      } = req.query;


      const filter = {};


      // ======================================
      // SEARCH
      // ======================================

      if (search) {

        filter.$or = [

          {
            projectName: {

              $regex:
                search,

              $options:
                "i"
            }
          },

          {
            projectCode: {

              $regex:
                search,

              $options:
                "i"
            }
          }

        ];
      }


      // ======================================
      // PROVINCE
      // ======================================

      if (
        province &&
        province !==
          "All Provinces"
      ) {

        filter.province =
          province;
      }


      // ======================================
      // STATUS
      // ======================================

      if (
        status &&
        status !==
          "All Status"
      ) {

        filter.status =
          status;
      }


      // ======================================
      // RISK
      // ======================================

      if (
        risk &&
        risk !==
          "All Risk"
      ) {

        filter.riskLevel =
          risk;
      }


      // ======================================
      // FIND PROJECTS
      // ======================================

      const projects =
        await Project.find(
          filter
        )
          .populate(
            "assignedOfficer",
            "-password"
          )
          .sort({
            createdAt: -1
          });


      res.json({

        success: true,

        count:
          projects.length,

        projects
      });

    } catch (error) {

      console.error(
        "Search projects error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to search projects",

        error:
          error.message
      });
    }
  };


// ==========================================
// PUBLIC PROJECTS
// ==========================================

const getPublicProjects =
  async (req, res) => {
    try {

      const projects =
        await Project.find({

          isPublished:
            true

        })
          .select(
            "projectName projectCode province district municipality contractor budget progress status riskLevel description location latitude longitude startDate endDate"
          )
          .sort({
            createdAt: -1
          });


      res.json({

        success: true,

        count:
          projects.length,

        projects
      });

    } catch (error) {

      console.error(
        "Public projects error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to load public projects",

        error:
          error.message
      });
    }
  };


// ==========================================
// PROJECT TIMELINE
// ==========================================

const getProjectTimeline =
  async (req, res) => {
    try {

      const projectId =
        req.params.id;


      // ======================================
      // FIND PROJECT
      // ======================================

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


      // ======================================
      // GET FIELD REPORTS
      // ======================================

      const fieldReports =
        await FieldReport.find({

          project:
            projectId

        })
          .populate(
            "officer",
            "name fullName email role"
          )
          .sort({

            createdAt: 1
          });


      // ======================================
      // TIMELINE
      // ======================================

      const timeline = [];


      // ======================================
      // PROJECT START
      // ======================================

      timeline.push({

        _id:
          "project-start-" +
          project._id,

        type:
          "project",

        title:
          "Project Started",

        description:
          project.description ||
          "Project was created successfully.",

        status:
          project.status ||
          "Active",

        progress:
          0,

        date:
          project.startDate ||
          project.createdAt,

        project: {

          _id:
            project._id,

          projectName:
            project.projectName,

          projectCode:
            project.projectCode
        }
      });


      // ======================================
      // FIELD REPORT UPDATES
      // ======================================

      fieldReports.forEach(
        (report, index) => {

          const reportProgress =
            Number(
              report.reportedProgress
            ) || 0;


          timeline.push({

            _id:
              report._id,

            reportId:
              report._id,

            type:
              "field-report",

            title:
              `Field Report #${
                index + 1
              }`,

            description:
              report.observation ||
              "Field report submitted.",

            observation:
              report.observation ||
              "",

            progress:
              reportProgress,

            reportedProgress:
              reportProgress,

            status:
              reportProgress >= 100
                ? "Completed"
                : (
                    report.status ||
                    "Active"
                  ),

            date:
              report.createdAt,

            officer:
              report.officer
                ? {

                    _id:
                      report.officer._id,

                    name:
                      report.officer.name ||
                      report.officer.fullName ||
                      "",

                    fullName:
                      report.officer.fullName ||
                      "",

                    email:
                      report.officer.email ||
                      "",

                    role:
                      report.officer.role ||
                      ""

                  }
                : null,

            location:
              report.location ||
              "",

            latitude:
              report.latitude ??
              null,

            longitude:
              report.longitude ??
              null
          });
        }
      );


      // ======================================
      // PROJECT COMPLETED
      // ======================================

      if (
        Number(
          project.progress
        ) >= 100
      ) {

        const hasCompletedReport =
          fieldReports.some(
            (report) =>
              Number(
                report.reportedProgress
              ) >= 100
          );


        if (!hasCompletedReport) {

          timeline.push({

            _id:
              "project-completed-" +
              project._id,

            type:
              "completed",

            title:
              "Project Completed",

            description:
              "Project has reached 100% progress.",

            status:
              "Completed",

            progress:
              100,

            reportedProgress:
              100,

            date:
              project.updatedAt ||
              project.createdAt
          });
        }
      }


      // ======================================
      // SORT TIMELINE
      // ======================================

      timeline.sort(
        (a, b) => {

          const dateA =
            a.date
              ? new Date(
                  a.date
                ).getTime()
              : 0;

          const dateB =
            b.date
              ? new Date(
                  b.date
                ).getTime()
              : 0;

          return (
            dateA -
            dateB
          );
        }
      );


      // ======================================
      // PROGRESS HISTORY
      // ======================================

      const progressHistory =
        fieldReports.map(
          (report, index) => {

            const progress =
              Number(
                report.reportedProgress
              ) || 0;


            return {

              reportNumber:
                index + 1,

              reportId:
                report._id,

              progress,

              reportedProgress:
                progress,

              observation:
                report.observation ||
                "",

              date:
                report.createdAt,

              officer:
                report.officer
                  ? {

                      _id:
                        report.officer._id,

                      name:
                        report.officer.name ||
                        report.officer.fullName ||
                        "",

                      email:
                        report.officer.email ||
                        "",

                      role:
                        report.officer.role ||
                        ""

                    }
                  : null,

              location:
                report.location ||
                "",

              latitude:
                report.latitude ??
                null,

              longitude:
                report.longitude ??
                null
            };
          }
        );


      // ======================================
      // LATEST REPORT
      // ======================================

      const latestReport =
        fieldReports.length
          ? fieldReports[
              fieldReports.length - 1
            ]
          : null;


      const latestReportedProgress =
        latestReport
          ? Number(
              latestReport.reportedProgress
            ) || 0
          : null;


      // ======================================
      // PROGRESS DIFFERENCE
      // ======================================

      const currentProgress =
        Number(
          project.progress
        ) || 0;


      const progressDifference =
        latestReportedProgress !==
          null
          ? currentProgress -
            latestReportedProgress
          : null;


      // ======================================
      // RESPONSE
      // ======================================

      res.json({

        success: true,

        count:
          timeline.length,

        timeline,

        progressHistory,

        summary: {

          currentProgress,

          totalFieldReports:
            fieldReports.length,

          latestReportedProgress,

          progressDifference,

          isCompleted:
            currentProgress >= 100,

          status:
            project.status ||
            "Active",

          riskLevel:
            project.riskLevel ||
            null
        }
      });

    } catch (error) {

      console.error(
        "Get project timeline error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message ||
          "Unable to fetch project timeline"
      });
    }
  };


// ==========================================
// GENERATE PROJECT CODE
// ==========================================

const generateCode =
  async (req, res) => {
    try {

      const code =
        await generateProjectCode();


      res.json({

        success: true,

        code
      });

    } catch (error) {

      console.error(
        "Generate project code error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to generate project code",

        error:
          error.message
      });
    }
  };


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

  createProject,

  getProjects,

  getProject,

  updateProject,

  deleteProject,

  searchProjects,

  getPublicProjects,

  getProjectTimeline,

  generateCode
};