import React from "react";

import {
  Link
} from "react-router-dom";

const PublicProjectCard = ({
  project
}) => {
  const progress =
    Number(project.progress || 0);

  const status =
    project.status || "Active";

  const risk =
    project.riskLevel || "Low";

  return React.createElement(
    "article",
    {
      className:
        "public-project-card"
    },

    React.createElement(
      "div",
      {
        className:
          "public-project-card-top"
      },

      React.createElement(
        "span",
        {
          className:
            "public-project-code"
        },
        project.projectCode ||
          "PW-PROJECT"
      ),

      React.createElement(
        "span",
        {
          className:
            `public-status public-status-${status.toLowerCase()}`
        },
        status
      )
    ),

    React.createElement(
      "h3",
      null,
      project.name ||
        "Government Development Project"
    ),

    React.createElement(
      "p",
      {
        className:
          "public-project-location"
      },
      `${project.district || "Nepal"}${
        project.province
          ? `, ${project.province}`
          : ""
      }`
    ),

    React.createElement(
      "div",
      {
        className:
          "public-project-progress"
      },

      React.createElement(
        "div",
        {
          className:
            "public-progress-header"
        },

        React.createElement(
          "span",
          null,
          "Implementation Progress"
        ),

        React.createElement(
          "strong",
          null,
          `${progress}%`
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "public-progress-track"
        },

        React.createElement(
          "div",
          {
            className:
              "public-progress-fill",
            style: {
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  progress
                )
              )}%`
            }
          }
        )
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "public-project-meta"
      },

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
          project.budget
            ? `NPR ${Number(
                project.budget
              ).toLocaleString()}`
            : "Not disclosed"
        )
      ),

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          null,
          "Risk"
        ),

        React.createElement(
          "strong",
          {
            className:
              `risk-${risk.toLowerCase()}`
          },
          risk
        )
      )
    ),

    React.createElement(
      Link,
      {
        to: `/public/projects/${
          project._id
        }`,
        className:
          "public-view-project"
      },
      "View Project Details →"
    )
  );
};

export default PublicProjectCard;