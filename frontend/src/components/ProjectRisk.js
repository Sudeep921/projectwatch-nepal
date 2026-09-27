import React from "react";

const h = React.createElement;

const ProjectRisk = ({ risk }) => {
  const value = risk || "Low";

  return h(
    "span",
    {
      className:
        "project-risk project-risk-" +
        value.toLowerCase()
    },
    value
  );
};

export default ProjectRisk;