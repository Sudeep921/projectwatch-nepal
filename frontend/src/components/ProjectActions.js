import React from "react";

const h = React.createElement;

const ProjectActions = ({
  project,
  onView,
  onEdit,
  onDelete
}) => {
  if (!project) {
    return null;
  }

  return h(
    "div",
    {
      className: "project-actions"
    },

    h(
      "button",
      {
        type: "button",
        className: "project-action-view",
        onClick: function () {
          if (onView) {
            onView(project);
          }
        }
      },
      "View"
    ),

    h(
      "button",
      {
        type: "button",
        className: "project-action-edit",
        onClick: function () {
          if (onEdit) {
            onEdit(project);
          }
        }
      },
      "Edit"
    ),

    h(
      "button",
      {
        type: "button",
        className: "project-action-delete",
        onClick: function () {
          if (onDelete) {
            onDelete(project);
          }
        }
      },
      "Delete"
    )
  );
};

export default ProjectActions;