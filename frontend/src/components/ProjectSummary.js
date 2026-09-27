import React from "react";

const h = React.createElement;

const ProjectSummary = ({ project }) => {
  if (!project) return null;

  return h(
    "div",
    { className: "project-summary" },

    h(
      "div",
      null,
      h("span", null, "Budget"),
      h(
        "strong",
        null,
        "NPR " +
          Number(project.budget || 0).toLocaleString()
      )
    ),

    h(
      "div",
      null,
      h("span", null, "Province"),
      h(
        "strong",
        null,
        project.province || "-"
      )
    ),

    h(
      "div",
      null,
      h("span", null, "District"),
      h(
        "strong",
        null,
        project.district || "-"
      )
    ),

    h(
      "div",
      null,
      h("span", null, "Municipality"),
      h(
        "strong",
        null,
        project.municipality || "-"
      )
    )
  );
};

export default ProjectSummary;