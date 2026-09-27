import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProject,
  getProjectTimeline
} from "../services/api";

import ProjectTimeline from "../components/ProjectTimeline";
import ProjectProgressCard from "../components/ProjectProgressCard";

const h = React.createElement;

const ProjectDetails = () => {
  const {
    id
  } = useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [timeline, setTimeline] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ========================================
  // LOAD PROJECT
  // ========================================

  const loadProject = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        projectResponse,
        timelineResponse
      ] = await Promise.all([
        getProject(id),
        getProjectTimeline(id)
      ]);

      // ========================================
      // PROJECT RESPONSE
      // ========================================

      const projectData =
        projectResponse?.project ||
        projectResponse?.data ||
        projectResponse;

      setProject(projectData || null);

      // ========================================
      // TIMELINE RESPONSE
      // ========================================

      const timelineData =
        timelineResponse?.timeline ||
        timelineResponse?.data ||
        [];

      setTimeline(
        Array.isArray(timelineData)
          ? timelineData
          : []
      );

    } catch (err) {
      console.error(
        "Project details error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load project details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  // ========================================
  // HELPERS
  // ========================================

  const formatMoney = (value) => {
    const number =
      Number(value) || 0;

    return new Intl.NumberFormat(
      "en-NP",
      {
        maximumFractionDigits: 0
      }
    ).format(number);
  };

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const getProgress = () => {
    const value =
      Number(project?.progress);

    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, value)
    );
  };

  const getLatestReport = () => {
    if (!Array.isArray(timeline)) {
      return null;
    }

    const reports =
      timeline.filter((item) => {
        const title =
          String(
            item?.title ||
            item?.event ||
            ""
          ).toLowerCase();

        return (
          title.includes(
            "field report"
          ) ||
          item?.reportedProgress !==
            undefined ||
          item?.observation
        );
      });

    if (!reports.length) {
      return null;
    }

    return [...reports].sort(
      (a, b) => {
        const dateA =
          new Date(
            a?.date ||
            a?.createdAt ||
            0
          ).getTime();

        const dateB =
          new Date(
            b?.date ||
            b?.createdAt ||
            0
          ).getTime();

        return dateB - dateA;
      }
    )[0];
  };

  const latestReport =
    getLatestReport();

  const currentProgress =
    getProgress();

  const latestProgress =
    Number(
      latestReport?.reportedProgress ??
      latestReport?.progress
    );

  const hasLatestProgress =
    Number.isFinite(latestProgress);

  const progressDifference =
    hasLatestProgress
      ? currentProgress - latestProgress
      : 0;

  const getHealthText = () => {
    const status =
      String(
        project?.status || ""
      ).toLowerCase();

    const risk =
      String(
        project?.riskLevel ||
        project?.risk ||
        ""
      ).toLowerCase();

    if (
      currentProgress >= 100 ||
      status === "completed"
    ) {
      return "Project Completed";
    }

    if (
      risk === "critical" ||
      status === "critical"
    ) {
      return "Requires Immediate Attention";
    }

    if (
      risk === "high" ||
      status === "delayed"
    ) {
      return "Needs Monitoring";
    }

    return "Project Progressing";
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return h(
      "div",
      {
        className:
          "project-details-page"
      },
      h(
        "div",
        {
          className:
            "project-details-loading"
        },
        "Loading project details..."
      )
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return h(
      "div",
      {
        className:
          "project-details-page"
      },
      h(
        "div",
        {
          className:
            "project-details-error"
        },
        h(
          "h2",
          null,
          "Unable to Load Project"
        ),

        h(
          "p",
          null,
          error
        ),

        h(
          "div",
          {
            className:
              "project-details-error-actions"
          },

          h(
            "button",
            {
              type: "button",
              onClick: () =>
                loadProject()
            },
            "Try Again"
          ),

          h(
            "button",
            {
              type: "button",
              onClick: () =>
                navigate("/admin/projects")
            },
            "Back to Projects"
          )
        )
      )
    );
  }

  if (!project) {
    return h(
      "div",
      {
        className:
          "project-details-page"
      },
      h(
        "div",
        {
          className:
            "project-details-error"
        },
        h(
          "h2",
          null,
          "Project Not Found"
        ),

        h(
          "p",
          null,
          "The requested project could not be found."
        ),

        h(
          "button",
          {
            type: "button",
            onClick: () =>
              navigate("/admin/projects")
          },
          "Back to Projects"
        )
      )
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return h(
    "div",
    {
      className:
        "project-details-page"
    },

    // ========================================
    // HEADER
    // ========================================

    h(
      "div",
      {
        className:
          "project-details-header"
      },

      h(
        "div",
        {
          className:
            "project-details-header-left"
        },

        h(
          "button",
          {
            type: "button",
            className:
              "project-back-button",
            onClick: () =>
              navigate("/projects")
          },
          "← Back to Projects"
        ),

        h(
          "div",
          {
            className:
              "project-title-block"
          },

          h(
            "div",
            {
              className:
                "project-code"
            },
            project.projectCode ||
              "No Project Code"
          ),

          h(
            "h1",
            null,
            project.projectName ||
              project.name ||
              "Unnamed Project"
          ),

          h(
            "p",
            null,
            [
              project.municipality,
              project.district,
              project.province
            ]
              .filter(Boolean)
              .join(", ") ||
              "Location not available"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "project-details-header-actions"
        },

        h(
          "button",
          {
            type: "button",
            className:
              "project-refresh-button",
            disabled: refreshing,
            onClick: () =>
              loadProject(true)
          },
          refreshing
            ? "Refreshing..."
            : "↻ Refresh"
        ),

        h(
          "button",
          {
            type: "button",
            className:
              "project-edit-button",
            onClick: () =>
              navigate(
                `/projects/edit/${id}`
              )
          },
          "✎ Edit Project"
        )
      )
    ),

    // ========================================
    // STATUS / RISK
    // ========================================

    h(
      "div",
      {
        className:
          "project-details-status-row"
      },

      h(
        "span",
        {
          className:
            "project-status-pill"
        },
        project.status ||
          "Unknown Status"
      ),

      h(
        "span",
        {
          className:
            "project-risk-pill"
        },
        `Risk: ${
          project.riskLevel ||
          project.risk ||
          "Unknown"
        }`
      ),

      h(
        "span",
        {
          className:
            "project-health-pill"
        },
        getHealthText()
      )
    ),

    // ========================================
    // QUICK STATS
    // ========================================

    h(
      "div",
      {
        className:
          "project-details-quick-stats"
      },

      h(
        "div",
        {
          className:
            "project-quick-stat"
        },
        h(
          "span",
          null,
          "Budget"
        ),
        h(
          "strong",
          null,
          `NPR ${formatMoney(
            project.budget
          )}`
        )
      ),

      h(
        "div",
        {
          className:
            "project-quick-stat"
        },
        h(
          "span",
          null,
          "Current Progress"
        ),
        h(
          "strong",
          null,
          `${currentProgress}%`
        )
      ),

      h(
        "div",
        {
          className:
            "project-quick-stat"
        },
        h(
          "span",
          null,
          "Start Date"
        ),
        h(
          "strong",
          null,
          formatDate(
            project.startDate
          )
        )
      ),

      h(
        "div",
        {
          className:
            "project-quick-stat"
        },
        h(
          "span",
          null,
          "End Date"
        ),
        h(
          "strong",
          null,
          formatDate(
            project.endDate
          )
        )
      )
    ),

    // ========================================
    // PROGRESS CARD
    // ========================================

    h(
      ProjectProgressCard,
      {
        progress: project.progress,
        status: project.status,
        risk:
          project.riskLevel ||
          project.risk,
        budget: project.budget
      }
    ),

    // ========================================
    // LATEST FIELD REPORT
    // ========================================

    h(
      "section",
      {
        className:
          "project-latest-report-section"
      },

      h(
        "div",
        {
          className:
            "project-section-heading"
        },

        h(
          "div",
          null,
          h(
            "h2",
            null,
            "Latest Field Update"
          ),
          h(
            "p",
            null,
            "Most recent progress reported from the field."
          )
        )
      ),

      latestReport
        ? h(
            "div",
            {
              className:
                "project-latest-report-card"
            },

            h(
              "div",
              {
                className:
                  "latest-report-top"
              },

              h(
                "div",
                null,
                h(
                  "strong",
                  null,
                  latestReport.title ||
                    "Field Report Update"
                ),

                h(
                  "span",
                  null,
                  formatDate(
                    latestReport.date ||
                      latestReport.createdAt
                  )
                )
              ),

              hasLatestProgress
                ? h(
                    "div",
                    {
                      className:
                        "latest-report-progress"
                    },
                    `${latestProgress}%`
                  )
                : null
            ),

            latestReport.observation
              ? h(
                  "p",
                  {
                    className:
                      "latest-report-observation"
                  },
                  latestReport.observation
                )
              : null,

            latestReport.officer
              ? h(
                  "p",
                  {
                    className:
                      "latest-report-officer"
                  },
                  `Reported by: ${
                    latestReport.officer.name ||
                    latestReport.officer.fullName ||
                    latestReport.officer.email ||
                    "Field Officer"
                  }`
                )
              : null,

            latestReport.location
              ? h(
                  "p",
                  {
                    className:
                      "latest-report-location"
                  },
                  `Location: ${latestReport.location}`
                )
              : null
          )
        : h(
            "div",
            {
              className:
                "project-empty-report"
            },
            "No field report has been submitted for this project yet."
          )
    ),

    // ========================================
    // PROGRESS HISTORY
    // ========================================

    h(
      "section",
      {
        className:
          "project-progress-history-section"
      },

      h(
        "div",
        {
          className:
            "project-section-heading"
        },

        h(
          "div",
          null,
          h(
            "h2",
            null,
            "Progress History"
          ),

          h(
            "p",
            null,
            "Comparison between the latest field report and current project progress."
          )
        )
      ),

      h(
        "div",
        {
          className:
            "project-progress-history-grid"
        },

        h(
          "div",
          {
            className:
              "progress-history-item"
          },

          h(
            "span",
            null,
            "Current Project Progress"
          ),

          h(
            "strong",
            null,
            `${currentProgress}%`
          )
        ),

        h(
          "div",
          {
            className:
              "progress-history-item"
          },

          h(
            "span",
            null,
            "Latest Field Report"
          ),

          h(
            "strong",
            null,
            hasLatestProgress
              ? `${latestProgress}%`
              : "No Report"
          )
        ),

        h(
          "div",
          {
            className:
              "progress-history-item"
          },

          h(
            "span",
            null,
            "Difference"
          ),

          h(
            "strong",
            null,
            hasLatestProgress
              ? `${
                  progressDifference > 0
                    ? "+"
                    : ""
                }${progressDifference}%`
              : "N/A"
          )
        ),

        h(
          "div",
          {
            className:
              "progress-history-item"
          },

          h(
            "span",
            null,
            "Total Timeline Events"
          ),

          h(
            "strong",
            null,
            timeline.length
          )
        )
      )
    ),

    // ========================================
    // OVERVIEW
    // ========================================

    h(
      "section",
      {
        className:
          "project-details-section"
      },

      h(
        "h2",
        null,
        "Project Overview"
      ),

      h(
        "div",
        {
          className:
            "project-overview-grid"
        },

        h(
          "div",
          {
            className:
              "project-overview-item"
          },

          h(
            "span",
            null,
            "Project Code"
          ),

          h(
            "strong",
            null,
            project.projectCode ||
              "N/A"
          )
        ),

        h(
          "div",
          {
            className:
              "project-overview-item"
          },

          h(
            "span",
            null,
            "Contractor"
          ),

          h(
            "strong",
            null,
            project.contractor ||
              "N/A"
          )
        ),

        h(
          "div",
          {
            className:
              "project-overview-item"
          },

          h(
            "span",
            null,
            "Province"
          ),

          h(
            "strong",
            null,
            project.province ||
              "N/A"
          )
        ),

        h(
          "div",
          {
            className:
              "project-overview-item"
          },

          h(
            "span",
            null,
            "District"
          ),

          h(
            "strong",
            null,
            project.district ||
              "N/A"
          )
        ),

        h(
          "div",
          {
            className:
              "project-overview-item"
          },

          h(
            "span",
            null,
            "Municipality"
          ),

          h(
            "strong",
            null,
            project.municipality ||
              "N/A"
          )
        )
      )
    ),

    // ========================================
    // DESCRIPTION
    // ========================================

    h(
      "section",
      {
        className:
          "project-details-section"
      },

      h(
        "h2",
        null,
        "Description"
      ),

      h(
        "p",
        {
          className:
            "project-description"
        },
        project.description ||
          "No project description available."
      )
    ),

    // ========================================
    // LOCATION
    // ========================================

    h(
      "section",
      {
        className:
          "project-details-section"
      },

      h(
        "h2",
        null,
        "Location"
      ),

      h(
        "div",
        {
          className:
            "project-location-card"
        },

        h(
          "p",
          null,
          project.location ||
            [
              project.municipality,
              project.district,
              project.province
            ]
              .filter(Boolean)
              .join(", ") ||
            "Location not available"
        ),

        project.latitude !==
            undefined &&
        project.longitude !==
            undefined
          ? h(
              "p",
              {
                className:
                  "project-coordinates"
              },
              `Coordinates: ${
                project.latitude
              }, ${
                project.longitude
              }`
            )
          : null
      )
    ),

    // ========================================
    // TIMELINE
    // ========================================

    h(
      "section",
      {
        className:
          "project-details-section"
      },

      h(
        "div",
        {
          className:
            "project-section-heading"
        },

        h(
          "div",
          null,
          h(
            "h2",
            null,
            "Project Timeline"
          ),

          h(
            "p",
            null,
            "Project activity and field progress history."
          )
        )
      ),

      h(
        ProjectTimeline,
        {
          timeline
        }
      )
    )
  );
};

export default ProjectDetails;