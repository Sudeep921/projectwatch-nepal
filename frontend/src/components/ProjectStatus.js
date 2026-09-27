import React from "react";

const h = React.createElement;

const ProjectStatus = ({ status }) => {
  const value = status || "Active";

  return h(
    "span",
    {
      className:
        "project-status project-status-" +
        value.toLowerCase().replace(/\s+/g, "-")
    },
    value
  );
};

export default ProjectStatus;