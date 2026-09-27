import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getFieldReports,
  createFieldReport,
  getProjects
} from "../services/api";

const h = React.createElement;

const FieldReports = () => {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedProject, setSelectedProject] =
    useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [progressFilter, setProgressFilter] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("newest");

  const [form, setForm] = useState({
    project: "",
    reportedProgress: "",
    observation: "",
    location: "",
    latitude: "",
    longitude: ""
  });

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        reportsResult,
        projectsResult
      ] = await Promise.all([
        getFieldReports(),
        getProjects()
      ]);

      const reportData =
        reportsResult?.reports ??
        reportsResult?.data ??
        reportsResult ??
        [];

      const projectData =
        projectsResult?.projects ??
        projectsResult?.data ??
        projectsResult ??
        [];

      setReports(
        Array.isArray(reportData)
          ? reportData
          : []
      );

      setProjects(
        Array.isArray(projectData)
          ? projectData
          : []
      );
    } catch (err) {
      console.error(
        "FIELD REPORT LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to load field reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================

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

  // ========================================
  // PROJECT HELPERS
  // ========================================

  const getProjectId = (project) => {
    if (!project) {
      return "";
    }

    if (typeof project === "string") {
      return project;
    }

    return (
      project._id ||
      project.id ||
      ""
    );
  };

  const getReportProjectId = (report) => {
    if (!report) {
      return "";
    }

    if (
      typeof report.project === "string"
    ) {
      return report.project;
    }

    return (
      report.project?._id ||
      report.project?.id ||
      report.projectId ||
      ""
    );
  };

  const getReportProjectName = (report) => {
    if (!report) {
      return "Unknown Project";
    }

    if (
      typeof report.project === "object" &&
      report.project
    ) {
      return (
        report.project.projectName ||
        report.project.name ||
        report.project.title ||
        "Unknown Project"
      );
    }

    const project = projects.find(
      (item) =>
        String(
          getProjectId(item)
        ) ===
        String(
          getReportProjectId(report)
        )
    );

    return (
      project?.projectName ||
      project?.name ||
      project?.title ||
      "Unknown Project"
    );
  };

  // ========================================
  // PROGRESS
  // ========================================

  const getProgress = (report) => {
    const value = Number(
      report?.reportedProgress ??
      report?.progress ??
      0
    );

    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, value)
    );
  };

  // ========================================
  // SEARCH
  // ========================================

  const searchedReports = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    if (!search) {
      return reports;
    }

    return reports.filter(
      (report) => {
        const projectName =
          getReportProjectName(
            report
          );

        const observation =
          report?.observation ||
          "";

        const location =
          report?.location ||
          "";

        return (
          projectName
            .toLowerCase()
            .includes(search) ||
          observation
            .toLowerCase()
            .includes(search) ||
          location
            .toLowerCase()
            .includes(search)
        );
      }
    );
  }, [
    reports,
    searchTerm,
    projects
  ]);

  // ========================================
  // FILTER
  // ========================================

  const filteredReports = useMemo(() => {
    let result = [
      ...searchedReports
    ];

    if (
      selectedProject !== "all"
    ) {
      result = result.filter(
        (report) =>
          String(
            getReportProjectId(
              report
            )
          ) ===
          String(
            selectedProject
          )
      );
    }

    if (
      progressFilter ===
      "completed"
    ) {
      result = result.filter(
        (report) =>
          getProgress(report) >= 100
      );
    }

    if (
      progressFilter ===
      "critical"
    ) {
      result = result.filter(
        (report) =>
          getProgress(report) < 30
      );
    }

    if (
      progressFilter ===
      "in-progress"
    ) {
      result = result.filter(
        (report) => {
          const progress =
            getProgress(report);

          return (
            progress >= 30 &&
            progress < 100
          );
        }
      );
    }

    return result;
  }, [
    searchedReports,
    selectedProject,
    progressFilter
  ]);

  // ========================================
  // SORT
  // ========================================

  const sortedReports = useMemo(() => {
    return [
      ...filteredReports
    ].sort(
      (a, b) => {
        const dateA =
          new Date(
            a.createdAt ||
            a.date ||
            0
          ).getTime();

        const dateB =
          new Date(
            b.createdAt ||
            b.date ||
            0
          ).getTime();

        if (
          sortOrder === "oldest"
        ) {
          return dateA - dateB;
        }

        return dateB - dateA;
      }
    );
  }, [
    filteredReports,
    sortOrder
  ]);

  // ========================================
  // LATEST REPORT PER PROJECT
  // ========================================

  const latestReports = useMemo(() => {
    const map = {};

    sortedReports.forEach(
      (report) => {
        const projectId =
          getReportProjectId(
            report
          );

        if (!projectId) {
          return;
        }

        if (!map[projectId]) {
          map[projectId] =
            report;
        }
      }
    );

    return map;
  }, [
    sortedReports
  ]);

  // ========================================
  // SUMMARY
  // ========================================

  const summary = useMemo(() => {
    const total =
      sortedReports.length;

    const completed =
      sortedReports.filter(
        (report) =>
          getProgress(report) >= 100
      ).length;

    const critical =
      sortedReports.filter(
        (report) =>
          getProgress(report) < 30
      ).length;

    const inProgress =
      sortedReports.filter(
        (report) => {
          const progress =
            getProgress(report);

          return (
            progress >= 30 &&
            progress < 100
          );
        }
      ).length;

    return {
      total,
      completed,
      critical,
      inProgress
    };
  }, [
    sortedReports
  ]);

  // ========================================
  // SUBMIT REPORT
  // ========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.project) {
      setError(
        "Please select a project."
      );
      return;
    }

    const progress =
      Number(
        form.reportedProgress
      );

    if (
      Number.isNaN(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      setError(
        "Progress must be between 0 and 100."
      );
      return;
    }

    if (
      !Number.isInteger(progress)
    ) {
      setError(
        "Progress must be a whole number."
      );
      return;
    }

    if (
      form.latitude !== ""
    ) {
      const latitude =
        Number(form.latitude);

      if (
        Number.isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
        setError(
          "Latitude must be between -90 and 90."
        );
        return;
      }
    }

    if (
      form.longitude !== ""
    ) {
      const longitude =
        Number(form.longitude);

      if (
        Number.isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        setError(
          "Longitude must be between -180 and 180."
        );
        return;
      }
    }

    if (
      !form.observation.trim()
    ) {
      setError(
        "Please enter an observation."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        project:
          form.project,

        reportedProgress:
          progress,

        observation:
          form.observation.trim(),

        location:
          form.location.trim()
      };

      if (
        form.latitude !== ""
      ) {
        payload.latitude =
          Number(form.latitude);
      }

      if (
        form.longitude !== ""
      ) {
        payload.longitude =
          Number(form.longitude);
      }

      await createFieldReport(
        payload
      );

      setSuccess(
        progress >= 100
          ? "Field report submitted. Project completed notification should be created automatically."
          : progress < 30
          ? "Field report submitted. Critical alert should be created automatically."
          : "Field report submitted successfully."
      );

      setForm({
        project: "",
        reportedProgress: "",
        observation: "",
        location: "",
        latitude: "",
        longitude: ""
      });

      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error(
        "FIELD REPORT CREATE ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to create field report."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // GPS
  // ========================================

  const handleGPS = () => {
    setError("");

    if (
      !navigator.geolocation
    ) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(
          (previous) => ({
            ...previous,

            latitude:
              position.coords.latitude.toFixed(
                6
              ),

            longitude:
              position.coords.longitude.toFixed(
                6
              )
          })
        );

        setSuccess(
          "Current GPS location added."
        );
      },
      () => {
        setError(
          "Unable to get your current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProject("all");
    setProgressFilter("all");
    setSortOrder("newest");
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return h(
      "div",
      {
        className:
          "field-reports-page"
      },

      h(
        "div",
        {
          className:
            "field-reports-loading"
        },
        "Loading field reports..."
      )
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return h(
    "div",
    {
      className:
        "field-reports-page"
    },

    // ======================================
    // HEADER
    // ======================================

    h(
      "div",
      {
        className:
          "field-reports-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Field Reports"
        ),

        h(
          "p",
          null,
          "Monitor project progress from field updates."
        )
      ),

      h(
        "button",
        {
          className:
            "field-report-add-button",

          onClick: () => {
            setShowForm(
              !showForm
            );

            setError("");
            setSuccess("");
          }
        },

        showForm
          ? "✕ Close"
          : "+ New Field Report"
      )
    ),

    // ======================================
    // SUCCESS
    // ======================================

    success &&
      h(
        "div",
        {
          className:
            "field-report-success"
        },
        success
      ),

    // ======================================
    // ERROR
    // ======================================

    error &&
      h(
        "div",
        {
          className:
            "field-report-error"
        },
        error
      ),

    // ======================================
    // SUMMARY
    // ======================================

    h(
      "div",
      {
        className:
          "field-report-summary-grid"
      },

      h(
        "div",
        {
          className:
            "field-report-summary-card"
        },

        h(
          "span",
          {
            className:
              "field-report-summary-icon"
          },
          "📋"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.total
          ),

          h(
            "span",
            null,
            "Total Reports"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "field-report-summary-card"
        },

        h(
          "span",
          {
            className:
              "field-report-summary-icon"
          },
          "🔄"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.inProgress
          ),

          h(
            "span",
            null,
            "In Progress"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "field-report-summary-card"
        },

        h(
          "span",
          {
            className:
              "field-report-summary-icon"
          },
          "✓"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.completed
          ),

          h(
            "span",
            null,
            "Completed"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "field-report-summary-card"
        },

        h(
          "span",
          {
            className:
              "field-report-summary-icon"
          },
          "⚠"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.critical
          ),

          h(
            "span",
            null,
            "Critical Progress"
          )
        )
      )
    ),

    // ======================================
    // FORM
    // ======================================

    showForm &&
      h(
        "div",
        {
          className:
            "field-report-form-card"
        },

        h(
          "div",
          {
            className:
              "field-report-form-title"
          },
          "Submit Field Report"
        ),

        h(
          "form",
          {
            onSubmit:
              handleSubmit,

            className:
              "field-report-form"
          },

          h(
            "div",
            {
              className:
                "field-report-form-grid"
            },

            // PROJECT
            h(
              "div",
              {
                className:
                  "field-report-field"
              },

              h(
                "label",
                null,
                "Project"
              ),

              h(
                "select",
                {
                  name: "project",
                  value:
                    form.project,
                  onChange:
                    handleChange,
                  required: true
                },

                h(
                  "option",
                  {
                    value: ""
                  },
                  "Select Project"
                ),

                projects.map(
                  (project) =>
                    h(
                      "option",
                      {
                        key:
                          getProjectId(
                            project
                          ),

                        value:
                          getProjectId(
                            project
                          )
                      },

                      project.projectName ||
                        project.name ||
                        project.title ||
                        "Unnamed Project"
                    )
                )
              )
            ),

            // PROGRESS
            h(
              "div",
              {
                className:
                  "field-report-field"
              },

              h(
                "label",
                null,
                "Reported Progress (%)"
              ),

              h(
                "input",
                {
                  type: "number",

                  name:
                    "reportedProgress",

                  value:
                    form.reportedProgress,

                  onChange:
                    handleChange,

                  min: 0,
                  max: 100,
                  step: 1,

                  placeholder:
                    "Example: 65",

                  required: true
                }
              )
            ),

            // OBSERVATION
            h(
              "div",
              {
                className:
                  "field-report-field field-report-full"
              },

              h(
                "label",
                null,
                "Observation"
              ),

              h(
                "textarea",
                {
                  name:
                    "observation",

                  value:
                    form.observation,

                  onChange:
                    handleChange,

                  rows: 4,

                  placeholder:
                    "Describe the current field condition...",

                  required: true
                }
              )
            ),

            // LOCATION
            h(
              "div",
              {
                className:
                  "field-report-field"
              },

              h(
                "label",
                null,
                "Location"
              ),

              h(
                "input",
                {
                  type: "text",

                  name:
                    "location",

                  value:
                    form.location,

                  onChange:
                    handleChange,

                  placeholder:
                    "Example: Kathmandu"
                }
              )
            ),

            // LATITUDE
            h(
              "div",
              {
                className:
                  "field-report-field"
              },

              h(
                "label",
                null,
                "Latitude"
              ),

              h(
                "input",
                {
                  type: "number",

                  name:
                    "latitude",

                  value:
                    form.latitude,

                  onChange:
                    handleChange,

                  step: "any",

                  placeholder:
                    "27.7172"
                }
              )
            ),

            // LONGITUDE
            h(
              "div",
              {
                className:
                  "field-report-field"
              },

              h(
                "label",
                null,
                "Longitude"
              ),

              h(
                "input",
                {
                  type: "number",

                  name:
                    "longitude",

                  value:
                    form.longitude,

                  onChange:
                    handleChange,

                  step: "any",

                  placeholder:
                    "85.3240"
                }
              )
            )
          ),

          // FORM ACTIONS
          h(
            "div",
            {
              className:
                "field-report-form-actions"
            },

            h(
              "button",
              {
                type: "button",

                className:
                  "field-report-gps-button",

                onClick:
                  handleGPS
              },

              "📍 Use Current GPS"
            ),

            h(
              "button",
              {
                type: "button",

                className:
                  "field-report-cancel-button",

                onClick: () => {
                  setShowForm(false);
                  setError("");
                }
              },

              "Cancel"
            ),

            h(
              "button",
              {
                type: "submit",

                className:
                  "field-report-submit-button",

                disabled:
                  submitting
              },

              submitting
                ? "Submitting..."
                : "Submit Report"
            )
          )
        )
      ),

    // ======================================
    // TOOLBAR
    // ======================================

    h(
      "div",
      {
        className:
          "field-report-toolbar"
      },

      h(
        "input",
        {
          type: "search",

          className:
            "field-report-search",

          value:
            searchTerm,

          onChange: (event) =>
            setSearchTerm(
              event.target.value
            ),

          placeholder:
            "Search project, observation..."
        }
      ),

      h(
        "div",
        {
          className:
            "field-report-count"
        },

        h(
          "strong",
          null,
          sortedReports.length
        ),

        " field reports"
      ),

      h(
        "select",
        {
          value:
            selectedProject,

          onChange: (event) =>
            setSelectedProject(
              event.target.value
            ),

          className:
            "field-report-project-filter"
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Projects"
        ),

        projects.map(
          (project) =>
            h(
              "option",
              {
                key:
                  getProjectId(
                    project
                  ),

                value:
                  getProjectId(
                    project
                  )
              },

              project.projectName ||
                project.name ||
                project.title ||
                "Unnamed Project"
            )
        )
      ),

      h(
        "select",
        {
          value:
            progressFilter,

          onChange: (event) =>
            setProgressFilter(
              event.target.value
            ),

          className:
            "field-report-progress-filter"
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Progress"
        ),

        h(
          "option",
          {
            value:
              "in-progress"
          },
          "In Progress"
        ),

        h(
          "option",
          {
            value:
              "completed"
          },
          "Completed"
        ),

        h(
          "option",
          {
            value:
              "critical"
          },
          "Critical (<30%)"
        )
      ),

      h(
        "select",
        {
          value:
            sortOrder,

          onChange: (event) =>
            setSortOrder(
              event.target.value
            ),

          className:
            "field-report-sort"
        },

        h(
          "option",
          {
            value:
              "newest"
          },
          "Newest First"
        ),

        h(
          "option",
          {
            value:
              "oldest"
          },
          "Oldest First"
        )
      ),

      h(
        "button",
        {
          className:
            "field-report-clear-button",

          onClick:
            clearFilters
        },

   
      ),

      h(
        "button",
        {
          className:
            "field-report-refresh-button",

          onClick:
            loadData
        },

        "↻ Refresh"
      )
    ),

    // ======================================
    // EMPTY STATE
    // ======================================

    sortedReports.length === 0

      ? h(
          "div",
          {
            className:
              "field-report-empty"
          },

          searchTerm ||
          selectedProject !== "all" ||
          progressFilter !== "all"

            ? "No field reports match your filters."

            : "No field reports found."
        )

      // ====================================
      // REPORT LIST
      // ====================================

      : h(
          "div",
          {
            className:
              "field-reports-list"
          },

          sortedReports.map(
            (report, index) => {
              const progress =
                getProgress(
                  report
                );

              const projectName =
                getReportProjectName(
                  report
                );

              const reportDate =
                report.createdAt ||
                report.date;

              const projectId =
                getReportProjectId(
                  report
                );

              const latestReport =
                latestReports[
                  projectId
                ];

              const isLatest =
                latestReport ===
                report;

              return h(
                "div",
                {
                  key:
                    report._id ||
                    report.id ||
                    index,

                  className:
                    "field-report-card"
                },

                // CARD TOP
                h(
                  "div",
                  {
                    className:
                      "field-report-card-top"
                  },

                  h(
                    "div",
                    null,

                    h(
                      "div",
                      {
                        className:
                          "field-report-project-name"
                      },

                      projectName
                    ),

                    reportDate &&
                      h(
                        "div",
                        {
                          className:
                            "field-report-date"
                        },

                        new Date(
                          reportDate
                        ).toLocaleString()
                      )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "field-report-progress-number"
                    },

                    progress +
                      "%"
                  )
                ),

                // STATUS BADGE
                progress >= 100
                  ? h(
                      "span",
                      {
                        className:
                          "field-report-completed-badge"
                      },

                      "✓ Completed"
                    )

                  : progress < 30
                  ? h(
                      "span",
                      {
                        className:
                          "field-report-critical-badge"
                      },

                      "⚠ Critical Progress"
                    )

                  : h(
                      "span",
                      {
                        className:
                          "field-report-active-badge"
                      },

                      "● In Progress"
                    ),

                // LATEST BADGE
                isLatest &&
                  h(
                    "span",
                    {
                      className:
                        "field-report-latest"
                    },

                    "Latest Update"
                  ),

                // PROGRESS BAR
                h(
                  "div",
                  {
                    className:
                      "field-report-progress-track"
                  },

                  h(
                    "div",
                    {
                      className:
                        "field-report-progress-fill",

                      style: {
                        width:
                          progress +
                          "%"
                      }
                    }
                  )
                ),

                // PROGRESS LABEL
                h(
                  "div",
                  {
                    className:
                      "field-report-card-progress-label"
                  },

                  "Reported project progress: ",

                  h(
                    "strong",
                    null,

                    progress +
                      "%"
                  )
                ),

                // OBSERVATION
                report.observation &&
                  h(
                    "div",
                    {
                      className:
                        "field-report-observation"
                    },

                    h(
                      "strong",
                      null,
                      "Observation"
                    ),

                    h(
                      "p",
                      null,

                      report.observation
                    )
                  ),

                // LOCATION
                (
                  report.location ||
                  report.latitude ||
                  report.longitude
                ) &&
                  h(
                    "div",
                    {
                      className:
                        "field-report-location"
                    },

                    "📍 ",

                    report.location ||
                      "Field Location",

                    report.latitude &&
                    report.longitude
                      ? " (" +
                        report.latitude +
                        ", " +
                        report.longitude +
                        ")"
                      : ""
                  ),

                // OFFICER
                (
                  report.officer ||
                  report.createdBy
                ) &&
                  h(
                    "div",
                    {
                      className:
                        "field-report-officer"
                    },

                    "👤 ",

                    typeof report.officer ===
                      "object"

                      ? (
                          report.officer.name ||
                          report.officer.fullName ||
                          report.officer.email ||
                          "Field Officer"
                        )

                      : typeof report.createdBy ===
                        "object"

                      ? (
                          report.createdBy.name ||
                          report.createdBy.fullName ||
                          report.createdBy.email ||
                          "Field Officer"
                        )

                      : (
                          report.officer ||
                          report.createdBy
                        )
                  )
              );
            }
          )
        )
  );
};

export default FieldReports;