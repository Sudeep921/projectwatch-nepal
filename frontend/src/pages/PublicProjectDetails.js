import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import {
  getPublicProject
} from "../services/api";

const PublicProjectDetails = () => {
  const {
    id
  } = useParams();

  const [
    project,
    setProject
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {
    const load =
      async () => {
        try {
          const data =
            await getPublicProject(
              id
            );

          setProject(
            data.project ||
            data.data ||
            null
          );
        } catch (err) {
          setError(
            err.message ||
            "Project could not be loaded."
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [id]);

  if (loading) {
    return React.createElement(
      "div",
      {
        className:
          "public-details-loading"
      },
      "Loading project..."
    );
  }

  if (error || !project) {
    return React.createElement(
      "div",
      {
        className:
          "public-details-error"
      },

      React.createElement(
        "h2",
        null,
        "Project Not Found"
      ),

      React.createElement(
        "p",
        null,
        error ||
          "The requested project does not exist."
      ),

      React.createElement(
        Link,
        {
          to: "/"
        },
        "← Back to Projects"
      )
    );
  }

  const progress =
    Number(
      project.progress || 0
    );

  return React.createElement(
    "div",
    {
      className:
        "public-project-details"
    },

    React.createElement(
      "div",
      {
        className:
          "public-details-topbar"
      },

      React.createElement(
        Link,
        {
          to: "/",
          className:
            "public-back-link"
        },
        "← Public Project Registry"
      )
    ),

    React.createElement(
      "section",
      {
        className:
          "public-details-hero"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "public-project-code"
          },
          project.projectCode ||
            "PROJECT"
        ),

        React.createElement(
          "h1",
          null,
          project.name
        ),

        React.createElement(
          "p",
          null,
          `${project.district || ""}${
            project.district &&
            project.province
              ? ", "
              : ""
          }${
            project.province || ""
          }`
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "public-detail-status"
        },

        React.createElement(
          "span",
          null,
          "Current Status"
        ),

        React.createElement(
          "strong",
          null,
          project.status ||
            "Active"
        )
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "public-details-grid"
      },

      React.createElement(
        "div",
        {
          className:
            "public-detail-main"
        },

        React.createElement(
          "div",
          {
            className:
              "public-detail-card"
          },

          React.createElement(
            "h2",
            null,
            "Implementation Progress"
          ),

          React.createElement(
            "div",
            {
              className:
                "public-big-progress"
            },

            React.createElement(
              "strong",
              null,
              `${progress}%`
            ),

            React.createElement(
              "span",
              null,
              "completed"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-progress-track"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-progress-fill",
                style: {
                  width:
                    `${progress}%`
                }
              }
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "public-detail-card"
          },

          React.createElement(
            "h2",
            null,
            "Project Overview"
          ),

          React.createElement(
            "p",
            {
              className:
                "public-overview-text"
            },
            project.description ||
              "This government development project is registered in the ProjectWatch Nepal public registry."
          )
        )
      ),

      React.createElement(
        "aside",
        {
          className:
            "public-detail-sidebar"
        },

        React.createElement(
          "div",
          {
            className:
              "public-detail-card"
          },

          React.createElement(
            "h2",
            null,
            "Project Information"
          ),

          React.createElement(
            "div",
            {
              className:
                "public-info-row"
            },
            React.createElement(
              "span",
              null,
              "Province"
            ),
            React.createElement(
              "strong",
              null,
              project.province ||
                "—"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-info-row"
            },
            React.createElement(
              "span",
              null,
              "District"
            ),
            React.createElement(
              "strong",
              null,
              project.district ||
                "—"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-info-row"
            },
            React.createElement(
              "span",
              null,
              "Municipality"
            ),
            React.createElement(
              "strong",
              null,
              project.municipality ||
                "—"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-info-row"
            },
            React.createElement(
              "span",
              null,
              "Budget"
            ),
            React.createElement(
              "strong",
              null,
              project.budget
                ? `NPR ${Number(
                    project.budget
                  ).toLocaleString()}`
                : "—"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-info-row"
            },
            React.createElement(
              "span",
              null,
              "Risk Level"
            ),
            React.createElement(
              "strong",
              null,
              project.riskLevel ||
                "Low"
            )
          )
        )
      )
    )
  );
};

export default PublicProjectDetails;