import { useState } from "react";
import { addProject } from "../services/projectService";

const AddProjectPage = () => {
  const [formData, setFormData] = useState({
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

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

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
        budget: Number(formData.budget),
        progress: Number(formData.progress)
      };

      await addProject(project);

      alert("Project created successfully");

      window.location.reload();
    } catch (error) {
      console.error("Project creation error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={formData.projectName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="projectCode"
          placeholder="Project Code"
          value={formData.projectCode}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleChange}
        />

        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
        />

        <input
          type="text"
          name="municipality"
          placeholder="Municipality"
          value={formData.municipality}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contractor"
          placeholder="Contractor"
          value={formData.contractor}
          onChange={handleChange}
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="progress"
          placeholder="Progress (%)"
          value={formData.progress}
          onChange={handleChange}
          min="0"
          max="100"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>
          Start Date
        </label>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <label>
          End Date
        </label>

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProjectPage;