import React from "react";

const h = React.createElement;

const ProjectMeta = ({ project }) => {
  if (!project) return null;

  return h(
    "div",
    { className: "project-meta" },

    h(
      "span",
      null,
      "Code: ",
      project.projectCode || "-"
    ),

    h(
      "span",
      null,
      "Contractor: ",
      project.contractor || "-"
    )
  );
};

export default ProjectMeta;