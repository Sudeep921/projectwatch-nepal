import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createProject
} from "../services/api";

const h = React.createElement;

const AddProjectPage = () => {
  const navigate =
    useNavigate();

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    form,
    setForm
  ] = useState({
    name: "",
    projectCode: "",
    province: "Bagmati",
    district: "",
    municipality: "",
    budget: "",
    progress: 0,
    status: "Active",
    riskLevel: "Low",
    contractor: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    isPublic: true
  });

  const update =
    (key) =>
    (event) => {
      setForm({
        ...form,
        [key]:
          event.target.value
      });
    };

  const submit =
    async (event) => {
      event.preventDefault();

      try {
        setSaving(true);
        setError("");

        await createProject({
          ...form,
          budget:
            Number(form.budget || 0),
          progress:
            Number(
              form.progress || 0
            ),
          latitude:
            form.latitude
              ? Number(
                  form.latitude
                )
              : undefined,
          longitude:
            form.longitude
              ? Number(
                  form.longitude
                )
              : undefined
        });

        navigate("/admin/projects");
      } catch (err) {
        setError(
          err.message ||
            "Failed to create project"
        );
      } finally {
        setSaving(false);
      }
    };

  const input = (
    label,
    key,
    type = "text"
  ) =>
    h(
      "label",
      {
        className:
          "form-field"
      },
      h(
        "span",
        null,
        label
      ),
      h(
        "input",
        {
          type,
          value: form[key],
          onChange:
            update(key),
          required:
            key === "name"
        }
      )
    );

  return h(
    "div",
    {
      className:
        "page add-project-page"
    },

    h(
      "div",
      {
        className:
          "page-heading"
      },

      h(
        "div",
        null,

        h(
          "button",
          {
            className:
              "back-button",
            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },
          "← Back"
        ),

        h(
          "span",
          {
            className:
              "eyebrow"
          },
          "PROJECT REGISTRY"
        ),

        h(
          "h1",
          null,
          "Add New Government Project"
        ),

        h(
          "p",
          null,
          "Register a new public development project."
        )
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "form-error"
          },
          error
        )
      : null,

    h(
      "form",
      {
        className:
          "project-form",
        onSubmit: submit
      },

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,
          "Project Information"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },

          input(
            "Project Name",
            "name"
          ),

          input(
            "Project Code",
            "projectCode"
          ),

          input(
            "District",
            "district"
          ),

          input(
            "Municipality",
            "municipality"
          ),

          input(
            "Budget (NPR)",
            "budget",
            "number"
          ),

          input(
            "Progress (%)",
            "progress",
            "number"
          ),

          input(
            "Contractor",
            "contractor"
          ),

          input(
            "Location",
            "location"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,
          "Classification"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },

          h(
            "label",
            {
              className:
                "form-field"
            },
            h(
              "span",
              null,
              "Province"
            ),
            h(
              "select",
              {
                value:
                  form.province,
                onChange:
                  update(
                    "province"
                  )
              },
              [
                "Bagmati",
                "Gandaki",
                "Koshi",
                "Lumbini",
                "Madhesh",
                "Karnali",
                "Sudurpashchim"
              ].map(
                (x) =>
                  h(
                    "option",
                    {
                      key: x
                    },
                    x
                  )
              )
            )
          ),

          h(
            "label",
            {
              className:
                "form-field"
            },
            h(
              "span",
              null,
              "Status"
            ),
            h(
              "select",
              {
                value:
                  form.status,
                onChange:
                  update("status")
              },
              [
                "Active",
                "Delayed",
                "Completed",
                "Critical"
              ].map(
                (x) =>
                  h(
                    "option",
                    {
                      key: x
                    },
                    x
                  )
              )
            )
          ),

          h(
            "label",
            {
              className:
                "form-field"
            },
            h(
              "span",
              null,
              "Risk Level"
            ),
            h(
              "select",
              {
                value:
                  form.riskLevel,
                onChange:
                  update(
                    "riskLevel"
                  )
              },
              [
                "Low",
                "Medium",
                "High",
                "Critical"
              ].map(
                (x) =>
                  h(
                    "option",
                    {
                      key: x
                    },
                    x
                  )
              )
            )
          )
        )
      ),

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,
          "Map Location"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },

          input(
            "Latitude",
            "latitude",
            "number"
          ),

          input(
            "Longitude",
            "longitude",
            "number"
          )
        )
      ),

      h(
        "label",
        {
          className:
            "form-field"
        },

        h(
          "span",
          null,
          "Description"
        ),

        h(
          "textarea",
          {
            rows: 5,
            value:
              form.description,
            onChange:
              update(
                "description"
              )
          }
        )
      ),

      h(
        "div",
        {
          className:
            "form-actions"
        },

        h(
          "button",
          {
            type: "button",
            className:
              "secondary-button",
            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },
          "Cancel"
        ),

        h(
          "button",
          {
            type: "submit",
            className:
              "primary-button",
            disabled: saving
          },
          saving
            ? "Creating..."
            : "Create Project"
        )
      )
    )
  );
};

export default AddProjectPage;