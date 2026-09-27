import React from "react";

const h = React.createElement;

const ProjectActions = ({
  project,
  onView,
  onEdit,
  onDelete
}) => {
  if (!project) return null;

  return h(
    "div",
    { className: "project-actions" },

    h(
      "button",
      {
        type: "button",
        onClick: () => onView && onView(project)
      },
      "View"
    ),

    h(
      "button",
      {
        type: "button",
        onClick: () => onEdit && onEdit(project)
      },
      "Edit"
    ),

    h(
      "button",
      {
        type: "button",
        onClick: () => onDelete && onDelete(project)
      },
      "Delete"
    )
  );
};

export default ProjectActions;