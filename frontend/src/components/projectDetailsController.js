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
import ProjectStatusBadge from "../components/ProjectStatusBadge";
import ProjectRiskBadge from "../components/ProjectRiskBadge";
import ProjectProgressCard from "../components/ProjectProgressCard";
import ProgressHistory from "../components/ProgressHistory";

const h = React.createElement;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [timeline, setTimeline] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [timelineLoading, setTimelineLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD PROJECT
     ========================= */

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProject(id);

      const data =
        response?.project ||
        response?.data ||
        response;

      setProject(data);
    } catch (err) {
      console.error(
        "PROJECT LOAD ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD TIMELINE
     ========================= */

  const loadTimeline = async () => {
    try {
      setTimelineLoading(true);

      const response =
        await getProjectTimeline(id);

      const data =
        response?.timeline ||
        response?.data ||
        [];

      setTimeline(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "TIMELINE LOAD ERROR:",
        err
      );

      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
     ========================= */

  useEffect(() => {
    if (!id) return;

    loadProject();
    loadTimeline();
  }, [id]);

  /* =========================
     FORMAT MONEY
     ========================= */

  const formatMoney = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "N/A";
    }

    const number =
      Number(amount);

    if (Number.isNaN(number)) {
      return amount;
    }

    return `NPR ${number.toLocaleString(
      "en-IN"
    )}`;
  };

  /* =========================
     FORMAT DATE
     ========================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  };

  /* =========================
     PROJECT HELPERS
     ========================= */

  const getProjectName = () =>
    project?.name ||
    project?.projectName ||
    project?.title ||
    "Untitled Project";

  const getProjectCode = () =>
    project?.projectCode ||
    project?.code ||
    project?.projectId ||
    "N/A";

  const getProgress = () =>
    project?.progress ??
    project?.completionPercentage ??
    project?.reportedProgress ??
    0;

  const getStatus = () =>
    project?.status ||
    "Unknown";

  const getRisk = () =>
    project?.riskLevel ||
    project?.risk ||
    "Unknown";

  const getProvince = () =>
    project?.province ||
    "N/A";

  const getDistrict = () =>
    project?.district ||
    "N/A";

  const getMunicipality = () =>
    project?.municipality ||
    project?.localLevel ||
    "N/A";

  const getContractor = () =>
    project?.contractor ||
    project?.contractorName ||
    "N/A";

  const getBudget = () =>
    project?.budget ??
    project?.estimatedBudget ??
    project?.contractAmount;

  /* =========================
     PROGRESS HISTORY
     ========================= */

  const getProgressHistory = () => {
    if (
      Array.isArray(
        project?.progressHistory
      )
    ) {
      return project.progressHistory;
    }

    if (
      Array.isArray(timeline)
    ) {
      return timeline.filter(
        (item) =>
          item?.progress !== undefined ||
          item?.completionPercentage !== undefined ||
          item?.reportedProgress !== undefined
      );
    }

    return [];
  };

  /* =========================
     LATEST FIELD UPDATE
     ========================= */

  const getLatestFieldUpdate = () => {
    const history =
      getProgressHistory();

    if (!history.length) {
      return null;
    }

    return history[
      history.length - 1
    ];
  };

  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return h(
      "div",
      {
        className:
          "page-container project-details-page"
      },

      h(
        "div",
        {
          className:
            "page-loading"
        },

        "Loading project..."
      )
    );
  }

  /* =========================
     ERROR
     ========================= */

  if (error || !project) {
    return h(
      "div",
      {
        className:
          "page-container project-details-page"
      },

      h(
        "button",
        {
          className:
            "back-button",

          onClick: () =>
            navigate("/projects")
        },

        "← Back to Projects"
      ),

      h(
        "div",
        {
          className:
            "error-card"
        },

        error ||
          "Project not found."
      )
    );
  }

  const latestFieldUpdate =
    getLatestFieldUpdate();

  const currentProgress =
    Number(getProgress()) || 0;

  const latestProgress =
    latestFieldUpdate
      ? Number(
          latestFieldUpdate.progress ??
          latestFieldUpdate.reportedProgress ??
          latestFieldUpdate.completionPercentage ??
          0
        )
      : currentProgress;

  const progressDifference =
    latestProgress -
    currentProgress;

  /* =========================
     MAIN PAGE
     ========================= */

  return h(
    "div",
    {
      className:
        "page-container project-details-page"
    },

    /* =========================
       TOP BAR
       ========================= */

    h(
      "div",
      {
        className:
          "project-details-topbar"
      },

      h(
        "button",
        {
          className:
            "back-button",

          onClick: () =>
            navigate("/projects")
        },

        "← Back to Projects"
      ),

      h(
        "button",
        {
          className:
            "secondary-button",

          onClick: () => {
            loadProject();
            loadTimeline();
          }
        },

        "↻ Refresh"
      )
    ),

    /* =========================
       PROJECT HEADER
       ========================= */

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
            "project-header-main"
        },

        h(
          "div",
          {
            className:
              "project-code-label"
          },

          getProjectCode()
        ),

        h(
          "h1",
          null,

          getProjectName()
        ),

        h(
          "p",
          null,

          project.description ||
            "Government public infrastructure project."
        )
      ),

      h(
        "div",
        {
          className:
            "project-header-badges"
        },

        h(
          ProjectStatusBadge,
          {
            status:
              getStatus()
          }
        ),

        h(
          ProjectRiskBadge,
          {
            risk:
              getRisk()
          }
        )
      )
    ),

    /* =========================
       PROJECT PROGRESS CARD
       ========================= */

    h(
      "div",
      {
        className:
          "details-card project-progress-card"
      },

      h(
        "h2",
        null,

        "Project Progress"
      ),

      h(
        ProjectProgressCard,
        {
          progress:
            getProgress(),

          status:
            getStatus(),

          risk:
            getRisk(),

          budget:
            getBudget()
        }
      )
    ),

    /* =========================
       PROGRESS SUMMARY
       ========================= */

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
            "project-section-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Progress Summary"
          ),

          h(
            "p",
            null,

            "Current project progress and latest field update."
          )
        )
      ),

      h(
        "div",
        {
          className:
            "progress-summary-grid"
        },

        /* Current Progress */

        h(
          "div",
          {
            className:
              "progress-summary-card"
          },

          h(
            "span",
            {
              className:
                "progress-summary-label"
            },

            "Current Progress"
          ),

          h(
            "strong",
            {
              className:
                "progress-summary-number"
            },

            `${currentProgress}%`
          ),

          h(
            "div",
            {
              className:
                "progress-summary-mini-bar"
            },

            h(
              "div",
              {
                className:
                  "progress-summary-mini-fill",

                style: {
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      currentProgress
                    )
                  )}%`
                }
              }
            )
          )
        ),

        /* Latest Report */

        h(
          "div",
          {
            className:
              "progress-summary-card"
          },

          h(
            "span",
            {
              className:
                "progress-summary-label"
            },

            "Latest Report"
          ),

          h(
            "strong",
            {
              className:
                "progress-summary-number"
            },

            `${latestProgress}%`
          )
        ),

        /* Progress Change */

        h(
          "div",
          {
            className:
              "progress-summary-card"
          },

          h(
            "span",
            {
              className:
                "progress-summary-label"
            },

            "Progress Change"
          ),

          h(
            "strong",
            {
              className:
                progressDifference >= 0
                  ? "progress-change-positive"
                  : "progress-change-negative"
            },

            `${progressDifference > 0 ? "+" : ""}${progressDifference}%`
          )
        ),

        /* Field Reports */

        h(
          "div",
          {
            className:
              "progress-summary-card"
          },

          h(
            "span",
            {
              className:
                "progress-summary-label"
            },

            "Field Reports"
          ),

          h(
            "strong",
            {
              className:
                "progress-summary-number"
            },

            `${getProgressHistory().length}`
          )
        )
      )
    ),

    /* =========================
       LATEST FIELD UPDATE
       ========================= */

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
            "project-section-header"
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

      !latestFieldUpdate
        ? h(
            "div",
            {
              className:
                "latest-field-empty"
            },

            "No field report has been submitted yet."
          )
        : h(
            "div",
            {
              className:
                "latest-field-card"
            },

            h(
              "div",
              {
                className:
                  "latest-field-top"
              },

              h(
                "div",
                null,

                h(
                  "span",
                  {
                    className:
                      "latest-field-label"
                  },

                  latestFieldUpdate.reportNumber
                    ? `Field Report #${latestFieldUpdate.reportNumber}`
                    : "Latest Field Report"
                ),

                h(
                  "h3",
                  null,

                  `${latestProgress}% Project Progress`
                )
              ),

              h(
                "div",
                {
                  className:
                    "latest-field-progress"
                },

                `${latestProgress}%`
              )
            ),

            h(
              "div",
              {
                className:
                  "latest-field-details"
              },

              h(
                "div",
                null,

                h(
                  "span",
                  null,

                  "Officer"
                ),

                h(
                  "strong",
                  null,

                  latestFieldUpdate.officer?.fullName ||
                    latestFieldUpdate.officer?.name ||
                    latestFieldUpdate.officer?.email ||
                    "Field Officer"
                )
              ),

              h(
                "div",
                null,

                h(
                  "span",
                  null,

                  "Location"
                ),

                h(
                  "strong",
                  null,

                  latestFieldUpdate.location ||
                    "Not provided"
                )
              ),

              h(
                "div",
                null,

                h(
                  "span",
                  null,

                  "Updated"
                ),

                h(
                  "strong",
                  null,

                  formatDate(
                    latestFieldUpdate.date ||
                    latestFieldUpdate.createdAt
                  )
                )
              )
            ),

            latestFieldUpdate.observation
              ? h(
                  "div",
                  {
                    className:
                      "latest-field-observation"
                  },

                  h(
                    "strong",
                    null,

                    "Observation"
                  ),

                  h(
                    "p",
                    null,

                    latestFieldUpdate.observation
                  )
                )
              : null
          )
    ),

    /* =========================
       OVERVIEW GRID
       ========================= */

    h(
      "div",
      {
        className:
          "details-grid"
      },

      /* PROJECT OVERVIEW */

      h(
        "div",
        {
          className:
            "details-card"
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
              "details-list"
          },

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Project Code"
            ),

            h(
              "strong",
              null,

              getProjectCode()
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Status"
            ),

            h(
              ProjectStatusBadge,
              {
                status:
                  getStatus()
              }
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Risk"
            ),

            h(
              ProjectRiskBadge,
              {
                risk:
                  getRisk()
              }
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Budget"
            ),

            h(
              "strong",
              null,

              formatMoney(
                getBudget()
              )
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Contractor"
            ),

            h(
              "strong",
              null,

              getContractor()
            )
          )
        )
      ),

      /* LOCATION & SCHEDULE */

      h(
        "div",
        {
          className:
            "details-card"
        },

        h(
          "h2",
          null,

          "Location & Schedule"
        ),

        h(
          "div",
          {
            className:
              "details-list"
          },

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Province"
            ),

            h(
              "strong",
              null,

              getProvince()
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "District"
            ),

            h(
              "strong",
              null,

              getDistrict()
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
            },

            h(
              "span",
              null,

              "Municipality"
            ),

            h(
              "strong",
              null,

              getMunicipality()
            )
          ),

          h(
            "div",
            {
              className:
                "detail-row"
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
                "detail-row"
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
        )
      )
    ),

    /* =========================
       DESCRIPTION
       ========================= */

    h(
      "div",
      {
        className:
          "details-card"
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

    /* =========================
       PROGRESS HISTORY
       ========================= */

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
            "project-section-header"
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

            "Track project progress reported from the field."
          )
        )
      ),

      h(
        ProgressHistory,
        {
          history:
            getProgressHistory()
        }
      )
    ),

    /* =========================
       TIMELINE
       ========================= */

    h(
      "div",
      {
        className:
          "details-card timeline-card"
      },

      h(
        "div",
        {
          className:
            "section-heading"
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

            "Track important project updates and progress."
          )
        )
      ),

      timelineLoading
        ? h(
            "div",
            {
              className:
                "timeline-loading"
            },

            "Loading timeline..."
          )
        : h(
            ProjectTimeline,
            {
              timeline:
                timeline
            }
          )
    )
  );
};

export default ProjectDetails;