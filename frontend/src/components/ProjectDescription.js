import React from "react";

const h = React.createElement;

const ProjectDescription = ({ project }) => {
  if (!project) return null;

  return h(
    "section",
    { className: "project-description" },

    h(
      "h2",
      null,
      "Description"
    ),

    h(
      "p",
      null,
      project.description ||
        "No project description available."
    )
  );
};

export default ProjectDescription;