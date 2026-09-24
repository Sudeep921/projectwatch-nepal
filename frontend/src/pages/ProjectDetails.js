import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProject
} from "../services/api";

const h = React.createElement;

const ProjectDetails = () => {
  const {
    id
  } = useParams();

  const navigate =
    useNavigate();

  const [
    project,
    setProject
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    getProject(id)
      .then((data) =>
        setProject(
          data.project ||
            data.data
        )
      )
      .catch(
        console.error
      )
      .finally(() =>
        setLoading(false)
      );
  }, [id]);

  if (loading) {
    return h(
      "div",
      {
        className:
          "page-loading"
      },
      "Loading project..."
    );
  }

  if (!project) {
    return h(
      "div",
      {
        className:
          "page-error"
      },
      "Project not found."
    );
  }

  return h(
    "div",
    {
      className:
        "page project-details-page"
    },

    h(
      "button",
      {
        className:
          "back-button",
        onClick: () =>
          navigate(
            "/admin/projects"
          )
      },
      "← Back to Projects"
    ),

    h(
      "div",
      {
        className:
          "detail-hero"
      },

      h(
        "div",
        null,

        h(
          "span",
          {
            className:
              "eyebrow"
          },
          project.projectCode ||
            "PROJECT"
        ),

        h(
          "h1",
          null,
          project.name
        ),

        h(
          "p",
          null,
          project.description ||
            "Government development project."
        )
      ),

      h(
        "span",
        {
          className:
            "status-badge"
        },
        project.status
      )
    ),

    h(
      "div",
      {
        className:
          "detail-grid"
      },

      [
        [
          "Province",
          project.province
        ],
        [
          "District",
          project.district
        ],
        [
          "Municipality",
          project.municipality
        ],
        [
          "Contractor",
          project.contractor
        ],
        [
          "Risk Level",
          project.riskLevel
        ],
        [
          "Budget",
          `NPR ${Number(
            project.budget || 0
          ).toLocaleString()}`
        ]
      ].map(
        ([label, value]) =>
          h(
            "div",
            {
              key: label,
              className:
                "detail-card"
            },

            h(
              "span",
              null,
              label
            ),

            h(
              "strong",
              null,
              value || "-"
            )
          )
      )
    ),

    h(
      "div",
      {
        className:
          "detail-card progress-card"
      },

      h(
        "h2",
        null,
        "Project Progress"
      ),

      h(
        "strong",
        {
          className:
            "detail-big-number"
        },
        `${project.progress || 0}%`
      ),

      h(
        "div",
        {
          className:
            "progress-track"
        },

        h(
          "div",
          {
            className:
              "progress-fill",
            style: {
              width:
                `${project.progress || 0}%`
            }
          }
        )
      )
    )
  );
};

export default ProjectDetails;