import React from "react";

const h = React.createElement;

const ProjectPublicBadge = ({ isPublic }) => {
  return h(
    "span",
    {
      className:
        "project-public-badge " +
        (isPublic
          ? "public"
          : "private")
    },
    isPublic
      ? "Public"
      : "Private"
  );
};

export default ProjectPublicBadge;