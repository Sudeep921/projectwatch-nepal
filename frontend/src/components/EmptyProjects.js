import React from "react";

const h = React.createElement;

const EmptyProjects = ({ message }) => {
  return h(
    "div",
    { className: "empty-projects" },
    h(
      "div",
      { className: "empty-projects-icon" },
      "📁"
    ),
    h(
      "h3",
      null,
      "No Projects Found"
    ),
    h(
      "p",
      null,
      message || "No projects match your current filters."
    )
  );
};

export default EmptyProjects;