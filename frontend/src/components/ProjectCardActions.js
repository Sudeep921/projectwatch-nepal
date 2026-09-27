import React from "react";

const h = React.createElement;

const ProjectCardActions = ({
  project,
  navigate
}) => {
  if (!project) return null;

  const id =
    project._id ||
    project.id;

  return h(
    "div",
    {
      className:
        "project-card-actions"
    },

    h(
      "button",
      {
        type: "button",
        onClick: () =>
          navigate(
            "/admin/projects/" +
              id
          )
      },
      "View Details"
    )
  );
};

export default ProjectCardActions;