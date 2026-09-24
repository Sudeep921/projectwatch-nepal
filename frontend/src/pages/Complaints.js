import React, {
  useEffect,
  useState
} from "react";

import {
  getComplaints,
  createComplaint,
  getProjects
} from "../services/api";

const Complaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      project: "",
      subject: "",
      description: "",
      location: ""
    });

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        complaintResponse,
        projectResponse
      ] = await Promise.all([
        getComplaints(),
        getProjects()
      ]);

      setComplaints(
        complaintResponse?.complaints ||
          complaintResponse?.data ||
          []
      );

      setProjects(
        projectResponse?.projects ||
          projectResponse?.data ||
          []
      );
    } catch (err) {
      console.error(
        "Complaint loading failed:",
        err
      );

      setError(
        err.message ||
          "Unable to load complaints."
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

  const submitComplaint =
    async (event) => {
      event.preventDefault();

      try {
        setSaving(true);
        setError("");

        await createComplaint(
          form
        );

        setForm({
          project: "",
          subject: "",
          description: "",
          location: ""
        });

        setShowForm(false);

        await loadData();
      } catch (err) {
        console.error(
          "Complaint creation failed:",
          err
        );

        setError(
          err.message ||
            "Unable to submit complaint."
        );
      } finally {
        setSaving(false);
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
          "CITIZEN OVERSIGHT"
        ),

        React.createElement(
          "h1",
          null,
          "Complaints"
        ),

        React.createElement(
          "p",
          null,
          "Review public complaints and project-related concerns."
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
          ? "Close Form"
          : "+ New Complaint"
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
              "report-form-card"
          },

          React.createElement(
            "span",
            {
              className:
                "page-eyebrow"
            },
            "PUBLIC REPORT"
          ),

          React.createElement(
            "h2",
            null,
            "Submit Complaint"
          ),

          React.createElement(
            "p",
            null,
            "Provide clear information about a project-related concern."
          ),

          React.createElement(
            "form",
            {
              onSubmit:
                submitComplaint
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
                      handleChange
                  },

                  React.createElement(
                    "option",
                    {
                      value:
                        ""
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
                  "Subject"
                ),

                React.createElement(
                  "input",
                  {
                    name:
                      "subject",
                    value:
                      form.subject,
                    onChange:
                      handleChange,
                    placeholder:
                      "Complaint subject",
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
                  "Location"
                ),

                React.createElement(
                  "input",
                  {
                    name:
                      "location",
                    value:
                      form.location,
                    onChange:
                      handleChange,
                    placeholder:
                      "Project site / location"
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
                    rows: 6,
                    placeholder:
                      "Describe the concern in detail...",
                    required: true
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
                    saving
                },
                saving
                  ? "Submitting..."
                  : "Submit Complaint"
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
          "Loading complaints..."
        )
      : complaints.length === 0
      ? React.createElement(
          "div",
          {
            className:
              "empty-state"
          },

          React.createElement(
            "h3",
            null,
            "No complaints yet"
          ),

          React.createElement(
            "p",
            null,
            "Citizen complaints and project concerns will appear here."
          )
        )
      : React.createElement(
          "div",
          {
            className:
              "reports-list"
          },

          complaints.map(
            (complaint) =>
              React.createElement(
                "div",
                {
                  className:
                    "report-card",
                  key:
                    complaint._id ||
                    complaint.id
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
                    complaint.subject ||
                      "Project Complaint"
                  ),

                  React.createElement(
                    "span",
                    {
                      className:
                        "status-badge"
                    },
                    complaint.status ||
                      "Pending"
                  )
                ),

                React.createElement(
                  "p",
                  null,
                  complaint.description ||
                    "No description available."
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
                    typeof complaint.project ===
                      "object"
                      ? complaint.project?.name ||
                        complaint.project?.projectName ||
                        complaint.project?.projectCode ||
                        "General"
                      : complaint.project ||
                        "General"
                  ),

                  React.createElement(
                    "span",
                    null,
                    complaint.location ||
                      "Location not provided"
                  )
                )
              )
          )
        )
  );
};

export default Complaints;