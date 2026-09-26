import React from "react";

const h = React.createElement;

const ProjectRisk = ({
  risk = "Low"
}) => {
  const className =
    `risk-badge risk-${String(
      risk
    ).toLowerCase()}`;

  return h(
    "span",
    {
      className
    },
    risk
  );
};

export default ProjectRisk;