import React, {
  useEffect,
  useState
} from "react";

import {
  getUsers,
  updateUserStatus,
  updateUserRole
} from "../services/api";

const h = React.createElement;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [updatingId, setUpdatingId] =
    useState(null);

  // ========================================
  // LOAD USERS
  // ========================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      const data =
        response?.users ||
        response?.data ||
        response;

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "USERS LOAD ERROR:",
        err
      );

      setError(
        err.message ||
        "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ========================================
  // UPDATE STATUS
  // ========================================

  const changeStatus = async (
    user
  ) => {
    const nextStatus =
      user.isActive === false;

    const confirmText = nextStatus
      ? `Activate ${user.name || "this user"}?`
      : `Deactivate ${user.name || "this user"}?`;

    if (!window.confirm(confirmText)) {
      return;
    }

    try {
      setUpdatingId(user._id);

      await updateUserStatus(
        user._id,
        nextStatus
      );

      await loadUsers();
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      window.alert(
        err.message ||
        "Failed to update user status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // UPDATE ROLE
  // ========================================

  const changeRole = async (
    user,
    role
  ) => {
    if (!role || role === user.role) {
      return;
    }

    if (
      !window.confirm(
        `Change ${user.name || "this user"} role to ${role}?`
      )
    ) {
      return;
    }

    try {
      setUpdatingId(user._id);

      await updateUserRole(
        user._id,
        role
      );

      await loadUsers();
    } catch (err) {
      console.error(
        "ROLE UPDATE ERROR:",
        err
      );

      window.alert(
        err.message ||
        "Failed to update user role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // FILTER
  // ========================================

  const filteredUsers =
    users.filter((user) => {
      const text =
        search
          .trim()
          .toLowerCase();

      const matchesSearch =
        !text ||
        String(
          user.name || ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          user.email || ""
        )
          .toLowerCase()
          .includes(text);

      const role =
        String(
          user.role || "citizen"
        ).toLowerCase();

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter;

      const isActive =
        user.isActive !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (
          statusFilter ===
            "active" &&
          isActive
        ) ||
        (
          statusFilter ===
            "inactive" &&
          !isActive
        );

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });

  // ========================================
  // COUNTS
  // ========================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        user.isActive !== false
    ).length;

  const inactiveUsers =
    users.filter(
      (user) =>
        user.isActive === false
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  const officerUsers =
    users.filter(
      (user) =>
        user.role === "officer"
    ).length;

  // ========================================
  // ROLE SELECT
  // ========================================

  const roleSelect = (
    user
  ) =>
    h(
      "select",
      {
        className:
          "user-role-select",
        value:
          user.role ||
          "citizen",
        disabled:
          updatingId ===
          user._id,
        onChange: (event) =>
          changeRole(
            user,
            event.target.value
          )
      },

      h(
        "option",
        {
          value: "admin"
        },
        "Admin"
      ),

      h(
        "option",
        {
          value: "officer"
        },
        "Officer"
      ),

      h(
        "option",
        {
          value: "citizen"
        },
        "Citizen"
      )
    );

  return h(
    "div",
    {
      className:
        "user-management-page page-container"
    },

    // ========================================
    // HEADER
    // ========================================

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
          "User Management"
        ),

        h(
          "p",
          null,
          "Manage ProjectWatch system users and access roles."
        )
      ),

      h(
        "button",
        {
          className:
            "user-refresh-button",
          onClick:
            loadUsers,
          disabled: loading
        },
        loading
          ? "Refreshing..."
          : "↻ Refresh"
      )
    ),

    // ========================================
    // ERROR
    // ========================================

    error
      ? h(
          "div",
          {
            className:
              "user-error"
          },
          error
        )
      : null,

    // ========================================
    // SUMMARY
    // ========================================

    h(
      "div",
      {
        className:
          "user-summary-grid"
      },

      h(
        "div",
        {
          className:
            "user-summary-card"
        },

        h(
          "div",
          {
            className:
              "user-summary-icon"
          },
          "👥"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            totalUsers
          ),

          h(
            "span",
            null,
            "Total Users"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "user-summary-card"
        },

        h(
          "div",
          {
            className:
              "user-summary-icon"
          },
          "✓"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            activeUsers
          ),

          h(
            "span",
            null,
            "Active"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "user-summary-card"
        },

        h(
          "div",
          {
            className:
              "user-summary-icon"
          },
          "⏸"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            inactiveUsers
          ),

          h(
            "span",
            null,
            "Inactive"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "user-summary-card"
        },

        h(
          "div",
          {
            className:
              "user-summary-icon"
          },
          "🛡"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            adminUsers
          ),

          h(
            "span",
            null,
            "Admins"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "user-summary-card"
        },

        h(
          "div",
          {
            className:
              "user-summary-icon"
          },
          "◉"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            officerUsers
          ),

          h(
            "span",
            null,
            "Officers"
          )
        )
      )
    ),

    // ========================================
    // FILTERS
    // ========================================

    h(
      "div",
      {
        className:
          "user-filter-card"
      },

      h(
        "div",
        {
          className:
            "user-search-box"
        },

        h(
          "span",
          null,
          "🔍"
        ),

        h(
          "input",
          {
            type: "text",
            placeholder:
              "Search by name or email...",
            value: search,
            onChange: (event) =>
              setSearch(
                event.target.value
              )
          }
        )
      ),

      h(
        "select",
        {
          className:
            "user-filter-select",
          value: roleFilter,
          onChange: (event) =>
            setRoleFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Roles"
        ),

        h(
          "option",
          {
            value: "admin"
          },
          "Admin"
        ),

        h(
          "option",
          {
            value: "officer"
          },
          "Officer"
        ),

        h(
          "option",
          {
            value: "citizen"
          },
          "Citizen"
        )
      ),

      h(
        "select",
        {
          className:
            "user-filter-select",
          value:
            statusFilter,
          onChange: (event) =>
            setStatusFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Status"
        ),

        h(
          "option",
          {
            value: "active"
          },
          "Active"
        ),

        h(
          "option",
          {
            value: "inactive"
          },
          "Inactive"
        )
      ),

      h(
        "button",
        {
          className:
            "user-clear-button",
          onClick: () => {
            setSearch("");
            setRoleFilter("all");
            setStatusFilter("all");
          }
        },
        "Clear Filters"
      )
    ),

    // ========================================
    // TABLE
    // ========================================

    h(
      "div",
      {
        className:
          "user-table-card"
      },

      h(
        "div",
        {
          className:
            "user-table-header"
        },

        h(
          "strong",
          null,
          "Registered Users"
        ),

        h(
          "span",
          null,
          `${filteredUsers.length} of ${totalUsers}`
        )
      ),

      loading
        ? h(
            "div",
            {
              className:
                "user-loading"
            },
            "Loading users..."
          )
        : filteredUsers.length ===
          0
        ? h(
            "div",
            {
              className:
                "user-empty"
            },

            h(
              "div",
              {
                className:
                  "user-empty-icon"
              },
              "👥"
            ),

            h(
              "h3",
              null,
              "No users found"
            ),

            h(
              "p",
              null,
              search ||
                roleFilter !== "all" ||
                statusFilter !== "all"
                ? "Try changing your filters."
                : "No registered users are available."
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
                  "admin-table user-table"
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
                    "Email"
                  ),

                  h(
                    "th",
                    null,
                    "Role"
                  ),

                  h(
                    "th",
                    null,
                    "Status"
                  ),

                  h(
                    "th",
                    null,
                    "Joined"
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

                filteredUsers.map(
                  (user) =>
                    h(
                      "tr",
                      {
                        key:
                          user._id
                      },

                      h(
                        "td",
                        null,

                        h(
                          "div",
                          {
                            className:
                              "user-table-name"
                          },

                          h(
                            "div",
                            {
                              className:
                                "user-table-avatar"
                            },

                            (
                              user.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()
                          ),

                          h(
                            "strong",
                            null,
                            user.name ||
                              "Unknown User"
                          )
                        )
                      ),

                      h(
                        "td",
                        null,
                        user.email ||
                          "—"
                      ),

                      h(
                        "td",
                        null,
                        roleSelect(user)
                      ),

                      h(
                        "td",
                        null,

                        h(
                          "span",
                          {
                            className:
                              user.isActive ===
                              false
                                ? "user-status inactive"
                                : "user-status active"
                          },

                          user.isActive ===
                          false
                            ? "Inactive"
                            : "Active"
                        )
                      ),

                      h(
                        "td",
                        null,

                        user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"
                      ),

                      h(
                        "td",
                        null,

                        h(
                          "button",
                          {
                            className:
                              user.isActive ===
                              false
                                ? "user-action-button activate"
                                : "user-action-button deactivate",

                            disabled:
                              updatingId ===
                              user._id,

                            onClick: () =>
                              changeStatus(
                                user
                              )
                          },

                          updatingId ===
                          user._id
                            ? "Updating..."
                            : user.isActive ===
                              false
                            ? "Activate"
                            : "Deactivate"
                        )
                      )
                    )
                )
              )
            )
          )
    )
  );
};

export default UserManagement;