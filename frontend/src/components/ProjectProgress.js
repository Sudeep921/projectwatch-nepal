import React from "react";

const h = React.createElement;

const ProjectProgress = ({
  progress = 0
}) => {
  const value = Math.max(
    0,
    Math.min(
      100,
      Number(progress) || 0
    )
  );

  return h(
    "div",
    {
      className:
        "project-progress"
    },

    h(
      "div",
      {
        className:
          "project-progress-top"
      },

      h(
        "span",
        null,
        "Progress"
      ),

      h(
        "strong",
        null,
        `${value}%`
      )
    ),

    h(
      "div",
      {
        className:
          "project-progress-track"
      },

      h(
        "div",
        {
          className:
            "project-progress-fill",
          style: {
            width: `${value}%`
          }
        }
      )
    )
  );
};

export default ProjectProgress;