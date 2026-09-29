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
  const {
    id
  } = useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [timeline, setTimeline] =
    useState([]);

  const [progressHistory, setProgressHistory] =
    useState([]);

  const [timelineSummary, setTimelineSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [timelineLoading, setTimelineLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

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

      setProject(data || null);
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

      setProgressHistory(
        Array.isArray(
          response?.progressHistory
        )
          ? response.progressHistory
          : []
      );

      setTimelineSummary(
        response?.summary ||
        null
      );
    } catch (err) {
      console.error(
        "TIMELINE LOAD ERROR:",
        err
      );

      setTimeline([]);
      setProgressHistory([]);
      setTimelineSummary(null);
    } finally {
      setTimelineLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        loadProject(),
        loadTimeline()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    loadProject();
    loadTimeline();
  }, [id]);

  if (loading) {
    return h(
      "div",
      {
        className:
          "project-details-loading"
      },
      h(
        "div",
        {
          className:
            "project-details-loading-icon"
        },
        "⏳"
      ),
      h(
        "h3",
        null,
        "Loading Project..."
      ),
      h(
        "p",
        null,
        "Please wait while project details are loading."
      )
    );
  }

  if (error || !project) {
    return h(
      "div",
      {
        className:
          "project-details-error"
      },

      h(
        "div",
        {
          className:
            "project-details-error-icon"
        },
        "⚠️"
      ),

      h(
        "h2",
        null,
        "Unable to Load Project"
      ),

      h(
        "p",
        null,
        error ||
          "Project information could not be found."
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
            className:
              "project-btn-secondary",
            onClick: loadProject
          },
          "↻ Try Again"
        ),

        h(
          "button",
          {
            className:
              "project-btn-primary",
            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },
          "← Back to Projects"
        )
      )
    );
  }

  const currentProgress =
    Number(
      project.progress ??
      timelineSummary?.currentProgress ??
      0
    );

  const budget =
    Number(project.budget || 0);

  const formatMoney = (value) => {
    if (!Number.isFinite(value)) {
      return "NPR 0";
    }

    return `NPR ${value.toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(
        value
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );
    } catch {
      return "—";
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";

    try {
      return new Date(
        value
      ).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );
    } catch {
      return "—";
    }
  };

  const locationText =
    [
      project.municipality,
      project.district,
      project.province
    ]
      .filter(Boolean)
      .join(", ") ||
    project.location ||
    "Location not specified";

  return h(
    "div",
    {
      className:
        "project-details-page"
    },

    /* HEADER */

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
            className:
              "project-back-btn",
            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },
          "← Back to Projects"
        ),

        h(
          "div",
          {
            className:
              "project-details-title-wrap"
          },

          h(
            "div",
            {
              className:
                "project-details-code"
            },
            project.projectCode ||
              "PROJECT"
          ),

          h(
            "h1",
            null,
            project.name ||
              project.projectName ||
              "Untitled Project"
          ),

          h(
            "p",
            null,
            locationText
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
            className:
              "project-btn-secondary",
            onClick: refreshAll,
            disabled: refreshing
          },
          refreshing
            ? "Refreshing..."
            : "↻ Refresh"
        ),

        h(
          "button",
          {
            className:
              "project-btn-primary",
            onClick: () =>
              navigate(
                `/admin/projects/${id}/edit`
              )
          },
          "✎ Edit Project"
        )
      )
    ),

    /* STATUS */

    h(
      "div",
      {
        className:
          "project-details-status-row"
      },

      h(
        "div",
        {
          className:
            "project-status-group"
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
              project.status ||
              "Active"
          }
        )
      ),

      h(
        "div",
        {
          className:
            "project-status-group"
        },

        h(
          "span",
          null,
          "Risk"
        ),

        h(
          ProjectRiskBadge,
          {
            riskLevel:
              project.riskLevel ||
              "Low"
          }
        )
      ),

      h(
        "div",
        {
          className:
            "project-last-updated"
        },

        h(
          "span",
          null,
          "Last Updated"
        ),

        h(
          "strong",
          null,
          formatDateTime(
            project.updatedAt ||
            project.createdAt
          )
        )
      )
    ),

    /* OVERVIEW CARDS */

    h(
      "div",
      {
        className:
          "project-details-info-grid"
      },

      h(
        "div",
        {
          className:
            "project-info-card"
        },

        h(
          "div",
          {
            className:
              "project-info-icon"
          },
          "💰"
        ),

        h(
          "div",
          null,

          h(
            "span",
            null,
            "Project Budget"
          ),

          h(
            "strong",
            null,
            formatMoney(budget)
          )
        )
      ),

      h(
        "div",
        {
          className:
            "project-info-card"
        },

        h(
          "div",
          {
            className:
              "project-info-icon"
          },
          "📊"
        ),

        h(
          "div",
          null,

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
        )
      ),

      h(
        "div",
        {
          className:
            "project-info-card"
        },

        h(
          "div",
          {
            className:
              "project-info-icon"
          },
          "🏗️"
        ),

        h(
          "div",
          null,

          h(
            "span",
            null,
            "Contractor"
          ),

          h(
            "strong",
            null,
            project.contractor ||
              "Not specified"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "project-info-card"
        },

        h(
          "div",
          {
            className:
              "project-info-icon"
          },
          "📍"
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
            locationText
          )
        )
      )
    ),

    /* MAIN GRID */

    h(
      "div",
      {
        className:
          "project-details-main-grid"
      },

      /* LEFT */

      h(
        "div",
        {
          className:
            "project-details-main-column"
        },

        h(
          "div",
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
                "span",
                null,
                "📋"
              ),

              h(
                "div",
                null,

                h(
                  "h2",
                  null,
                  "Project Overview"
                ),

                h(
                  "p",
                  null,
                  "Basic information about this government project."
                )
              )
            )
          ),

          h(
            "div",
            {
              className:
                "project-overview-grid"
            },

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Project Name"
              ),
              h(
                "strong",
                null,
                project.name ||
                  project.projectName ||
                  "—"
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Project Code"
              ),
              h(
                "strong",
                null,
                project.projectCode ||
                  "—"
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Province"
              ),
              h(
                "strong",
                null,
                project.province ||
                  "—"
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "District"
              ),
              h(
                "strong",
                null,
                project.district ||
                  "—"
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Municipality"
              ),
              h(
                "strong",
                null,
                project.municipality ||
                  "—"
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Start Date"
              ),
              h(
                "strong",
                null,
                formatDate(
                  project.startDate ||
                  project.createdAt
                )
              )
            )
          ),

          project.description
            ? h(
                "div",
                {
                  className:
                    "project-description-box"
                },

                h(
                  "span",
                  null,
                  "Description"
                ),

                h(
                  "p",
                  null,
                  project.description
                )
              )
            : null
        ),

        h(
          "div",
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
                "span",
                null,
                "📈"
              ),

              h(
                "div",
                null,

                h(
                  "h2",
                  null,
                  "Project Progress"
                ),

                h(
                  "p",
                  null,
                  "Current implementation progress."
                )
              )
            )
          ),

          h(
            ProjectProgressCard,
            {
              progress:
                currentProgress,
              status:
                project.status
            }
          )
        ),

        h(
          "div",
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
                "span",
                null,
                "🕒"
              ),

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
                  "Project activities and progress history."
                )
              )
            )
          ),

          timelineLoading
            ? h(
                "div",
                {
                  className:
                    "project-section-loading"
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
      ),

      /* RIGHT */

      h(
        "div",
        {
          className:
            "project-details-side-column"
        },

        h(
          "div",
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
                "span",
                null,
                "📊"
              ),

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
                  "Reported project progress."
                )
              )
            )
          ),

          h(
            ProgressHistory,
            {
              history:
                progressHistory
            }
          )
        ),

        h(
          "div",
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
                "span",
                null,
                "📌"
              ),

              h(
                "div",
                null,

                h(
                  "h2",
                  null,
                  "Project Summary"
                )
              )
            )
          ),

          h(
            "div",
            {
              className:
                "project-summary-list"
            },

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Field Reports"
              ),
              h(
                "strong",
                null,
                timelineSummary?.totalFieldReports ??
                  0
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Latest Report Progress"
              ),
              h(
                "strong",
                null,
                `${
                  timelineSummary?.latestReportedProgress ??
                  currentProgress
                }%`
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Progress Difference"
              ),
              h(
                "strong",
                null,
                `${
                  timelineSummary?.progressDifference ??
                  0
                }%`
              )
            ),

            h(
              "div",
              null,
              h(
                "span",
                null,
                "Completion"
              ),
              h(
                "strong",
                null,
                currentProgress >= 100
                  ? "Completed"
                  : `${100 - currentProgress}% remaining`
              )
            )
          )
        ),

        h(
          "div",
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
                "span",
                null,
                "📍"
              ),

              h(
                "div",
                null,

                h(
                  "h2",
                  null,
                  "Location"
                )
              )
            )
          ),

          h(
            "div",
            {
              className:
                "project-location-box"
            },

            h(
              "strong",
              null,
              locationText
            ),

            project.latitude &&
            project.longitude
              ? h(
                  "p",
                  null,
                  `Coordinates: ${project.latitude}, ${project.longitude}`
                )
              : h(
                  "p",
                  null,
                  "Coordinates not available."
                )
          )
        )
      )
    )
  );
};

export default ProjectDetails;