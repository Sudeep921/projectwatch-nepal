import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectTable = ({
  projects = []
}) => {
  const navigate = useNavigate();

  const getStatusClass = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const openProject = (project) => {
    const id =
      project._id || project.id;

    if (id) {
      navigate(`/projects/${id}`);
    }
  };

  if (!projects.length) {
    return React.createElement(
      "div",
      {
        className: "empty-state"
      },

      React.createElement(
        "div",
        {
          className: "empty-state-icon"
        },
        "▤"
      ),

      React.createElement(
        "h3",
        null,
        "No projects found"
      ),

      React.createElement(
        "p",
        null,
        "There are no projects matching the current filters."
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: "project-table-wrapper"
    },

    React.createElement(
      "table",
      {
        className: "project-table"
      },

      React.createElement(
        "thead",
        null,

        React.createElement(
          "tr",
          null,

          React.createElement(
            "th",
            null,
            "PROJECT"
          ),

          React.createElement(
            "th",
            null,
            "LOCATION"
          ),

          React.createElement(
            "th",
            null,
            "BUDGET"
          ),

          React.createElement(
            "th",
            null,
            "PROGRESS"
          ),

          React.createElement(
            "th",
            null,
            "STATUS"
          ),

          React.createElement(
            "th",
            null,
            "RISK"
          ),

          React.createElement(
            "th",
            null,
            "ACTION"
          )
        )
      ),

      React.createElement(
        "tbody",
        null,

        projects.map((project) => {
          const progress =
            Number(
              project.progress || 0
            );

          const status =
            project.status ||
            "Active";

          const risk =
            project.riskLevel ||
            "Low";

          return React.createElement(
            "tr",
            {
              key:
                project._id ||
                project.id ||
                project.name
            },

            React.createElement(
              "td",
              null,

              React.createElement(
                "div",
                {
                  className:
                    "table-project-name"
                },

                React.createElement(
                  "strong",
                  null,
                  project.name ||
                    "Unnamed Project"
                ),

                React.createElement(
                  "span",
                  null,
                  project.projectId ||
                    project.code ||
                    project._id ||
                    "N/A"
                )
              )
            ),

            React.createElement(
              "td",
              null,

              React.createElement(
                "div",
                {
                  className:
                    "table-location"
                },

                project.district ||
                  "N/A",

                project.province
                  ? React.createElement(
                      "small",
                      null,
                      project.province
                    )
                  : null
              )
            ),

            React.createElement(
              "td",
              null,
              project.budget ||
                "N/A"
            ),

            React.createElement(
              "td",
              null,

              React.createElement(
                "div",
                {
                  className:
                    "table-progress"
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "table-progress-top"
                  },

                  React.createElement(
                    "span",
                    null,
                    `${progress}%`
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "table-progress-bar"
                  },

                  React.createElement(
                    "div",
                    {
                      className:
                        "table-progress-fill",
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
            ),

            React.createElement(
              "td",
              null,

              React.createElement(
                "span",
                {
                  className: `status-badge ${getStatusClass(
                    status
                  )}`
                },
                status
              )
            ),

            React.createElement(
              "td",
              null,

              React.createElement(
                "span",
                {
                  className: `risk-badge ${getStatusClass(
                    risk
                  )}`
                },
                risk
              )
            ),

            React.createElement(
              "td",
              null,

              React.createElement(
                "button",
                {
                  type: "button",
                  className:
                    "table-action-button",
                  onClick: () =>
                    openProject(project)
                },
                "View"
              )
            )
          );
        })
      )
    )
  );
};

export default ProjectTable;