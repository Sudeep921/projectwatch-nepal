import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProject
} from "../services/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);

      try {
        const response =
          await getProject(id);

        setProject(
          response.project ||
            response.data ||
            response
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  if (loading) {
    return React.createElement(
      "div",
      {
        className: "page-loading"
      },
      "Loading project..."
    );
  }

  if (error || !project) {
    return React.createElement(
      "div",
      {
        className: "page-container"
      },

      React.createElement(
        "div",
        {
          className: "page-error"
        },
        error || "Project not found."
      ),

      React.createElement(
        "button",
        {
          className:
            "secondary-button",
          onClick: () =>
            navigate("/projects")
        },
        "← Back to Projects"
      )
    );
  }

  const progress =
    Number(project.progress || 0);

  return React.createElement(
    "div",
    {
      className:
        "page-container project-details-page"
    },

    React.createElement(
      "button",
      {
        className:
          "back-button",
        onClick: () =>
          navigate("/projects")
      },
      "← Back to Projects"
    ),

    React.createElement(
      "div",
      {
        className:
          "project-detail-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "page-eyebrow"
          },
          "PROJECT DETAILS"
        ),

        React.createElement(
          "h1",
          null,
          project.name ||
            "Government Project"
        ),

        React.createElement(
          "p",
          null,
          project.projectId ||
            project.code ||
            project._id
        )
      ),

      React.createElement(
        "span",
        {
          className:
            "status-badge"
        },
        project.status ||
          "Active"
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "project-detail-grid"
      },

      React.createElement(
        "section",
        {
          className:
            "detail-card"
        },

        React.createElement(
          "h2",
          null,
          "Project Overview"
        ),

        React.createElement(
          "p",
          {
            className:
              "detail-description"
          },
          project.description ||
            "No project description has been provided."
        ),

        React.createElement(
          "div",
          {
            className:
              "detail-info-grid"
          },

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "Province"
            ),
            React.createElement(
              "strong",
              null,
              project.province ||
                "N/A"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "District"
            ),
            React.createElement(
              "strong",
              null,
              project.district ||
                "N/A"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "Municipality"
            ),
            React.createElement(
              "strong",
              null,
              project.municipality ||
                "N/A"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "Budget"
            ),
            React.createElement(
              "strong",
              null,
              project.budget ||
                "N/A"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "Contractor"
            ),
            React.createElement(
              "strong",
              null,
              project.contractor ||
                "N/A"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              null,
              "Risk Level"
            ),
            React.createElement(
              "strong",
              null,
              project.riskLevel ||
                "Low"
            )
          )
        )
      ),

      React.createElement(
        "section",
        {
          className:
            "detail-card"
        },

        React.createElement(
          "h2",
          null,
          "Project Progress"
        ),

        React.createElement(
          "div",
          {
            className:
              "large-progress"
          },

          React.createElement(
            "strong",
            null,
            `${progress}%`
          ),

          React.createElement(
            "span",
            null,
            "Overall Completion"
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "progress-bar large"
          },

          React.createElement(
            "div",
            {
              className:
                "progress-bar-fill",
              style: {
                width: `${Math.min(
                  Math.max(
                    progress,
                    0
                  ),
                  100
                )}%`
              }
            }
          )
        )
      )
    )
  );
};

export default ProjectDetails;