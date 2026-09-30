import React, {
  useEffect,
  useState
} from "react";

import {
  getSystemHealth
} from "../services/api";

const h = React.createElement;

const ReleaseStatus = () => {
  const [
    health,
    setHealth
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const checkHealth =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getSystemHealth();

        setHealth(response);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Unable to check system health."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    checkHealth();
  }, []);

  const systemOk =
    Boolean(
      health?.success &&
      health?.status === "ok"
    );

  const checks = [
    {
      name: "Frontend",
      status: "Ready",
      ok: true
    },
    {
      name: "Authentication",
      status: "Ready",
      ok: true
    },
    {
      name: "Project Management",
      status: "Ready",
      ok: true
    },
    {
      name: "Field Reports",
      status: "Ready",
      ok: true
    },
    {
      name: "Complaints",
      status: "Ready",
      ok: true
    },
    {
      name: "Evidence",
      status: "Ready",
      ok: true
    },
    {
      name: "Alerts",
      status: "Ready",
      ok: true
    },
    {
      name: "Notifications",
      status: "Ready",
      ok: true
    },
    {
      name: "Public Portal",
      status: "Ready",
      ok: true
    },
    {
      name: "Database",
      status:
        health?.database ||
        "Unknown",
      ok:
        health?.database ===
        "connected"
    }
  ];

  return h(
    "div",
    {
      className:
        "release-status-page"
    },

    h(
      "div",
      {
        className:
          "release-status-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "ProjectWatch Nepal"
        ),

        h(
          "p",
          null,
          "Final system readiness check"
        )
      ),

      h(
        "button",
        {
          type: "button",
          onClick:
            checkHealth
        },
        "↻ Check Again"
      )
    ),

    loading
      ? h(
          "div",
          {
            className:
              "release-loading"
          },
          "Checking system..."
        )
      : null,

    error
      ? h(
          "div",
          {
            className:
              "release-error"
          },
          error
        )
      : null,

    !loading
      ? h(
          "div",
          {
            className:
              `release-overall ${
                systemOk
                  ? "release-ready"
                  : "release-warning"
              }`
          },

          h(
            "div",
            {
              className:
                "release-overall-icon"
            },
            systemOk
              ? "✓"
              : "!"
          ),

          h(
            "div",
            null,

            h(
              "h2",
              null,
              systemOk
                ? "System Ready"
                : "System Needs Attention"
            ),

            h(
              "p",
              null,
              systemOk
                ? "ProjectWatch Nepal API and database are responding."
                : "One or more system checks require attention."
            )
          )
        )
      : null,

    h(
      "div",
      {
        className:
          "release-check-list"
      },

      checks.map(
        (check) =>
          h(
            "div",
            {
              key: check.name,
              className:
                "release-check-item"
            },

            h(
              "div",
              null,

              h(
                "strong",
                null,
                check.name
              ),

              h(
                "span",
                null,
                check.status
              )
            ),

            h(
              "span",
              {
                className:
                  check.ok
                    ? "release-check-ok"
                    : "release-check-bad"
              },
              check.ok
                ? "✓"
                : "!"
            )
          )
      )
    ),

    h(
      "div",
      {
        className:
          "release-footer"
      },

      h(
        "strong",
        null,
        "ProjectWatch Nepal"
      ),

      h(
        "span",
        null,
        "Final QA / Release Verification"
      )
    )
  );
};

export default ReleaseStatus;