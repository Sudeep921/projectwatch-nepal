import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from "./api";

export const loadProjects = async () => {
  const data = await getProjects();

  return data.projects || [];
};

export const loadProject = async (id) => {
  const data =
    await getProject(id);

  return data.project;
};

export const addProject = async (
  projectData
) => {
  const data =
    await createProject(projectData);

  return data.project;
};

export const editProject = async (
  id,
  projectData
) => {
  const data =
    await updateProject(
      id,
      projectData
    );

  return data.project;
};

export const removeProject = async (id) => {
  return await deleteProject(id);
};