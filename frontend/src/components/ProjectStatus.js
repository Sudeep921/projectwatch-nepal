import React from "react";

const h = React.createElement;

const ProjectStatus = ({
  status = "Active"
}) => {
  const className =
    `status-badge status-${String(
      status
    ).toLowerCase()}`;

  return h(
    "span",
    {
      className
    },
    status
  );
};

export default ProjectStatus;