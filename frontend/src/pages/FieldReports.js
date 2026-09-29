import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getFieldReports,
  getProjects,
  deleteFieldReport
} from "../services/api";

const h = React.createElement;

const FieldReports = () => {
  const [reports, setReports] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [projectFilter, setProjectFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [officerFilter, setOfficerFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const pageSize = 8;

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

      const reportData =
        reportResponse?.reports ||
        reportResponse?.data ||
        [];

      const projectData =
        projectResponse?.projects ||
        projectResponse?.data ||
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
        err.message ||
        "Failed to load field reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProjectName = (report) => {
    if (
      report.project &&
      typeof report.project ===
        "object"
    ) {
      return (
        report.project.name ||
        report.project.projectName ||
        report.project.projectCode ||
        "Unknown Project"
      );
    }

    const project =
      projects.find(
        (item) =>
          String(item._id) ===
          String(report.project)
      );

    return (
      project?.name ||
      project?.projectName ||
      project?.projectCode ||
      "Unknown Project"
    );
  };

  const getOfficerName = (report) => {
    if (
      report.officer &&
      typeof report.officer ===
        "object"
    ) {
      return (
        report.officer.name ||
        report.officer.fullName ||
        report.officer.email ||
        "Unknown Officer"
      );
    }

    return (
      report.officerName ||
      report.createdByName ||
      "Unknown Officer"
    );
  };

  const getProgress = (report) => {
    const value =
      report.progress ??
      report.reportedProgress ??
      report.projectProgress ??
      0;

    const number =
      Number(value);

    return Number.isFinite(number)
      ? Math.min(
          100,
          Math.max(0, number)
        )
      : 0;
  };

  const getStatus = (report) => {
    return String(
      report.status ||
      report.reportStatus ||
      "Submitted"
    ).toLowerCase();
  };

  const getDate = (report) => {
    return (
      report.reportDate ||
      report.createdAt ||
      report.date
    );
  };

  const officers = useMemo(() => {
    const names = reports
      .map(getOfficerName)
      .filter(Boolean);

    return [
      ...new Set(names)
    ].sort();
  }, [reports, projects]);

  const filteredReports =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return reports.filter(
        (report) => {
          const projectName =
            getProjectName(
              report
            ).toLowerCase();

          const officerName =
            getOfficerName(
              report
            ).toLowerCase();

          const remarks =
            String(
              report.remarks ||
              report.description ||
              report.notes ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !query ||
            projectName.includes(
              query
            ) ||
            officerName.includes(
              query
            ) ||
            remarks.includes(
              query
            );

          const reportProject =
            report.project &&
            typeof report.project ===
              "object"
              ? report.project._id
              : report.project;

          const matchesProject =
            projectFilter === "all" ||
            String(
              reportProject
            ) ===
              String(
                projectFilter
              );

          const matchesStatus =
            statusFilter === "all" ||
            getStatus(report) ===
              statusFilter;

          const matchesOfficer =
            officerFilter === "all" ||
            getOfficerName(
              report
            ) === officerFilter;

          let matchesDate = true;

          if (dateFilter !== "all") {
            const dateValue =
              getDate(report);

            if (dateValue) {
              const reportDate =
                new Date(
                  dateValue
                );

              const now =
                new Date();

              const diff =
                now.getTime() -
                reportDate.getTime();

              const days =
                diff /
                (1000 * 60 * 60 * 24);

              if (
                dateFilter === "today"
              ) {
                matchesDate =
                  reportDate.toDateString() ===
                  now.toDateString();
              }

              if (
                dateFilter === "7days"
              ) {
                matchesDate =
                  days >= 0 &&
                  days <= 7;
              }

              if (
                dateFilter === "30days"
              ) {
                matchesDate =
                  days >= 0 &&
                  days <= 30;
              }
            }
          }

          return (
            matchesSearch &&
            matchesProject &&
            matchesStatus &&
            matchesOfficer &&
            matchesDate
          );
        }
      );
    }, [
      reports,
      projects,
      search,
      projectFilter,
      statusFilter,
      officerFilter,
      dateFilter
    ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    projectFilter,
    statusFilter,
    officerFilter,
    dateFilter
  ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredReports.length /
          pageSize
      )
    );

  const safePage =
    Math.min(
      page,
      totalPages
    );

  const paginatedReports =
    filteredReports.slice(
      (safePage - 1) *
        pageSize,
      safePage *
        pageSize
    );

  const summary = useMemo(() => {
    const total =
      reports.length;

    const completed =
      reports.filter(
        (report) =>
          getStatus(report) ===
          "completed"
      ).length;

    const inProgress =
      reports.filter(
        (report) =>
          getStatus(report) ===
          "in progress" ||
          getStatus(report) ===
          "in_progress"
      ).length;

    const critical =
      reports.filter(
        (report) =>
          getStatus(report) ===
            "critical" ||
          Number(
            report.progress ??
            report.reportedProgress ??
            0
          ) >= 100
      ).length;

    const average =
      total
        ? Math.round(
            reports.reduce(
              (sum, report) =>
                sum +
                getProgress(
                  report
                ),
              0
            ) / total
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      critical,
      average
    };
  }, [reports]);

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(
        value
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );
    } catch {
      return "—";
    }
  };

  const clearFilters = () => {
    setSearch("");
    setProjectFilter("all");
    setStatusFilter("all");
    setOfficerFilter("all");
    setDateFilter("all");
  };

  const handleDelete = async (
    report
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this field report?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFieldReport(
        report._id
      );

      setReports(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              report._id
          )
      );
    } catch (err) {
      window.alert(
        err.message ||
        "Failed to delete field report."
      );
    }
  };

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
            "page-loading"
        },
        "Loading field reports..."
      )
    );
  }

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
          "Monitor field progress and project implementation reports."
        )
      ),

      h(
        "button",
        {
          className:
            "field-report-refresh-btn",
          onClick: loadData
        },
        "↻ Refresh"
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "field-report-error"
          },
          error
        )
      : null,

    h(
      "div",
      {
        className:
          "field-report-summary"
      },

      h(
        "div",
        {
          className:
            "field-report-summary-card"
        },
        h(
          "div",
          {
            className:
              "field-report-summary-icon"
          },
          "📋"
        ),
        h(
          "div",
          {
            className:
              "field-report-summary-content"
          },
          h(
            "strong",
            {
              className:
                "field-report-summary-value"
            },
            summary.total
          ),
          h(
            "span",
            {
              className:
                "field-report-summary-label"
            },
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
          "div",
          {
            className:
              "field-report-summary-icon"
          },
          "🔄"
        ),
        h(
          "div",
          {
            className:
              "field-report-summary-content"
          },
          h(
            "strong",
            {
              className:
                "field-report-summary-value"
            },
            summary.inProgress
          ),
          h(
            "span",
            {
              className:
                "field-report-summary-label"
            },
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
          "div",
          {
            className:
              "field-report-summary-icon"
          },
          "✓"
        ),
        h(
          "div",
          {
            className:
              "field-report-summary-content"
          },
          h(
            "strong",
            {
              className:
                "field-report-summary-value"
            },
            summary.completed
          ),
          h(
            "span",
            {
              className:
                "field-report-summary-label"
            },
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
          "div",
          {
            className:
              "field-report-summary-icon"
          },
          "📈"
        ),
        h(
          "div",
          {
            className:
              "field-report-summary-content"
          },
          h(
            "strong",
            {
              className:
                "field-report-summary-value"
            },
            `${summary.average}%`
          ),
          h(
            "span",
            {
              className:
                "field-report-summary-label"
            },
            "Average Progress"
          )
        )
      )
    ),

    h(
      "div",
      {
        className:
          "field-report-filters"
      },

      h(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) =>
            setSearch(
              e.target.value
            ),
          placeholder:
            "Search project, officer, remarks..."
        }
      ),

      h(
        "select",
        {
          value: projectFilter,
          onChange: (e) =>
            setProjectFilter(
              e.target.value
            )
        },
        h(
          "option",
          { value: "all" },
          "All Projects"
        ),

        projects.map(
          (project) =>
            h(
              "option",
              {
                key:
                  project._id,
                value:
                  project._id
              },
              project.name ||
                project.projectName ||
                project.projectCode
            )
        )
      ),

      h(
        "select",
        {
          value: officerFilter,
          onChange: (e) =>
            setOfficerFilter(
              e.target.value
            )
        },
        h(
          "option",
          { value: "all" },
          "All Officers"
        ),

        officers.map(
          (officer) =>
            h(
              "option",
              {
                key: officer,
                value: officer
              },
              officer
            )
        )
      ),

      h(
        "select",
        {
          value: statusFilter,
          onChange: (e) =>
            setStatusFilter(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Status"
        ),

        h(
          "option",
          { value: "submitted" },
          "Submitted"
        ),

        h(
          "option",
          { value: "in progress" },
          "In Progress"
        ),

        h(
          "option",
          { value: "completed" },
          "Completed"
        ),

        h(
          "option",
          { value: "critical" },
          "Critical"
        )
      ),

      h(
        "select",
        {
          value: dateFilter,
          onChange: (e) =>
            setDateFilter(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Dates"
        ),

        h(
          "option",
          { value: "today" },
          "Today"
        ),

        h(
          "option",
          { value: "7days" },
          "Last 7 Days"
        ),

        h(
          "option",
          { value: "30days" },
          "Last 30 Days"
        )
      ),

      h(
        "button",
        {
          className:
            "field-report-clear-btn",
          onClick: clearFilters
        },
        "Clear Filters"
      )
    ),

    h(
      "div",
      {
        className:
          "field-report-results-info"
      },
      `Showing ${
        filteredReports.length
      } of ${
        reports.length
      } reports`
    ),

    h(
      "div",
      {
        className:
          "field-report-table-wrapper"
      },

      filteredReports.length ===
      0
        ? h(
            "div",
            {
              className:
                "field-report-empty"
            },

            h(
              "div",
              null,
              "📋"
            ),

            h(
              "strong",
              null,
              "No field reports found"
            ),

            h(
              "p",
              null,
              "Try changing your search or filters."
            )
          )
        : h(
            "table",
            {
              className:
                "field-report-table"
            },

            h(
              "thead",
              null,

              h(
                "tr",
                null,

                h(
                  "th",
                  null,
                  "Project"
                ),

                h(
                  "th",
                  null,
                  "Officer"
                ),

                h(
                  "th",
                  null,
                  "Progress"
                ),

                h(
                  "th",
                  null,
                  "Status"
                ),

                h(
                  "th",
                  null,
                  "Report Date"
                ),

                h(
                  "th",
                  null,
                  "Remarks"
                ),

                h(
                  "th",
                  null,
                  "Action"
                )
              )
            ),

            h(
              "tbody",
              null,

              paginatedReports.map(
                (report) => {
                  const progress =
                    getProgress(
                      report
                    );

                  const status =
                    getStatus(
                      report
                    );

                  return h(
                    "tr",
                    {
                      key:
                        report._id
                    },

                    h(
                      "td",
                      null,

                      h(
                        "strong",
                        null,
                        getProjectName(
                          report
                        )
                      )
                    ),

                    h(
                      "td",
                      null,
                      getOfficerName(
                        report
                      )
                    ),

                    h(
                      "td",
                      null,

                      h(
                        "div",
                        {
                          className:
                            "field-report-progress"
                        },

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
                                  `${progress}%`
                              }
                            }
                          )
                        ),

                        h(
                          "span",
                          null,
                          `${progress}%`
                        )
                      )
                    ),

                    h(
                      "td",
                      null,

                      h(
                        "span",
                        {
                          className:
                            `field-report-status ${status.replace(
                              /\s+/g,
                              "-"
                            )}`
                        },
                        status
                      )
                    ),

                    h(
                      "td",
                      null,
                      formatDate(
                        getDate(
                          report
                        )
                      )
                    ),

                    h(
                      "td",
                      {
                        className:
                          "field-report-remarks"
                      },
                      report.remarks ||
                        report.description ||
                        report.notes ||
                        "—"
                    ),

                    h(
                      "td",
                      null,

                      h(
                        "button",
                        {
                          className:
                            "field-report-delete-btn",
                          onClick: () =>
                            handleDelete(
                              report
                            )
                        },
                        "Delete"
                      )
                    )
                  );
                }
              )
            )
          )
    ),

    totalPages > 1
      ? h(
          "div",
          {
            className:
              "field-report-pagination"
          },

          h(
            "button",
            {
              disabled:
                safePage <= 1,
              onClick: () =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
            },
            "← Previous"
          ),

          h(
            "span",
            null,
            `Page ${safePage} of ${totalPages}`
          ),

          h(
            "button",
            {
              disabled:
                safePage >=
                totalPages,
              onClick: () =>
                setPage(
                  (current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                )
            },
            "Next →"
          )
        )
      : null
  );
};

export default FieldReports;