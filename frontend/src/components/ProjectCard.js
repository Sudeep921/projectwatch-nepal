import React from "react";

import {
  useNavigate
} from "react-router-dom";

const h = React.createElement;

const ProjectCard = ({
  project
}) => {
  const navigate =
    useNavigate();

  return h(
    "div",
    {
      className:
        "project-card"
    },

    h(
      "span",
      {
        className:
          "project-code"
      },
      project.projectCode ||
        "PROJECT"
    ),

    h(
      "h3",
      null,
      project.name
    ),

    h(
      "p",
      null,
      `${project.district || ""}, ${
        project.province || ""
      }`
    ),

    h(
      "div",
      {
        className:
          "progress-track"
      },
      h(
        "div",
        {
          className:
            "progress-fill",
          style: {
            width:
              `${project.progress || 0}%`
          }
        }
      )
    ),

    h(
      "div",
      {
        className:
          "project-card-footer"
      },

      h(
        "strong",
        null,
        `${project.progress || 0}%`
      ),

      h(
        "button",
        {
          onClick: () =>
            navigate(
              `/admin/projects/${
                project._id
              }`
            )
        },
        "View →"
      )
    )
  );
};

export default ProjectCard;