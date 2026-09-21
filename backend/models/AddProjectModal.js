import { useState } from "react";
import { addProject } from "../services/projectService";
const [formData, setFormData] =
  useState({
    projectName: "",
    projectCode: "",
    province: "",
    district: "",
    municipality: "",
    contractor: "",
    budget: "",
    progress: 0,
    status: "Active",
    description: "",
    startDate: "",
    endDate: ""
  });

const [saving, setSaving] =
  useState(false);
  const handleChange = (event) => {
  const {
    name,
    value
  } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value
  }));
};
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setSaving(true);

    const project = {
      ...formData,

      budget: Number(
        formData.budget
      ),

      progress: Number(
        formData.progress
      )
    };

    await addProject(project);

    alert(
      "Project created successfully"
    );

    window.location.reload();
  } catch (error) {
    alert(error.message);
  } finally {
    setSaving(false);
  }
};