import React, {
  useEffect,
  useState
} from "react";

import {
  getAuditLogs
} from "../services/api";

const h = React.createElement;

const AuditLogs = () => {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [moduleFilter, setModuleFilter] =
    useState("all");

  const [actionFilter, setActionFilter] =
    useState("all");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAuditLogs({
          search,
          module: moduleFilter,
          action: actionFilter
        });

      setLogs(
        response?.logs ||
        response?.data ||
        []
      );
    } catch (err) {
      console.error(
        "AUDIT LOG LOAD ERROR:",
        err
      );

      setError(
        err.message ||
        "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [
    moduleFilter,
    actionFilter
  ]);

  const getActionClass = (
    action
  ) => {
    const value =
      String(action || "")
        .toLowerCase();

    if (
      value.includes("delete") ||
      value.includes("remove")
    ) {
      return "audit-danger";
    }

    if (
      value.includes("create") ||
      value.includes("add")
    ) {
      return "audit-success";
    }

    if (
      value.includes("update") ||
      value.includes("edit")
    ) {
      return "audit-warning";
    }

    return "audit-neutral";
  };

  return h(
    "div",
    {
      className:
        "page-container audit-page"
    },

    // HEADER
    h(
      "div",
      {
        className:
          "page-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Audit Logs"
        ),

        h(
          "p",
          null,
          "Track important actions performed across ProjectWatch Nepal."
        )
      ),

      h(
        "button",
        {
          className:
            "audit-refresh-button",
          onClick:
            loadLogs
        },
        "↻ Refresh"
      )
    ),

    // FILTERS
    h(
      "div",
      {
        className:
          "audit-filter-card"
      },

      h(
        "div",
        {
          className:
            "audit-search"
        },

        h(
          "span",
          null,
          "🔍"
        ),

        h(
          "input",
          {
            value: search,
            placeholder:
              "Search user, email or action...",
            onChange: (
              event
            ) =>
              setSearch(
                event.target.value
              ),

            onKeyDown: (
              event
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                loadLogs();
              }
            }
          }
        )
      ),

      h(
        "select",
        {
          value:
            moduleFilter,
          className:
            "audit-select",

          onChange: (
            event
          ) =>
            setModuleFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Modules"
        ),

        h(
          "option",
          {
            value: "Auth"
          },
          "Auth"
        ),

        h(
          "option",
          {
            value: "Projects"
          },
          "Projects"
        ),

        h(
          "option",
          {
            value: "Field Reports"
          },
          "Field Reports"
        ),

        h(
          "option",
          {
            value: "Complaints"
          },
          "Complaints"
        ),

        h(
          "option",
          {
            value: "Users"
          },
          "Users"
        ),

        h(
          "option",
          {
            value: "Settings"
          },
          "Settings"
        ),

        h(
          "option",
          {
            value: "System"
          },
          "System"
        )
      ),

      h(
        "select",
        {
          value:
            actionFilter,
          className:
            "audit-select",

          onChange: (
            event
          ) =>
            setActionFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Actions"
        ),

        h(
          "option",
          {
            value: "CREATE"
          },
          "Create"
        ),

        h(
          "option",
          {
            value: "UPDATE"
          },
          "Update"
        ),

        h(
          "option",
          {
            value: "DELETE"
          },
          "Delete"
        ),

        h(
          "option",
          {
            value: "LOGIN"
          },
          "Login"
        ),

        h(
          "option",
          {
            value: "LOGOUT"
          },
          "Logout"
        )
      ),

      h(
        "button",
        {
          className:
            "audit-search-button",
          onClick:
            loadLogs
        },
        "Search"
      )
    ),

    // ERROR
    error
      ? h(
          "div",
          {
            className:
              "audit-error"
          },
          error
        )
      : null,

    // TABLE
    h(
      "div",
      {
        className:
          "audit-card"
      },

      h(
        "div",
        {
          className:
            "audit-card-header"
        },

        h(
          "strong",
          null,
          "System Activity"
        ),

        h(
          "span",
          null,
          `${logs.length} records`
        )
      ),

      loading
        ? h(
            "div",
            {
              className:
                "audit-empty"
            },
            "Loading audit logs..."
          )

        : logs.length === 0
        ? h(
            "div",
            {
              className:
                "audit-empty"
            },

            h(
              "div",
              {
                className:
                  "audit-empty-icon"
              },
              "📋"
            ),

            h(
              "h3",
              null,
              "No audit logs found"
            ),

            h(
              "p",
              null,
              "System activity will appear here when actions are recorded."
            )
          )

        : h(
            "div",
            {
              className:
                "table-responsive"
            },

            h(
              "table",
              {
                className:
                  "admin-table audit-table"
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
                    "User"
                  ),

                  h(
                    "th",
                    null,
                    "Action"
                  ),

                  h(
                    "th",
                    null,
                    "Module"
                  ),

                  h(
                    "th",
                    null,
                    "Description"
                  ),

                  h(
                    "th",
                    null,
                    "IP Address"
                  ),

                  h(
                    "th",
                    null,
                    "Date"
                  )
                )
              ),

              h(
                "tbody",
                null,

                logs.map(
                  (log) =>
                    h(
                      "tr",
                      {
                        key:
                          log._id
                      },

                      h(
                        "td",
                        null,

                        h(
                          "div",
                          {
                            className:
                              "audit-user"
                          },

                          h(
                            "strong",
                            null,
                            log.userName ||
                              log.user?.name ||
                              "System"
                          ),

                          h(
                            "small",
                            null,
                            log.userEmail ||
                              log.user?.email ||
                              "—"
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
                              `audit-action ${getActionClass(
                                log.action
                              )}`
                          },
                          log.action ||
                            "ACTION"
                        )
                      ),

                      h(
                        "td",
                        null,

                        h(
                          "span",
                          {
                            className:
                              "audit-module"
                          },
                          log.module ||
                            "System"
                        )
                      ),

                      h(
                        "td",
                        null,
                        log.description ||
                          "—"
                      ),

                      h(
                        "td",
                        null,

                        h(
                          "code",
                          null,
                          log.ipAddress ||
                            "—"
                        )
                      ),

                      h(
                        "td",
                        null,

                        log.createdAt
                          ? new Date(
                              log.createdAt
                            ).toLocaleString()
                          : "—"
                      )
                    )
                )
              )
            )
          )
    )
  );
};

export default AuditLogs;