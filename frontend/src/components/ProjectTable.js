import React from "react";

import {
  useNavigate
} from "react-router-dom";

const h = React.createElement;

const ProjectTable = ({
  projects = []
}) => {
  const navigate =
    useNavigate();

  if (!projects.length) {
    return h(
      "div",
      {
        className:
          "empty-state"
      },
      "No projects found."
    );
  }

  return h(
    "div",
    {
      className:
        "project-table-wrapper"
    },

    h(
      "table",
      {
        className:
          "project-table"
      },

      h(
        "thead",
        null,

        h(
          "tr",
          null,

          h(
            "th",
            null,
            "Project"
          ),

          h(
            "th",
            null,
            "Location"
          ),

          h(
            "th",
            null,
            "Budget"
          ),

          h(
            "th",
            null,
            "Progress"
          ),

          h(
            "th",
            null,
            "Status"
          ),

          h(
            "th",
            null,
            "Risk"
          ),

          h(
            "th",
            null,
            "Action"
          )
        )
      ),

      h(
        "tbody",
        null,

        projects.map(
          (p) =>
            h(
              "tr",
              {
                key: p._id
              },

              h(
                "td",
                null,

                h(
                  "strong",
                  null,
                  p.name
                ),

                h(
                  "small",
                  null,
                  p.projectCode ||
                    "-"
                )
              ),

              h(
                "td",
                null,
                `${p.district || "-"}, ${
                  p.province || "-"
                }`
              ),

              h(
                "td",
                null,
                `NPR ${Number(
                  p.budget || 0
                ).toLocaleString()}`
              ),

              h(
                "td",
                null,
                `${p.progress || 0}%`
              ),

              h(
                "td",
                null,
                p.status ||
                  "-"
              ),

              h(
                "td",
                null,
                p.riskLevel ||
                  "-"
              ),

              h(
                "td",
                null,

                h(
                  "button",
                  {
                    className:
                      "table-view-button",
                    onClick: () =>
                      navigate(
                        `/admin/projects/${p._id}`
                      )
                  },
                  "View"
                )
              )
            )
        )
      )
    )
  );
};

export default ProjectTable;