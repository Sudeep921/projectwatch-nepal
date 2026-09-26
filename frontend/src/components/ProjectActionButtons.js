import React from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  deleteProject
} from "../services/api";

const h =
  React.createElement;

const ProjectActionButtons = ({
  project
}) => {
  const navigate =
    useNavigate();

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          "Delete this project?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteProject(
          project._id
        );

        window.alert(
          "Project deleted successfully"
        );

        window.location.reload();
      } catch (error) {
        window.alert(
          error.message ||
          "Failed to delete project"
        );
      }
    };

  const handleEdit = () => {
    navigate(
      `/admin/projects/${project._id}?edit=true`
    );
  };

  return h(
    "div",
    {
      className:
        "project-action-buttons"
    },

    h(
      "button",
      {
        type: "button",
        className:
          "project-edit-btn",
        onClick: handleEdit
      },
      "Edit"
    ),

    h(
      "button",
      {
        type: "button",
        className:
          "project-delete-btn",
        onClick: handleDelete
      },
      "Delete"
    )
  );
};

export default ProjectActionButtons;