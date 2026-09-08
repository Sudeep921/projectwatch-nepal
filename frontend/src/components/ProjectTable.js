import React from "react";

function ProjectTable({
  projects,
  onViewProject
}) {

  function getStatusClass(status) {
    return (
      "table-status " +
      status
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  }

  function getRiskClass(risk) {
    return (
      "table-risk " +
      risk
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  }

  function handleView(project) {
    if (onViewProject) {
      onViewProject(project);
    }
  }

  return React.createElement(
    "div",
    { className: "project-registry" },

    /* =====================================================
       REGISTRY HEADER
       ===================================================== */

    React.createElement(
      "div",
      { className: "registry-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "h3",
          null,
          "Project Registry"
        ),

        React.createElement(
          "p",
          null,
          "Official government project records and monitoring status."
        )
      ),

      React.createElement(
        "div",
        { className: "verified-registry" },

        React.createElement(
          "span",
          null,
          "✓"
        ),

        " Verified Registry"
      )
    ),

    /* =====================================================
       TABLE
       ===================================================== */

    React.createElement(
      "div",
      { className: "project-table-wrapper" },

      React.createElement(
        "table",
        { className: "project-table" },

        /* ---------------- TABLE HEADER ---------------- */

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
              "UPDATED"
            ),

            React.createElement(
              "th",
              null,
              "ACTION"
            )
          )
        ),

        /* ---------------- TABLE BODY ---------------- */

        React.createElement(
          "tbody",
          null,

          projects.length === 0

            ? React.createElement(
                "tr",
                null,

                React.createElement(
                  "td",
                  {
                    colSpan: 8,
                    className: "no-projects"
                  },
                  React.createElement(
                    "div",
                    {
                      className: "empty-project-icon"
                    },
                    "⌕"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    "No projects found"
                  ),

                  React.createElement(
                    "span",
                    null,
                    "Try changing your search or filters."
                  )
                )
              )

            : projects.map(function (project) {

                return React.createElement(
                  "tr",
                  {
                    key: project.id
                  },

                  /* =================================================
                     PROJECT
                     ================================================= */

                  React.createElement(
                    "td",
                    null,

                    React.createElement(
                      "div",
                      {
                        className:
                          "project-name-cell"
                      },

                      React.createElement(
                        "div",
                        {
                          className:
                            "project-icon"
                        },
                        project.icon || "▣"
                      ),

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "strong",
                          null,
                          project.name
                        ),

                        React.createElement(
                          "span",
                          null,
                          project.id
                        )
                      )
                    )
                  ),

                  /* =================================================
                     LOCATION
                     ================================================= */

                  React.createElement(
                    "td",
                    null,

                    React.createElement(
                      "div",
                      {
                        className:
                          "location-cell"
                      },

                      React.createElement(
                        "strong",
                        null,
                        project.district
                      ),

                      React.createElement(
                        "span",
                        null,
                        project.province
                      )
                    )
                  ),

                  /* =================================================
                     BUDGET
                     ================================================= */

                  React.createElement(
                    "td",
                    {
                      className:
                        "budget-cell"
                    },
                    project.budget
                  ),

                  /* =================================================
                     PROGRESS
                     ================================================= */

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
                          "strong",
                          null,
                          project.progress + "%"
                        ),

                        React.createElement(
                          "span",
                          null,
                          project.progressLabel ||
                            "Progress"
                        )
                      ),

                      React.createElement(
                        "div",
                        {
                          className:
                            "table-progress-bar"
                        },

                        React.createElement(
                          "span",
                          {
                            style: {
                              width:
                                project.progress +
                                "%"
                            }
                          }
                        )
                      )
                    )
                  ),

                  /* =================================================
                     STATUS
                     ================================================= */

                  React.createElement(
                    "td",
                    null,

                    React.createElement(
                      "span",
                      {
                        className:
                          getStatusClass(
                            project.status
                          )
                      },

                      React.createElement(
                        "i",
                        null
                      ),

                      project.status
                    )
                  ),

                  /* =================================================
                     RISK
                     ================================================= */

                  React.createElement(
                    "td",
                    null,

                    React.createElement(
                      "span",
                      {
                        className:
                          getRiskClass(
                            project.risk
                          )
                      },

                      React.createElement(
                        "i",
                        null
                      ),

                      project.risk
                    )
                  ),

                  /* =================================================
                     UPDATED
                     ================================================= */

                  React.createElement(
                    "td",
                    {
                      className:
                        "updated-cell"
                    },

                    React.createElement(
                      "span",
                      null,
                      project.updated
                    )
                  ),

                  /* =================================================
                     ACTION
                     ================================================= */

                  React.createElement(
                    "td",
                    null,

                    React.createElement(
                      "button",
                      {
                        className:
                          "table-action-btn",

                        title:
                          "View Project",

                        onClick:
                          function () {
                            handleView(
                              project
                            );
                          }
                      },

                      "View →"
                    )
                  )
                );
              })
        )
      )
    ),

    /* =====================================================
       REGISTRY FOOTER
       ===================================================== */

    React.createElement(
      "div",
      { className: "registry-footer" },

      React.createElement(
        "span",
        null,

        "Showing ",

        React.createElement(
          "strong",
          null,
          projects.length
        ),

        " projects"
      ),

      React.createElement(
        "div",
        { className: "pagination" },

        React.createElement(
          "button",
          {
            title: "Previous page"
          },
          "‹"
        ),

        React.createElement(
          "button",
          {
            className: "active"
          },
          "1"
        ),

        React.createElement(
          "button",
          null,
          "2"
        ),

        React.createElement(
          "button",
          null,
          "3"
        ),

        React.createElement(
          "button",
          {
            title: "Next page"
          },
          "›"
        )
      )
    )
  );
}

export default ProjectTable;