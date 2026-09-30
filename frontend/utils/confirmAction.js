export const confirmAction = (
  message
) => {
  return window.confirm(
    message ||
    "Are you sure you want to continue?"
  );
};
import {
  confirmAction
} from "../utils/confirmAction";
const handleDelete = async (
  id
) => {
  const confirmed =
    confirmAction(
      "Are you sure you want to delete this project?"
    );

  if (!confirmed) {
    return;
  }

  try {
    await deleteProject(id);

    window.alert(
      "Project deleted successfully."
    );

    await loadProjects();
  } catch (error) {
    window.alert(
      error.message ||
      "Failed to delete project."
    );
  }
};