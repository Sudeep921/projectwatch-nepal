import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProject,
  getProjectTimeline
} from "../services/api";

import ProjectTimeline from "../components/ProjectTimeline";

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
    timeline,
    setTimeline
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  // ========================================
  // GET PROJECT
  // ========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    getProject(id)
      .then((data) => {
        setProject(
          data.project ||
          data.data
        );
      })
      .catch((error) => {
        console.error(
          "Project error:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // ========================================
  // GET PROJECT TIMELINE
  // ========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    getProjectTimeline(id)
      .then((result) => {
        setTimeline(
          result.timeline ||
          result.data ||
          []
        );
      })
      .catch((error) => {
        console.error(
          "Timeline error:",
          error
        );

        setTimeline([]);
      });
  }, [id]);

  // ========================================
  // LOADING
  // ========================================

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

  // ========================================
  // PROJECT NOT FOUND
  // ========================================

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

  // ========================================
  // PROJECT DETAILS
  // ========================================

  return h(
    "div",
    {
      className:
        "page project-details-page"
    },

    // ========================================
    // BACK BUTTON
    // ========================================

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

    // ========================================
    // PROJECT HERO
    // ========================================

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
          project.name ||
          project.projectName ||
          "Untitled Project"
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
        project.status ||
        "-"
      )
    ),

    // ========================================
    // PROJECT INFORMATION
    // ========================================

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

    // ========================================
    // PROJECT PROGRESS
    // ========================================

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
    ),

    // ========================================
    // PROJECT TIMELINE
    // ONLY SHOW IF TIMELINE EXISTS
    // ========================================

    timeline.length > 0 &&
      h(
        "section",
        {
          className:
            "data-card"
        },

        h(
          "h2",
          null,
          "Project Timeline"
        ),

        h(
          ProjectTimeline,
          {
            timeline
          }
        )
      )
  );
};

export default ProjectDetails;