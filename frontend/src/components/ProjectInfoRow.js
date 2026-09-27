import React from "react";

const h = React.createElement;

const ProjectInfoRow = ({
  label,
  value
}) => {
  return h(
    "div",
    { className: "project-info-row" },

    h(
      "span",
      { className: "project-info-label" },
      label
    ),

    h(
      "span",
      { className: "project-info-value" },
      value || "-"
    )
  );
};

export default ProjectInfoRow;