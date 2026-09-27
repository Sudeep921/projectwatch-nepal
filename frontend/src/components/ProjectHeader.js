import React from "react";

const h = React.createElement;

const ProjectHeader = ({
  project,
  onBack
}) => {
  if (!project) return null;

  return h(
    "div",
    { className: "project-header" },

    h(
      "button",
      {
        type: "button",
        className: "project-back-button",
        onClick: onBack
      },
      "← Back"
    ),

    h(
      "div",
      { className: "project-header-main" },

      h(
        "h1",
        null,
        project.name ||
          project.projectName ||
          "Project"
      ),

      h(
        "p",
        null,
        project.projectCode ||
          "Project Code Not Available"
      )
    )
  );
};

export default ProjectHeader;