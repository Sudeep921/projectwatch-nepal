import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../services/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => {
        setLogs(data.logs || data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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
        React.createElement("h1", null, "Audit Logs"),
        React.createElement(
          "p",
          null,
          "Track important administrative activities."
        )
      )
    ),

    loading
      ? React.createElement(
          "div",
          { className: "loading-box" },
          "Loading audit logs..."
        )
      : React.createElement(
          "div",
          { className: "data-card" },

          React.createElement(
            "div",
            { className: "audit-list" },

            logs.length === 0
              ? React.createElement(
                  "div",
                  { className: "empty-box" },
                  "No audit logs available."
                )
              : logs.map((log) =>
                  React.createElement(
                    "div",
                    {
                      className: "audit-item",
                      key: log._id
                    },

                    React.createElement(
                      "div",
                      { className: "audit-icon" },
                      "📝"
                    ),

                    React.createElement(
                      "div",
                      { className: "audit-content" },

                      React.createElement(
                        "strong",
                        null,
                        log.action || "System Activity"
                      ),

                      React.createElement(
                        "p",
                        null,
                        log.description ||
                          log.message ||
                          "Administrative activity recorded."
                      ),

                      React.createElement(
                        "small",
                        null,
                        log.createdAt
                          ? new Date(
                              log.createdAt
                            ).toLocaleString()
                          : "Unknown time"
                      )
                    )
                  )
                )
          )
        )
  );
};

export default AuditLogs;