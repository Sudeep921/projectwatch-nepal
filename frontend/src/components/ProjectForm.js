import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createProject,
  generateProjectCode
} from "../services/api";

const h = React.createElement;

const ProjectForm = ({
  initialData = {},
  editMode = false,
  onSuccess
}) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectCode:
      initialData.projectCode || "",

    name:
      initialData.name || "",

    description:
      initialData.description || "",

    province:
      initialData.province || "",

    district:
      initialData.district || "",

    municipality:
      initialData.municipality || "",

    ward:
      initialData.ward || "",

    contractor:
      initialData.contractor || "",

    budget:
      initialData.budget || "",

    progress:
      initialData.progress || 0,

    status:
      initialData.status || "Active",

    risk:
      initialData.risk || "Low",

    startDate:
      initialData.startDate
        ? String(initialData.startDate).slice(0, 10)
        : "",

    expectedEndDate:
      initialData.expectedEndDate
        ? String(initialData.expectedEndDate).slice(0, 10)
        : "",

    isPublic:
      initialData.isPublic !== false
  });

  const [loading, setLoading] =
    useState(false);

  const [codeLoading, setCodeLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setForm({
      projectCode:
        initialData.projectCode || "",

      name:
        initialData.name || "",

      description:
        initialData.description || "",

      province:
        initialData.province || "",

      district:
        initialData.district || "",

      municipality:
        initialData.municipality || "",

      ward:
        initialData.ward || "",

      contractor:
        initialData.contractor || "",

      budget:
        initialData.budget || "",

      progress:
        initialData.progress || 0,

      status:
        initialData.status || "Active",

      risk:
        initialData.risk || "Low",

      startDate:
        initialData.startDate
          ? String(
              initialData.startDate
            ).slice(0, 10)
          : "",

      expectedEndDate:
        initialData.expectedEndDate
          ? String(
              initialData.expectedEndDate
            ).slice(0, 10)
          : "",

      isPublic:
        initialData.isPublic !== false
    });
  }, [initialData]);

  const change = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCode = async () => {
    try {
      setCodeLoading(true);
      setError("");

      const result =
        await generateProjectCode();

      change(
        "projectCode",
        result.code || ""
      );
    } catch (error) {
      setError(
        error.message ||
        "Failed to generate project code"
      );
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "Project name is required."
      );
      return;
    }

    if (!form.province.trim()) {
      setError(
        "Province is required."
      );
      return;
    }

    if (!form.district.trim()) {
      setError(
        "District is required."
      );
      return;
    }

    if (!form.municipality.trim()) {
      setError(
        "Municipality is required."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,

        budget:
          Number(form.budget || 0),

        progress:
          Number(form.progress || 0),

        ward:
          Number(form.ward || 0)
      };

      const result =
        await createProject(payload);

      setSuccess(
        editMode
          ? "Project updated successfully."
          : "Project created successfully."
      );

      if (onSuccess) {
        onSuccess(result);
        return;
      }

      setTimeout(() => {
        navigate("/admin/projects");
      }, 700);
    } catch (error) {
      setError(
        error.message ||
        "Failed to save project."
      );
    } finally {
      setLoading(false);
    }
  };

  return h(
    "form",
    {
      className: "project-form",
      onSubmit: handleSubmit
    },

    error &&
      h(
        "div",
        {
          className:
            "form-message form-error"
        },
        error
      ),

    success &&
      h(
        "div",
        {
          className:
            "form-message form-success"
        },
        success
      ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "h3",
        null,
        "Basic Project Information"
      ),

      h(
        "div",
        {
          className:
            "project-form-grid"
        },

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Project Code"
          ),

          h(
            "div",
            {
              className:
                "code-input-row"
            },

            h("input", {
              type: "text",
              value:
                form.projectCode,
              onChange: (e) =>
                change(
                  "projectCode",
                  e.target.value
                ),
              placeholder:
                "PW-BAG-00001"
            }),

            h(
              "button",
              {
                type: "button",
                className:
                  "operation-btn",
                onClick:
                  generateCode,
                disabled:
                  codeLoading
              },
              codeLoading
                ? "Generating..."
                : "Generate Code"
            )
          )
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Project Name *"
          ),

          h("input", {
            type: "text",
            value: form.name,
            onChange: (e) =>
              change(
                "name",
                e.target.value
              ),
            placeholder:
              "Enter project name"
          })
        )
      ),

      h(
        "div",
        {
          className:
            "form-group"
        },

        h(
          "label",
          null,
          "Description"
        ),

        h(
          "textarea",
          {
            value:
              form.description,
            onChange: (e) =>
              change(
                "description",
                e.target.value
              ),
            rows: 4,
            placeholder:
              "Enter project description"
          }
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "h3",
        null,
        "Project Location"
      ),

      h(
        "div",
        {
          className:
            "project-form-grid"
        },

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Province *"
          ),

          h("input", {
            type: "text",
            value:
              form.province,
            onChange: (e) =>
              change(
                "province",
                e.target.value
              ),
            placeholder:
              "Bagmati"
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "District *"
          ),

          h("input", {
            type: "text",
            value:
              form.district,
            onChange: (e) =>
              change(
                "district",
                e.target.value
              ),
            placeholder:
              "Kathmandu"
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Municipality *"
          ),

          h("input", {
            type: "text",
            value:
              form.municipality,
            onChange: (e) =>
              change(
                "municipality",
                e.target.value
              ),
            placeholder:
              "Kathmandu Metropolitan City"
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Ward"
          ),

          h("input", {
            type: "number",
            min: 0,
            value:
              form.ward,
            onChange: (e) =>
              change(
                "ward",
                e.target.value
              ),
            placeholder:
              "10"
          })
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "h3",
        null,
        "Contract & Budget"
      ),

      h(
        "div",
        {
          className:
            "project-form-grid"
        },

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Contractor"
          ),

          h("input", {
            type: "text",
            value:
              form.contractor,
            onChange: (e) =>
              change(
                "contractor",
                e.target.value
              ),
            placeholder:
              "Contractor company"
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Budget"
          ),

          h("input", {
            type: "number",
            min: 0,
            value:
              form.budget,
            onChange: (e) =>
              change(
                "budget",
                e.target.value
              ),
            placeholder:
              "8400000000"
          })
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "h3",
        null,
        "Project Status"
      ),

      h(
        "div",
        {
          className:
            "project-form-grid"
        },

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Progress (%)"
          ),

          h("input", {
            type: "number",
            min: 0,
            max: 100,
            value:
              form.progress,
            onChange: (e) =>
              change(
                "progress",
                e.target.value
              )
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Status"
          ),

          h(
            "select",
            {
              value:
                form.status,
              onChange: (e) =>
                change(
                  "status",
                  e.target.value
                )
            },

            h(
              "option",
              {
                value: "Active"
              },
              "Active"
            ),

            h(
              "option",
              {
                value: "Delayed"
              },
              "Delayed"
            ),

            h(
              "option",
              {
                value: "Completed"
              },
              "Completed"
            ),

            h(
              "option",
              {
                value: "Critical"
              },
              "Critical"
            )
          )
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Risk"
          ),

          h(
            "select",
            {
              value:
                form.risk,
              onChange: (e) =>
                change(
                  "risk",
                  e.target.value
                )
            },

            h(
              "option",
              {
                value: "Low"
              },
              "Low"
            ),

            h(
              "option",
              {
                value: "Medium"
              },
              "Medium"
            ),

            h(
              "option",
              {
                value: "High"
              },
              "High"
            ),

            h(
              "option",
              {
                value: "Critical"
              },
              "Critical"
            )
          )
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "h3",
        null,
        "Project Dates"
      ),

      h(
        "div",
        {
          className:
            "project-form-grid"
        },

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Start Date"
          ),

          h("input", {
            type: "date",
            value:
              form.startDate,
            onChange: (e) =>
              change(
                "startDate",
                e.target.value
              )
          })
        ),

        h(
          "div",
          {
            className:
              "form-group"
          },

          h(
            "label",
            null,
            "Expected End Date"
          ),

          h("input", {
            type: "date",
            value:
              form.expectedEndDate,
            onChange: (e) =>
              change(
                "expectedEndDate",
                e.target.value
              )
          })
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-section"
      },

      h(
        "label",
        {
          className:
            "public-checkbox"
        },

        h("input", {
          type: "checkbox",
          checked:
            form.isPublic,
          onChange: (e) =>
            change(
              "isPublic",
              e.target.checked
            )
        }),

        h(
          "span",
          null,
          "Make this project visible on Public Portal"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "project-form-actions"
      },

      h(
        "button",
        {
          type: "button",
          className:
            "secondary-btn",
          onClick: () =>
            navigate(
              "/admin/projects"
            ),
          disabled: loading
        },
        "Cancel"
      ),

      h(
        "button",
        {
          type: "submit",
          className:
            "primary-btn",
          disabled: loading
        },
        loading
          ? "Saving..."
          : editMode
          ? "Update Project"
          : "Create Project"
      )
    )
  );
};

export default ProjectForm;