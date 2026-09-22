import React, {
  useEffect,
  useState
} from "react";

import {
  getFieldReports,
  createFieldReport,
  getProjects
} from "../services/api";

const FieldReports = () => {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [gpsLoading, setGpsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    project: "",
    reportedProgress: "",
    observation: "",
    location: "",
    latitude: "",
    longitude: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        reportResponse,
        projectResponse
      ] = await Promise.all([
        getFieldReports(),
        getProjects()
      ]);

      setReports(
        reportResponse?.reports ||
          reportResponse?.data ||
          []
      );

      setProjects(
        projectResponse?.projects ||
          projectResponse?.data ||
          []
      );
    } catch (err) {
      console.error(
        "Field report loading failed:",
        err
      );

      setError(
        err.message ||
          "Unable to load field reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const getGPS = () => {
    if (!navigator.geolocation) {
      window.alert(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setForm((previous) => ({
          ...previous,
          latitude:
            latitude.toFixed(6),
          longitude:
            longitude.toFixed(6),
          location:
            `${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`
        }));

        setGpsLoading(false);
      },
      (error) => {
        console.error(
          "GPS error:",
          error
        );

        setGpsLoading(false);

        window.alert(
          "Unable to get your current GPS location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const resetForm = () => {
    setForm({
      project: "",
      reportedProgress: "",
      observation: "",
      location: "",
      latitude: "",
      longitude: ""
    });
  };

  const submitReport = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createFieldReport({
        project: form.project,
        reportedProgress:
          Number(
            form.reportedProgress
          ),
        observation:
          form.observation,
        location:
          form.location,
        latitude:
          form.latitude
            ? Number(form.latitude)
            : undefined,
        longitude:
          form.longitude
            ? Number(form.longitude)
            : undefined
      });

      resetForm();
      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error(
        "Field report creation failed:",
        err
      );

      setError(
        err.message ||
          "Unable to submit field report."
      );
    } finally {
      setSaving(false);
    }
  };

  const getProjectName = (report) => {
    if (
      report.project &&
      typeof report.project === "object"
    ) {
      return (
        report.project.name ||
        "Government Project"
      );
    }

    const project = projects.find(
      (item) =>
        item._id === report.project
    );

    return (
      project?.name ||
      report.project ||
      "Government Project"
    );
  };

  return React.createElement(
    "div",
    {
      className:
        "page-container field-reports-page"
    },

    React.createElement(
      "div",
      {
        className: "page-header"
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
          "FIELD MONITORING"
        ),

        React.createElement(
          "h1",
          null,
          "Field Reports"
        ),

        React.createElement(
          "p",
          null,
          "Review and submit field inspection reports from project sites."
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
          : "+ New Field Report"
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
            "div",
            {
              className:
                "report-form-title"
            },

            React.createElement(
              "span",
              {
                className:
                  "page-eyebrow"
              },
              "SITE INSPECTION"
            ),

            React.createElement(
              "h2",
              null,
              "Submit Field Report"
            ),

            React.createElement(
              "p",
              null,
              "Record the latest condition and progress observed at the project site."
            )
          ),

          React.createElement(
            "form",
            {
              onSubmit:
                submitReport
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
                    name: "project",
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
                        project.name ||
                          "Government Project"
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
                  "Reported Progress (%)"
                ),

                React.createElement(
                  "input",
                  {
                    type: "number",
                    name:
                      "reportedProgress",
                    min: 0,
                    max: 100,
                    value:
                      form.reportedProgress,
                    onChange:
                      handleChange,
                    placeholder:
                      "e.g. 45",
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
                  "Site Location"
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "location-input-row"
                  },

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
                        "GPS location or site address"
                    }
                  ),

                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className:
                        "gps-button",
                      onClick:
                        getGPS,
                      disabled:
                        gpsLoading
                    },
                    gpsLoading
                      ? "Getting GPS..."
                      : "⌖ Get GPS"
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
                  "Latitude"
                ),

                React.createElement(
                  "input",
                  {
                    name:
                      "latitude",
                    value:
                      form.latitude,
                    onChange:
                      handleChange,
                    placeholder:
                      "28.394900"
                  }
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
                  "Longitude"
                ),

                React.createElement(
                  "input",
                  {
                    name:
                      "longitude",
                    value:
                      form.longitude,
                    onChange:
                      handleChange,
                    placeholder:
                      "84.124000"
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
                  "Site Observation"
                ),

                React.createElement(
                  "textarea",
                  {
                    name:
                      "observation",
                    value:
                      form.observation,
                    onChange:
                      handleChange,
                    rows: 6,
                    placeholder:
                      "Describe the current site condition, work progress, materials, workers, delays or other observations...",
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
                  type: "button",
                  className:
                    "secondary-button",
                  onClick: () => {
                    resetForm();
                    setShowForm(false);
                  }
                },
                "Cancel"
              ),

              React.createElement(
                "button",
                {
                  type: "submit",
                  className:
                    "primary-button",
                  disabled:
                    saving
                },
                saving
                  ? "Submitting..."
                  : "Submit Field Report"
              )
            )
          )
        )
      : null,

    React.createElement(
      "div",
      {
        className:
          "reports-section"
      },

      React.createElement(
        "div",
        {
          className:
            "section-heading"
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
            "INSPECTION RECORDS"
          ),

          React.createElement(
            "h2",
            null,
            "Inspection Reports"
          ),

          React.createElement(
            "p",
            null,
            `${reports.length} field report${
              reports.length === 1
                ? ""
                : "s"
            } recorded`
          )
        )
      ),

      loading
        ? React.createElement(
            "div",
            {
              className:
                "page-loading"
            },
            "Loading field reports..."
          )
        : reports.length === 0
        ? React.createElement(
            "div",
            {
              className:
                "empty-state"
            },

            React.createElement(
              "h3",
              null,
              "No field reports yet"
            ),

            React.createElement(
              "p",
              null,
              "Start monitoring a project by submitting your first field inspection report."
            ),

            React.createElement(
              "button",
              {
                className:
                  "primary-button",
                onClick: () =>
                  setShowForm(true)
              },
              "+ Create First Report"
            )
          )
        : React.createElement(
            "div",
            {
              className:
                "reports-list"
            },

            reports.map(
              (report) =>
                React.createElement(
                  "div",
                  {
                    className:
                      "report-card",
                    key:
                      report._id ||
                      report.id
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
                      getProjectName(
                        report
                      )
                    ),

                    React.createElement(
                      "span",
                      {
                        className:
                          "status-badge"
                      },
                      report.status ||
                        "Submitted"
                    )
                  ),

                  React.createElement(
                    "p",
                    null,
                    report.observation ||
                      "No observation available."
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
                      `Progress: ${
                        report.reportedProgress ??
                        report.progress ??
                        0
                      }%`
                    ),

                    React.createElement(
                      "span",
                      null,
                      report.location ||
                        "Location not provided"
                    ),

                    report.latitude &&
                    report.longitude
                      ? React.createElement(
                          "span",
                          null,
                          `GPS: ${report.latitude}, ${report.longitude}`
                        )
                      : null
                  )
                )
            )
          )
    )
  );
};

export default FieldReports;