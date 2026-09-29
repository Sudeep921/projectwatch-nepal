import React, {
  useEffect,
  useState
} from "react";

import {
  getSystemHealth
} from "../services/api";

const h = React.createElement;

const SystemSettings = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHealth = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSystemHealth();

      setHealth(
        response?.data ||
        response
      );
    } catch (err) {
      console.error(
        "SYSTEM HEALTH ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to load system status."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const status =
    health?.status ||
    "unknown";

  const database =
    health?.database ||
    health?.db ||
    "unknown";

  const apiStatus =
    status === "ok" ||
    status === "healthy"
      ? "Operational"
      : "Check Required";

  const dbStatus =
    typeof database === "string"
      ? database
      : database?.status ||
        "Unknown";

  return h(
    "div",
    {
      className:
        "page-container system-settings-page"
    },

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
          "System Settings"
        ),

        h(
          "p",
          null,
          "Monitor ProjectWatch Nepal system configuration and health."
        )
      ),

      h(
        "button",
        {
          className:
            "system-refresh-button",
          onClick:
            loadHealth,
          disabled:
            loading
        },
        loading
          ? "Checking..."
          : "↻ Refresh Status"
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "system-error"
          },
          error
        )
      : null,

    h(
      "div",
      {
        className:
          "system-status-grid"
      },

      h(
        "div",
        {
          className:
            "system-status-card"
        },

        h(
          "div",
          {
            className:
              "system-status-icon"
          },
          "⚡"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            "API Server"
          ),

          h(
            "span",
            {
              className:
                apiStatus ===
                "Operational"
                  ? "system-online"
                  : "system-warning"
            },
            apiStatus
          )
        )
      ),

      h(
        "div",
        {
          className:
            "system-status-card"
        },

        h(
          "div",
          {
            className:
              "system-status-icon"
          },
          "🗄"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            "Database"
          ),

          h(
            "span",
            {
              className:
                String(
                  dbStatus
                ).toLowerCase()
                  .includes("connected")
                  ? "system-online"
                  : "system-warning"
            },
            String(
              dbStatus
            )
          )
        )
      ),

      h(
        "div",
        {
          className:
            "system-status-card"
        },

        h(
          "div",
          {
            className:
              "system-status-icon"
          },
          "🌐"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            "Public Portal"
          ),

          h(
            "span",
            {
              className:
                "system-online"
            },
            "Available"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "system-status-card"
        },

        h(
          "div",
          {
            className:
              "system-status-icon"
          },
          "🔔"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            "Notifications"
          ),

          h(
            "span",
            {
              className:
                "system-online"
            },
            "Enabled"
          )
        )
      )
    ),

    h(
      "div",
      {
        className:
          "system-settings-grid"
      },

      // APPLICATION
      h(
        "div",
        {
          className:
            "system-settings-card"
        },

        h(
          "div",
          {
            className:
              "system-card-title"
          },

          h(
            "h2",
            null,
            "Application"
          ),

          h(
            "p",
            null,
            "ProjectWatch Nepal application information."
          )
        ),

        h(
          "div",
          {
            className:
              "system-info-list"
          },

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Application"
            ),
            h(
              "strong",
              null,
              "ProjectWatch Nepal"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Version"
            ),
            h(
              "strong",
              null,
              "1.0.0"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Environment"
            ),
            h(
              "strong",
              null,
              "Development"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Frontend"
            ),
            h(
              "strong",
              null,
              "React + Vite"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Backend"
            ),
            h(
              "strong",
              null,
              "Node.js + Express"
            )
          )
        )
      ),

      // API
      h(
        "div",
        {
          className:
            "system-settings-card"
        },

        h(
          "div",
          {
            className:
              "system-card-title"
          },

          h(
            "h2",
            null,
            "API Configuration"
          ),

          h(
            "p",
            null,
            "Current backend API connection."
          )
        ),

        h(
          "div",
          {
            className:
              "system-info-list"
          },

          h(
            "div",
            null,
            h(
              "span",
              null,
              "API URL"
            ),
            h(
              "strong",
              null,
              "localhost:8000/api"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "API Status"
            ),
            h(
              "strong",
              {
                className:
                  "system-online"
              },
              apiStatus
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Database"
            ),
            h(
              "strong",
              null,
              String(
                dbStatus
              )
            )
          )
        )
      ),

      // PORTAL
      h(
        "div",
        {
          className:
            "system-settings-card"
        },

        h(
          "div",
          {
            className:
              "system-card-title"
          },

          h(
            "h2",
            null,
            "Public Portal"
          ),

          h(
            "p",
            null,
            "Citizen-facing portal configuration."
          )
        ),

        h(
          "div",
          {
            className:
              "system-info-list"
          },

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Portal"
            ),
            h(
              "strong",
              null,
              "Enabled"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Citizen Login"
            ),
            h(
              "strong",
              null,
              "Not Required"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Public Projects"
            ),
            h(
              "strong",
              null,
              "Enabled"
            )
          ),

          h(
            "div",
            null,
            h(
              "span",
              null,
              "Public Complaints"
            ),
            h(
              "strong",
              null,
              "Enabled"
            )
          )
        )
      ),

      // MAINTENANCE
      h(
        "div",
        {
          className:
            "system-settings-card"
        },

        h(
          "div",
          {
            className:
              "system-card-title"
          },

          h(
            "h2",
            null,
            "Maintenance"
          ),

          h(
            "p",
            null,
            "System maintenance information."
          )
        ),

        h(
          "div",
          {
            className:
              "system-maintenance-box"
          },

          h(
            "div",
            {
              className:
                "system-maintenance-icon"
            },
            "✓"
          ),

          h(
            "div",
            null,

            h(
              "strong",
              null,
              "System is running normally"
            ),

            h(
              "p",
              null,
              "No maintenance mode is currently enabled."
            )
          )
        )
      )
    ),

    h(
      "div",
      {
        className:
          "system-note"
      },

      h(
        "strong",
        null,
        "System Health"
      ),

      h(
        "p",
        null,
        loading
          ? "Checking backend and database..."
          : `Last status check completed at ${new Date().toLocaleString()}.`
      )
    )
  );
};

export default SystemSettings;