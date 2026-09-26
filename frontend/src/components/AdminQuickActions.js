import React from "react";
import { Link } from "react-router-dom";

const AdminQuickActions = () => {
  const actions = [
    ["➕", "Add Project", "/projects"],
    ["📋", "Field Reports", "/field-reports"],
    ["📷", "Evidence", "/evidence"],
    ["⚠️", "Complaints", "/complaints"],
    ["🔔", "Notifications", "/notifications"],
    ["📊", "Reports", "/reports"]
  ];

  return React.createElement(
    "div",
    { className: "quick-actions-grid" },

    actions.map((item) =>
      React.createElement(
        Link,
        {
          to: item[2],
          className: "quick-action",
          key: item[1]
        },

        React.createElement(
          "span",
          { className: "quick-action-icon" },
          item[0]
        ),

        React.createElement(
          "span",
          null,
          item[1]
        )
      )
    )
  );
};

export default AdminQuickActions;