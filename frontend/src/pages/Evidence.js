import React, {
  useEffect,
  useState
} from "react";

import {
  getEvidence,
  uploadEvidence,
  getProjects
} from "../services/api";

const Evidence = () => {
  const [evidence, setEvidence] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [form, setForm] =
    useState({
      project: "",
      evidenceType: "Photo",
      description: ""
    });

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        evidenceResponse,
        projectResponse
      ] = await Promise.all([
        getEvidence(),
        getProjects()
      ]);

      setEvidence(
        evidenceResponse?.evidence ||
          evidenceResponse?.data ||
          []
      );

      setProjects(
        projectResponse?.projects ||
          projectResponse?.data ||
          []
      );
    } catch (err) {
      console.error(
        "Evidence loading failed:",
        err
      );

      setError(
        err.message ||
          "Unable to load evidence."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleUpload =
    async (event) => {
      event.preventDefault();

      if (!file) {
        setError(
          "Please select a file."
        );
        return;
      }

      try {
        setUploading(true);
        setError("");

        const formData =
          new FormData();

        formData.append(
          "project",
          form.project
        );

        formData.append(
          "evidenceType",
          form.evidenceType
        );

        formData.append(
          "description",
          form.description
        );

        formData.append(
          "file",
          file
        );

        await uploadEvidence(
          formData
        );

        setFile(null);

        setForm({
          project: "",
          evidenceType: "Photo",
          description: ""
        });

        setShowForm(false);

        await loadData();
      } catch (err) {
        console.error(
          "Evidence upload failed:",
          err
        );

        setError(
          err.message ||
            "Unable to upload evidence."
        );
      } finally {
        setUploading(false);
      }
    };

  return React.createElement(
    "div",
    {
      className:
        "page-container"
    },

    React.createElement(
      "div",
      {
        className:
          "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "page-eyebrow"
          },
          "PROJECT EVIDENCE"
        ),

        React.createElement(
          "h1",
          null,
          "Evidence"
        ),

        React.createElement(
          "p",
          null,
          "Manage photos, videos and documents collected from project sites."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",
          onClick: () =>
            setShowForm(
              !showForm
            )
        },
        showForm
          ? "Close Upload"
          : "+ Upload Evidence"
      )
    ),

    error
      ? React.createElement(
          "div",
          {
            className:
              "form-error"
          },
          "⚠ ",
          error
        )
      : null,

    showForm
      ? React.createElement(
          "div",
          {
            className:
              "report-form-card evidence-form-card"
          },

          React.createElement(
            "span",
            {
              className:
                "page-eyebrow"
            },
            "FIELD EVIDENCE"
          ),

          React.createElement(
            "h2",
            null,
            "Upload Project Evidence"
          ),

          React.createElement(
            "p",
            null,
            "Upload verified field evidence associated with a government project."
          ),

          React.createElement(
            "form",
            {
              onSubmit:
                handleUpload
            },

            React.createElement(
              "div",
              {
                className:
                  "form-grid"
              },

              React.createElement(
                "div",
                {
                  className:
                    "form-group"
                },

                React.createElement(
                  "label",
                  null,
                  "Project"
                ),

                React.createElement(
                  "select",
                  {
                    name:
                      "project",
                    value:
                      form.project,
                    onChange:
                      handleChange,
                    required: true
                  },

                  React.createElement(
                    "option",
                    {
                      value: ""
                    },
                    "Select project"
                  ),

                  projects.map(
                    (project) =>
                      React.createElement(
                        "option",
                        {
                          key:
                            project._id,
                          value:
                            project._id
                        },
                        project.name
                      )
                  )
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "form-group"
                },

                React.createElement(
                  "label",
                  null,
                  "Evidence Type"
                ),

                React.createElement(
                  "select",
                  {
                    name:
                      "evidenceType",
                    value:
                      form.evidenceType,
                    onChange:
                      handleChange
                  },

                  React.createElement(
                    "option",
                    {
                      value:
                        "Photo"
                    },
                    "Photo"
                  ),

                  React.createElement(
                    "option",
                    {
                      value:
                        "Video"
                    },
                    "Video"
                  ),

                  React.createElement(
                    "option",
                    {
                      value:
                        "Document"
                    },
                    "Document"
                  )
                )
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
                  "Evidence File"
                ),

                React.createElement(
                  "input",
                  {
                    type:
                      "file",
                    accept:
                      "image/*,video/*,.pdf",
                    onChange:
                      (event) =>
                        setFile(
                          event
                            .target
                            .files?.[0] ||
                          null
                        ),
                    required: true
                  }
                )
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
                    name:
                      "description",
                    value:
                      form.description,
                    onChange:
                      handleChange,
                    rows: 5,
                    placeholder:
                      "Describe what this evidence shows..."
                  }
                )
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "modal-footer"
              },

              React.createElement(
                "button",
                {
                  type:
                    "button",
                  className:
                    "secondary-button",
                  onClick: () =>
                    setShowForm(
                      false
                    )
                },
                "Cancel"
              ),

              React.createElement(
                "button",
                {
                  type:
                    "submit",
                  className:
                    "primary-button",
                  disabled:
                    uploading
                },
                uploading
                  ? "Uploading..."
                  : "Upload Evidence"
              )
            )
          )
        )
      : null,

    loading
      ? React.createElement(
          "div",
          {
            className:
              "page-loading"
          },
          "Loading evidence..."
        )
      : evidence.length === 0
      ? React.createElement(
          "div",
          {
            className:
              "empty-state"
          },

          React.createElement(
            "h3",
            null,
            "No evidence uploaded"
          ),

          React.createElement(
            "p",
            null,
            "Photos, videos and documents collected during field inspections will appear here."
          ),

          React.createElement(
            "button",
            {
              className:
                "primary-button",
              onClick: () =>
                setShowForm(
                  true
                )
            },
            "+ Upload First Evidence"
          )
        )
      : React.createElement(
          "div",
          {
            className:
              "reports-list"
          },

          evidence.map(
            (item) =>
              React.createElement(
                "div",
                {
                  className:
                    "report-card",
                  key:
                    item._id ||
                    item.id
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "report-card-header"
                  },

                  React.createElement(
                    "strong",
                    null,
                    item.project?.name ||
                      item.project ||
                      "Government Project"
                  ),

                  React.createElement(
                    "span",
                    {
                      className:
                        "status-badge"
                    },
                    item.evidenceType ||
                      item.type ||
                      "Evidence"
                  )
                ),

                React.createElement(
                  "p",
                  null,
                  item.description ||
                    "Project evidence record."
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "report-meta"
                  },

                  React.createElement(
                    "span",
                    null,
                    item.originalName ||
                      item.filename ||
                      "Uploaded file"
                  ),

                  React.createElement(
                    "span",
                    null,
                    item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "Recent"
                  )
                )
              )
          )
        )
  );
};

export default Evidence;