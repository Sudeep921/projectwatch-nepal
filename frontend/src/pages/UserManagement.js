import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data.users || data.data || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return React.createElement(
    "div",
    { className: "page-container" },

    React.createElement(
      "div",
      { className: "page-header" },
      React.createElement(
        "div",
        null,
        React.createElement("h1", null, "User Management"),
        React.createElement(
          "p",
          null,
          "Manage registered ProjectWatch users."
        )
      )
    ),

    loading
      ? React.createElement(
          "div",
          { className: "loading-box" },
          "Loading users..."
        )
      : React.createElement(
          "div",
          { className: "data-card" },

          React.createElement(
            "div",
            { className: "table-responsive" },

            React.createElement(
              "table",
              { className: "admin-table" },

              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", null, "Name"),
                  React.createElement("th", null, "Email"),
                  React.createElement("th", null, "Role"),
                  React.createElement("th", null, "Status")
                )
              ),

              React.createElement(
                "tbody",
                null,

                users.map((user) =>
                  React.createElement(
                    "tr",
                    { key: user._id },

                    React.createElement(
                      "td",
                      null,
                      user.name || "—"
                    ),

                    React.createElement(
                      "td",
                      null,
                      user.email || "—"
                    ),

                    React.createElement(
                      "td",
                      null,
                      user.role || "user"
                    ),

                    React.createElement(
                      "td",
                      null,
                      user.isActive === false
                        ? "Inactive"
                        : "Active"
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