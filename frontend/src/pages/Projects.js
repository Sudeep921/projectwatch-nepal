import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getProjects
} from "../services/api";

import ProjectFilters from "../components/ProjectFilters";
import ProjectTable from "../components/ProjectTable";
import AddProjectModal from "../components/AddProjectModal";

const Projects = () => {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [province, setProvince] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [risk, setRisk] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await getProjects();

      setProjects(
        response.projects ||
          response.data ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const text =
            `${project.name || ""} ${
              project.projectId || ""
            } ${
              project.district || ""
            } ${
              project.municipality || ""
            }`
              .toLowerCase();

          const matchesSearch =
            !search ||
            text.includes(
              search.toLowerCase()
            );

          const matchesProvince =
            !province ||
            project.province ===
              province;

          const matchesStatus =
            !status ||
            project.status === status;

          const matchesRisk =
            !risk ||
            project.riskLevel === risk;

          return (
            matchesSearch &&
            matchesProvince &&
            matchesStatus &&
            matchesRisk
          );
        }
      );
    }, [
      projects,
      search,
      province,
      status,
      risk
    ]);

  const resetFilters = () => {
    setSearch("");
    setProvince("");
    setStatus("");
    setRisk("");
  };

  const handleCreated = () => {
    loadProjects();
  };

  return React.createElement(
    "div",
    {
      className: "page-container projects-page"
    },

    React.createElement(
      "div",
      {
        className: "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className: "page-eyebrow"
          },
          "PROJECT MANAGEMENT"
        ),

        React.createElement(
          "h1",
          null,
          "Government Projects"
        ),

        React.createElement(
          "p",
          null,
          "Monitor, verify and manage government development projects across Nepal."
        )
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className: "primary-button",
          onClick: () =>
            setShowModal(true)
        },
        "+ Add New Project"
      )
    ),

    React.createElement(
      "div",
      {
        className: "projects-summary"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "strong",
          null,
          projects.length
        ),

        React.createElement(
          "span",
          null,
          "Total Projects"
        )
      ),

      React.createElement(
        "div",
        null,

        React.createElement(
          "strong",
          null,
          filteredProjects.length
        ),

        React.createElement(
          "span",
          null,
          "Filtered"
        )
      )
    ),

    React.createElement(
      ProjectFilters,
      {
        search,
        setSearch,
        province,
        setProvince,
        status,
        setStatus,
        risk,
        setRisk,
        onReset: resetFilters
      }
    ),

    error
      ? React.createElement(
          "div",
          {
            className: "page-error"
          },
          error
        )
      : null,

    loading
      ? React.createElement(
          "div",
          {
            className: "page-loading"
          },
          "Loading projects..."
        )
      : React.createElement(
          "div",
          {
            className: "project-registry-card"
          },

          React.createElement(
            "div",
            {
              className:
                "registry-header"
            },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Project Registry"
              ),

              React.createElement(
                "p",
                null,
                "Verified government development project registry"
              )
            ),

            React.createElement(
              "span",
              {
                className:
                  "registry-count"
              },
              `${filteredProjects.length} Projects`
            )
          ),

          React.createElement(
            ProjectTable,
            {
              projects:
                filteredProjects
            }
          )
        ),

    React.createElement(
      AddProjectModal,
      {
        isOpen: showModal,
        onClose: () =>
          setShowModal(false),
        onCreated: handleCreated
      }
    )
  );
};

export default Projects;