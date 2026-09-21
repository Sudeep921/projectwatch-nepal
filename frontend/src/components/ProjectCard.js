import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({
  project
}) => {
  const navigate = useNavigate();

  if (!project) {
    return null;
  }

  const status =
    project.status || "Active";

  const risk =
    project.riskLevel || "Low";

  const progress =
    Number(project.progress || 0);

  const getStatusClass = (value) => {
    return String(value)
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const handleOpen = () => {
    if (project._id) {
      navigate(
        `/projects/${project._id}`
      );
    } else if (project.id) {
      navigate(
        `/projects/${project.id}`
      );
    }
  };

  return React.createElement(
    "div",
    {
      className: "project-card"
    },

    React.createElement(
      "div",
      {
        className: "project-card-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className: "project-card-label"
          },
          "PUBLIC PROJECT"
        ),

        React.createElement(
          "h3",
          null,
          project.name ||
            "Unnamed Project"
        )
      ),

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
      "div",
      {
        className: "project-card-location"
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
        className: "project-card-progress"
      },

      React.createElement(
        "div",
        {
          className: "progress-info"
        },

        React.createElement(
          "span",
          null,
          "Project Progress"
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
          className: "progress-bar"
        },

        React.createElement(
          "div",
          {
            className: "progress-bar-fill",
            style: {
              width: `${Math.min(
                Math.max(progress, 0),
                100
              )}%`
            }
          }
        )
      )
    ),

    React.createElement(
      "div",
      {
        className: "project-card-details"
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
          "Risk"
        ),

        React.createElement(
          "strong",
          {
            className: `risk-${getStatusClass(
              risk
            )}`
          },
          risk
        )
      )
    ),

    React.createElement(
      "button",
      {
        type: "button",
        className: "project-card-button",
        onClick: handleOpen
      },
      "View Project →"
    )
  );
};

export default ProjectCard;