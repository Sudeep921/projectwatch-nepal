import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getProjects,
  deleteProject
} from "../services/api";

const h = React.createElement;

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     FILTERS
     ========================= */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [riskFilter, setRiskFilter] =
    useState("All Risk");

  const [provinceFilter, setProvinceFilter] =
    useState("All Provinces");

  /* =========================
     SORT
     ========================= */

  const [sortBy, setSortBy] =
    useState("newest");

  /* =========================
     PAGINATION
     ========================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(8);

  /* =========================
     LOAD PROJECTS
     ========================= */

  const loadProjects = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getProjects();

      let data =
        result?.projects ||
        result?.data ||
        result;

      if (
        data &&
        !Array.isArray(data) &&
        Array.isArray(data.projects)
      ) {
        data = data.projects;
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      setProjects(data);
    } catch (err) {
      console.error(
        "LOAD PROJECTS ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to load projects."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================
     INITIAL LOAD
     ========================= */

  useEffect(() => {
    loadProjects();
  }, []);

  /* =========================
     RESET PAGE
     ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    riskFilter,
    provinceFilter,
    sortBy,
    itemsPerPage
  ]);

  /* =========================
     UNIQUE PROVINCES
     ========================= */

  const provinces = useMemo(() => {
    const values = projects
      .map(
        (project) =>
          project.province
      )
      .filter(Boolean);

    return [
      ...new Set(values)
    ];
  }, [projects]);

  /* =========================
     FILTER + SORT
     ========================= */

  const filteredProjects =
    useMemo(() => {
      let result =
        [...projects];

      const searchText =
        search
          .trim()
          .toLowerCase();

      /* SEARCH */

      if (searchText) {
        result =
          result.filter(
            (project) => {
              const name =
                project.name ||
                project.projectName ||
                "";

              const code =
                project.projectCode ||
                project.code ||
                "";

              const contractor =
                project.contractor ||
                project.contractorName ||
                "";

              const province =
                project.province ||
                "";

              const district =
                project.district ||
                "";

              const municipality =
                project.municipality ||
                "";

              const combined =
                `${name} ${code} ${contractor} ${province} ${district} ${municipality}`
                  .toLowerCase();

              return combined.includes(
                searchText
              );
            }
          );
      }

      /* STATUS */

      if (
        statusFilter !==
        "All Status"
      ) {
        result =
          result.filter(
            (project) => {
              const status =
                String(
                  project.status ||
                  ""
                ).toLowerCase();

              return (
                status ===
                statusFilter.toLowerCase()
              );
            }
          );
      }

      /* RISK */

      if (
        riskFilter !==
        "All Risk"
      ) {
        result =
          result.filter(
            (project) => {
              const risk =
                String(
                  project.riskLevel ||
                  project.risk ||
                  ""
                ).toLowerCase();

              return (
                risk ===
                riskFilter.toLowerCase()
              );
            }
          );
      }

      /* PROVINCE */

      if (
        provinceFilter !==
        "All Provinces"
      ) {
        result =
          result.filter(
            (project) =>
              String(
                project.province ||
                ""
              ).toLowerCase() ===
              provinceFilter.toLowerCase()
          );
      }

      /* SORT */

      result.sort(
        (a, b) => {
          const progressA =
            Number(
              a.progress ??
              a.completionPercentage ??
              0
            );

          const progressB =
            Number(
              b.progress ??
              b.completionPercentage ??
              0
            );

          const budgetA =
            Number(
              a.budget ||
              a.totalBudget ||
              0
            );

          const budgetB =
            Number(
              b.budget ||
              b.totalBudget ||
              0
            );

          const dateA =
            new Date(
              a.createdAt ||
              a.startDate ||
              0
            ).getTime();

          const dateB =
            new Date(
              b.createdAt ||
              b.startDate ||
              0
            ).getTime();

          if (
            sortBy ===
            "progress-high"
          ) {
            return (
              progressB -
              progressA
            );
          }

          if (
            sortBy ===
            "progress-low"
          ) {
            return (
              progressA -
              progressB
            );
          }

          if (
            sortBy ===
            "budget-high"
          ) {
            return (
              budgetB -
              budgetA
            );
          }

          if (
            sortBy ===
            "budget-low"
          ) {
            return (
              budgetA -
              budgetB
            );
          }

          if (
            sortBy ===
            "oldest"
          ) {
            return (
              dateA -
              dateB
            );
          }

          return (
            dateB -
            dateA
          );
        }
      );

      return result;
    }, [
      projects,
      search,
      statusFilter,
      riskFilter,
      provinceFilter,
      sortBy
    ]);

  /* =========================
     PAGINATION
     ========================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProjects.length /
        itemsPerPage
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safePage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex +
    itemsPerPage;

  const visibleProjects =
    filteredProjects.slice(
      startIndex,
      endIndex
    );

  /* =========================
     CLEAR FILTERS
     ========================= */

  const clearFilters = () => {
    setSearch("");

    setStatusFilter(
      "All Status"
    );

    setRiskFilter(
      "All Risk"
    );

    setProvinceFilter(
      "All Provinces"
    );

    setSortBy("newest");

    setCurrentPage(1);
  };

  /* =========================
     DELETE PROJECT
     ========================= */

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(id);

      setProjects(
        (previous) =>
          previous.filter(
            (project) =>
              String(
                project._id ||
                project.id
              ) !==
              String(id)
          )
      );
    } catch (err) {
      console.error(
        "DELETE PROJECT ERROR:",
        err
      );

      window.alert(
        err?.message ||
        "Failed to delete project."
      );
    }
  };

  /* =========================
     HELPERS
     ========================= */

  const getProjectId = (
    project
  ) => {
    return (
      project._id ||
      project.id
    );
  };

  const getProjectName = (
    project
  ) => {
    return (
      project.name ||
      project.projectName ||
      project.title ||
      "Unnamed Project"
    );
  };

  const getProjectCode = (
    project
  ) => {
    return (
      project.projectCode ||
      project.code ||
      project.projectId ||
      "N/A"
    );
  };

  const getProgress = (
    project
  ) => {
    return Math.min(
      100,
      Math.max(
        0,
        Number(
          project.progress ??
          project.completionPercentage ??
          project.completion ??
          0
        )
      )
    );
  };

  const formatBudget = (
    value
  ) => {
    const amount =
      Number(value || 0);

    if (!amount) {
      return "NPR 0";
    }

    return (
      "NPR " +
      amount.toLocaleString(
        "en-IN"
      )
    );
  };

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status || ""
      ).toLowerCase();

    if (
      value.includes(
        "complete"
      )
    ) {
      return "projects-status-completed";
    }

    if (
      value.includes(
        "delay"
      )
    ) {
      return "projects-status-delayed";
    }

    if (
      value.includes(
        "critical"
      )
    ) {
      return "projects-status-critical";
    }

    if (
      value.includes(
        "active"
      ) ||
      value.includes(
        "ongoing"
      ) ||
      value.includes(
        "progress"
      )
    ) {
      return "projects-status-active";
    }

    return "projects-status-default";
  };

  const getRiskClass = (
    risk
  ) => {
    const value =
      String(
        risk || ""
      ).toLowerCase();

    if (
      value.includes(
        "critical"
      )
    ) {
      return "projects-risk-critical";
    }

    if (
      value.includes(
        "high"
      )
    ) {
      return "projects-risk-high";
    }

    if (
      value.includes(
        "medium"
      )
    ) {
      return "projects-risk-medium";
    }

    if (
      value.includes(
        "low"
      )
    ) {
      return "projects-risk-low";
    }

    return "projects-risk-default";
  };

  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return h(
      "div",
      {
        className:
          "projects-page-loading"
      },

      h(
        "div",
        {
          className:
            "projects-loading-icon"
        },
        "⟳"
      ),

      h(
        "h3",
        null,
        "Loading Projects..."
      ),

      h(
        "p",
        null,
        "Please wait."
      )
    );
  }

  /* =========================
     PAGE
     ========================= */

  return h(
    "div",
    {
      className:
        "page projects-page"
    },

    /* =========================
       HEADER
       ========================= */

    h(
      "div",
      {
        className:
          "projects-page-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Projects"
        ),

        h(
          "p",
          null,
          "Manage and monitor government projects"
        )
      ),

      h(
        "div",
        {
          className:
            "projects-header-actions"
        },

        /* REFRESH */

        h(
          "button",
          {
            className:
              "projects-refresh-btn",

            onClick: () =>
              loadProjects(true),

            disabled:
              refreshing
          },

          refreshing
            ? "⟳ Refreshing..."
            : "↻ Refresh"
        ),

        /* ADD PROJECT */

        h(
          "button",
          {
            className:
              "projects-add-btn",

            onClick: () =>
              navigate(
                "/admin/projects/new"
              )
          },

          "+ Add Project"
        )
      )
    ),

    /* =========================
       ERROR
       ========================= */

    error
      ? h(
          "div",
          {
            className:
              "projects-error"
          },

          "⚠️ ",

          error
        )
      : null,

    /* =========================
       FILTER PANEL
       ========================= */

    h(
      "div",
      {
        className:
          "projects-filter-panel"
      },

      /* SEARCH */

      h(
        "div",
        {
          className:
            "projects-search-box"
        },

        h(
          "span",
          {
            className:
              "projects-search-icon"
          },

          "⌕"
        ),

        h(
          "input",
          {
            type: "text",

            value: search,

            placeholder:
              "Search by project name, code, contractor, location...",

            onChange: (
              event
            ) =>
              setSearch(
                event.target.value
              )
          }
        )
      ),

      /* STATUS */

      h(
        "select",
        {
          value: statusFilter,

          onChange: (
            event
          ) =>
            setStatusFilter(
              event.target.value
            )
        },

        h(
          "option",
          null,
          "All Status"
        ),

        h(
          "option",
          null,
          "Active"
        ),

        h(
          "option",
          null,
          "Delayed"
        ),

        h(
          "option",
          null,
          "Completed"
        ),

        h(
          "option",
          null,
          "Critical"
        )
      ),

      /* RISK */

      h(
        "select",
        {
          value: riskFilter,

          onChange: (
            event
          ) =>
            setRiskFilter(
              event.target.value
            )
        },

        h(
          "option",
          null,
          "All Risk"
        ),

        h(
          "option",
          null,
          "Low"
        ),

        h(
          "option",
          null,
          "Medium"
        ),

        h(
          "option",
          null,
          "High"
        ),

        h(
          "option",
          null,
          "Critical"
        )
      ),

      /* PROVINCE */

      h(
        "select",
        {
          value:
            provinceFilter,

          onChange: (
            event
          ) =>
            setProvinceFilter(
              event.target.value
            )
        },

        h(
          "option",
          null,
          "All Provinces"
        ),

        provinces.map(
          (province) =>
            h(
              "option",
              {
                key: province,

                value: province
              },

              province
            )
        )
      ),

      /* SORT */

      h(
        "select",
        {
          value: sortBy,

          onChange: (
            event
          ) =>
            setSortBy(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "newest"
          },
          "Newest First"
        ),

        h(
          "option",
          {
            value: "oldest"
          },
          "Oldest First"
        ),

        h(
          "option",
          {
            value:
              "progress-high"
          },
          "Progress: High → Low"
        ),

        h(
          "option",
          {
            value:
              "progress-low"
          },
          "Progress: Low → High"
        ),

        h(
          "option",
          {
            value:
              "budget-high"
          },
          "Budget: High → Low"
        ),

        h(
          "option",
          {
            value:
              "budget-low"
          },
          "Budget: Low → High"
        )
      ),

      /* CLEAR */

      h(
        "button",
        {
          className:
            "projects-clear-btn",

          onClick:
            clearFilters
        },

        "Clear Filters"
      )
    ),

    /* =========================
       RESULT SUMMARY
       ========================= */

    h(
      "div",
      {
        className:
          "projects-result-bar"
      },

      h(
        "div",
        null,

        h(
          "strong",
          null,
          filteredProjects.length
        ),

        h(
          "span",
          null,
          " projects found"
        )
      ),

      h(
        "div",
        {
          className:
            "projects-page-size"
        },

        h(
          "span",
          null,
          "Show"
        ),

        h(
          "select",
          {
            value:
              itemsPerPage,

            onChange: (
              event
            ) =>
              setItemsPerPage(
                Number(
                  event.target
                    .value
                )
              )
          },

          h(
            "option",
            {
              value: 8
            },
            "8"
          ),

          h(
            "option",
            {
              value: 12
            },
            "12"
          ),

          h(
            "option",
            {
              value: 20
            },
            "20"
          ),

          h(
            "option",
            {
              value: 50
            },
            "50"
          )
        )
      )
    ),

    /* =========================
       PROJECTS
       ========================= */

    visibleProjects.length ===
    0

      ? h(
          "div",
          {
            className:
              "projects-empty"
          },

          h(
            "div",
            {
              className:
                "projects-empty-icon"
            },

            "🔍"
          ),

          h(
            "h3",
            null,
            "No Projects Found"
          ),

          h(
            "p",
            null,

            search ||
            statusFilter !==
              "All Status" ||
            riskFilter !==
              "All Risk" ||
            provinceFilter !==
              "All Provinces"

              ? "Try changing your search or filters."

              : "No projects have been added yet."
          ),

          h(
            "button",
            {
              className:
                "projects-clear-btn",

              onClick:
                clearFilters
            },

            "Clear Filters"
          )
        )

      : h(
          "div",
          {
            className:
              "projects-grid"
          },

          visibleProjects.map(
            (project) => {
              const id =
                getProjectId(
                  project
                );

              const name =
                getProjectName(
                  project
                );

              const code =
                getProjectCode(
                  project
                );

              const progress =
                getProgress(
                  project
                );

              const status =
                project.status ||
                "Unknown";

              const risk =
                project.riskLevel ||
                project.risk ||
                "Unknown";

              const budget =
                project.budget ||
                project.totalBudget ||
                0;

              return h(
                "div",
                {
                  className:
                    "project-list-card",

                  key: id
                },

                /* =========================
                   CARD HEADER
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-top"
                  },

                  h(
                    "div",
                    null,

                    h(
                      "span",
                      {
                        className:
                          "project-card-code"
                      },

                      code
                    ),

                    h(
                      "h3",
                      null,
                      name
                    )
                  ),

                  h(
                    "span",
                    {
                      className:
                        `projects-status-badge ${getStatusClass(status)}`
                    },

                    status
                  )
                ),

                /* =========================
                   LOCATION
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-location"
                  },

                  "📍 ",

                  project.municipality ||
                    project.localLevel ||
                    "N/A",

                  ", ",

                  project.district ||
                    "N/A",

                  ", ",

                  project.province ||
                    "N/A"
                ),

                /* =========================
                   INFO
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-info"
                  },

                  h(
                    "div",
                    null,

                    h(
                      "span",
                      null,
                      "Budget"
                    ),

                    h(
                      "strong",
                      null,

                      formatBudget(
                        budget
                      )
                    )
                  ),

                  h(
                    "div",
                    null,

                    h(
                      "span",
                      null,
                      "Risk"
                    ),

                    h(
                      "strong",
                      {
                        className:
                          `projects-risk-text ${getRiskClass(risk)}`
                      },

                      risk
                    )
                  )
                ),

                /* =========================
                   PROGRESS
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-progress"
                  },

                  h(
                    "div",
                    {
                      className:
                        "project-card-progress-header"
                    },

                    h(
                      "span",
                      null,
                      "Progress"
                    ),

                    h(
                      "strong",
                      null,

                      `${progress}%`
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "project-card-progress-track"
                    },

                    h(
                      "div",
                      {
                        className:
                          "project-card-progress-fill",

                        style: {
                          width:
                            `${progress}%`
                        }
                      }
                    )
                  )
                ),

                /* =========================
                   CONTRACTOR
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-contractor"
                  },

                  h(
                    "span",
                    null,
                    "Contractor"
                  ),

                  h(
                    "strong",
                    null,

                    project.contractor ||
                      project.contractorName ||
                      "N/A"
                  )
                ),

                /* =========================
                   ACTIONS
                   ========================= */

                h(
                  "div",
                  {
                    className:
                      "project-card-actions"
                  },

                  /* VIEW DETAILS */

                  h(
                    "button",
                    {
                      className:
                        "project-view-btn",

                      onClick: () =>
                        navigate(
                          `/admin/projects/${id}`
                        )
                    },

                    "View Details"
                  ),

                  /* EDIT */

                  h(
                    "button",
                    {
                      className:
                        "project-edit-btn",

                      onClick: () =>
                        navigate(
                          `/admin/projects/${id}/edit`
                        )
                    },

                    "✏️"
                  ),

                  /* DELETE */

                  h(
                    "button",
                    {
                      className:
                        "project-delete-btn",

                      onClick: () =>
                        handleDelete(
                          id
                        )
                    },

                    "🗑️"
                  )
                )
              );
            }
          )
        ),

    /* =========================
       PAGINATION
       ========================= */

    totalPages > 1
      ? h(
          "div",
          {
            className:
              "projects-pagination"
          },

          /* PREVIOUS */

          h(
            "button",
            {
              disabled:
                safePage === 1,

              onClick: () =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
            },

            "← Previous"
          ),

          /* PAGE NUMBERS */

          h(
            "div",
            {
              className:
                "projects-page-numbers"
            },

            Array.from(
              {
                length:
                  totalPages
              },

              (_, index) => {
                const page =
                  index + 1;

                return h(
                  "button",
                  {
                    key: page,

                    className:
                      page ===
                      safePage
                        ? "active"
                        : "",

                    onClick: () =>
                      setCurrentPage(
                        page
                      )
                  },

                  page
                );
              }
            )
          ),

          /* NEXT */

          h(
            "button",
            {
              disabled:
                safePage ===
                totalPages,

              onClick: () =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
            },

            "Next →"
          )
        )
      : null
  );
};

export default Projects;