import React from "react";

const h = React.createElement;

const ConfirmDelete = ({
  project,
  onConfirm,
  onCancel
}) => {
  if (!project) return null;

  return h(
    "div",
    { className: "confirm-overlay" },

    h(
      "div",
      { className: "confirm-box" },

      h(
        "h3",
        null,
        "Delete Project?"
      ),

      h(
        "p",
        null,
        "Are you sure you want to delete ",
        h(
          "strong",
          null,
          project.name ||
            project.projectName ||
            "this project"
        ),
        "?"
      ),

      h(
        "div",
        { className: "confirm-actions" },

        h(
          "button",
          {
            type: "button",
            onClick: onCancel
          },
          "Cancel"
        ),

        h(
          "button",
          {
            type: "button",
            className: "danger",
            onClick: onConfirm
          },
          "Delete"
        )
      )
    )
  );
};

export default ConfirmDelete;