import React, { useState } from "react";
import { createProject } from "../services/api";

const AddProjectModal = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [form, setForm] = useState({
    name: "",
    projectId: "",
    province: "Bagmati",
    district: "",
    municipality: "",
    budget: "",
    progress: 0,
    status: "Active",
    riskLevel: "Low",
    description: "",
    contractor: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "progress"
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);

    try {
      const response =
        await createProject(form);

      if (onCreated) {
        onCreated(
          response.project || response
        );
      }

      setForm({
        name: "",
        projectId: "",
        province: "Bagmati",
        district: "",
        municipality: "",
        budget: "",
        progress: 0,
        status: "Active",
        riskLevel: "Low",
        description: "",
        contractor: ""
      });

      onClose();
    } catch (err) {
      setError(
        err.message ||
          "Unable to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    {
      className: "modal-overlay",
      onClick: (event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }
    },

    React.createElement(
      "div",
      {
        className: "modal-card"
      },

      React.createElement(
        "div",
        {
          className: "modal-header"
        },

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            {
              className: "modal-label"
            },
            "PROJECT REGISTRY"
          ),

          React.createElement(
            "h2",
            null,
            "Add New Project"
          )
        ),

        React.createElement(
          "button",
          {
            type: "button",
            className: "modal-close",
            onClick: onClose
          },
          "×"
        )
      ),

      error
        ? React.createElement(
            "div",
            {
              className: "form-error"
            },
            error
          )
        : null,

      React.createElement(
        "form",
        {
          onSubmit: handleSubmit
        },

        React.createElement(
          "div",
          {
            className: "form-grid"
          },

          React.createElement(
            "div",
            {
              className: "form-group full"
            },

            React.createElement(
              "label",
              null,
              "Project Name"
            ),

            React.createElement("input", {
              name: "name",
              value: form.name,
              onChange: handleChange,
              placeholder:
                "e.g. Kathmandu Ring Road Expansion",
              required: true
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Project ID"
            ),

            React.createElement("input", {
              name: "projectId",
              value: form.projectId,
              onChange: handleChange,
              placeholder:
                "PW-BAG-00125"
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Budget"
            ),

            React.createElement("input", {
              name: "budget",
              value: form.budget,
              onChange: handleChange,
              placeholder:
                "NPR 2.5B"
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Province"
            ),

            React.createElement(
              "select",
              {
                name: "province",
                value: form.province,
                onChange: handleChange
              },

              [
                "Bagmati",
                "Gandaki",
                "Koshi",
                "Lumbini",
                "Madhesh",
                "Karnali",
                "Sudurpashchim"
              ].map((item) =>
                React.createElement(
                  "option",
                  {
                    key: item,
                    value: item
                  },
                  item
                )
              )
            )
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "District"
            ),

            React.createElement("input", {
              name: "district",
              value: form.district,
              onChange: handleChange,
              placeholder: "Kathmandu"
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Municipality"
            ),

            React.createElement("input", {
              name: "municipality",
              value: form.municipality,
              onChange: handleChange,
              placeholder:
                "Kathmandu Metropolitan City"
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Progress (%)"
            ),

            React.createElement("input", {
              type: "number",
              name: "progress",
              min: 0,
              max: 100,
              value: form.progress,
              onChange: handleChange
            })
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Status"
            ),

            React.createElement(
              "select",
              {
                name: "status",
                value: form.status,
                onChange: handleChange
              },

              React.createElement(
                "option",
                { value: "Active" },
                "Active"
              ),

              React.createElement(
                "option",
                { value: "Delayed" },
                "Delayed"
              ),

              React.createElement(
                "option",
                { value: "Completed" },
                "Completed"
              ),

              React.createElement(
                "option",
                { value: "Critical" },
                "Critical"
              )
            )
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Risk Level"
            ),

            React.createElement(
              "select",
              {
                name: "riskLevel",
                value: form.riskLevel,
                onChange: handleChange
              },

              React.createElement(
                "option",
                { value: "Low" },
                "Low"
              ),

              React.createElement(
                "option",
                { value: "Medium" },
                "Medium"
              ),

              React.createElement(
                "option",
                { value: "High" },
                "High"
              ),

              React.createElement(
                "option",
                { value: "Critical" },
                "Critical"
              )
            )
          ),

          React.createElement(
            "div",
            {
              className: "form-group"
            },

            React.createElement(
              "label",
              null,
              "Contractor"
            ),

            React.createElement("input", {
              name: "contractor",
              value: form.contractor,
              onChange: handleChange,
              placeholder:
                "Contractor name"
            })
          ),

          React.createElement(
            "div",
            {
              className:
                "form-group full"
            },

            React.createElement(
              "label",
              null,
              "Description"
            ),

            React.createElement(
              "textarea",
              {
                name: "description",
                value: form.description,
                onChange: handleChange,
                rows: 4,
                placeholder:
                  "Project description..."
              }
            )
          )
        ),

        React.createElement(
          "div",
          {
            className: "modal-actions"
          },

          React.createElement(
            "button",
            {
              type: "button",
              className:
                "secondary-button",
              onClick: onClose
            },
            "Cancel"
          ),

          React.createElement(
            "button",
            {
              type: "submit",
              className:
                "primary-button",
              disabled: loading
            },
            loading
              ? "Creating..."
              : "Create Project"
          )
        )
      )
    )
  );
};

export default AddProjectModal;