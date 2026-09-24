import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getPublicProjects
} from "../services/api";

import PublicProjectCard from
  "./PublicProjectCard";

const provinces = [
  "All Provinces",
  "Bagmati",
  "Gandaki",
  "Koshi",
  "Lumbini",
  "Madhesh",
  "Karnali",
  "Sudurpashchim"
];

const statuses = [
  "All Status",
  "Active",
  "Delayed",
  "Completed",
  "Critical"
];

const PublicProjectExplorer = () => {
  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    province,
    setProvince
  ] = useState(
    "All Provinces"
  );

  const [
    status,
    setStatus
  ] = useState(
    "All Status"
  );

  const loadProjects =
    async () => {
      try {
        setLoading(true);

        const data =
          await getPublicProjects();

        setProjects(
          data.projects ||
          data.data ||
          []
        );
      } catch (error) {
        console.error(
          "Public projects error:",
          error
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
          const query =
            search
              .trim()
              .toLowerCase();

          const searchable =
            [
              project.name,
              project.projectCode,
              project.province,
              project.district,
              project.municipality,
              project.contractor
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          const searchMatch =
            !query ||
            searchable.includes(
              query
            );

          const provinceMatch =
            province ===
              "All Provinces" ||
            project.province ===
              province;

          const statusMatch =
            status ===
              "All Status" ||
            project.status ===
              status;

          return (
            searchMatch &&
            provinceMatch &&
            statusMatch
          );
        }
      );
    }, [
      projects,
      search,
      province,
      status
    ]);

  return React.createElement(
    "section",
    {
      className:
        "public-explorer"
    },

    React.createElement(
      "div",
      {
        className:
          "public-explorer-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "public-section-label"
          },
          "PUBLIC REGISTRY"
        ),

        React.createElement(
          "h2",
          null,
          "Government Projects"
        ),

        React.createElement(
          "p",
          null,
          "Search and explore development projects across Nepal."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "public-refresh-button",
          onClick:
            loadProjects
        },
        "↻ Refresh"
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "public-project-filters"
      },

      React.createElement(
        "div",
        {
          className:
            "public-search-wrapper"
        },

        React.createElement(
          "span",
          {
            className:
              "public-search-icon"
          },
          "⌕"
        ),

        React.createElement(
          "input",
          {
            value: search,
            onChange: (event) =>
              setSearch(
                event.target.value
              ),
            placeholder:
              "Search project, code, district...",
            className:
              "public-search-input"
          }
        )
      ),

      React.createElement(
        "select",
        {
          value: province,
          onChange: (event) =>
            setProvince(
              event.target.value
            ),
          className:
            "public-filter-select"
        },

        provinces.map(
          (item) =>
            React.createElement(
              "option",
              {
                key: item,
                value: item
              },
              item
            )
        )
      ),

      React.createElement(
        "select",
        {
          value: status,
          onChange: (event) =>
            setStatus(
              event.target.value
            ),
          className:
            "public-filter-select"
        },

        statuses.map(
          (item) =>
            React.createElement(
              "option",
              {
                key: item,
                value: item
              },
              item
            )
        )
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "public-results-bar"
      },

      React.createElement(
        "span",
        null,
        loading
          ? "Loading projects..."
          : `${filteredProjects.length} projects found`
      ),

      search ||
      province !== "All Provinces" ||
      status !== "All Status"
        ? React.createElement(
            "button",
            {
              onClick: () => {
                setSearch("");
                setProvince(
                  "All Provinces"
                );
                setStatus(
                  "All Status"
                );
              },
              className:
                "public-clear-filter"
            },
            "Clear Filters"
          )
        : null
    ),

    loading
      ? React.createElement(
          "div",
          {
            className:
              "public-loading"
          },
          "Loading public projects..."
        )
      : filteredProjects.length === 0
      ? React.createElement(
          "div",
          {
            className:
              "public-empty"
          },

          React.createElement(
            "div",
            {
              className:
                "public-empty-icon"
            },
            "⌕"
          ),

          React.createElement(
            "h3",
            null,
            "No projects found"
          ),

          React.createElement(
            "p",
            null,
            "Try changing your search or filters."
          )
        )
      : React.createElement(
          "div",
          {
            className:
              "public-project-grid"
          },

          filteredProjects.map(
            (project) =>
              React.createElement(
                PublicProjectCard,
                {
                  key:
                    project._id,
                  project
                }
              )
          )
        )
  );
};

export default PublicProjectExplorer;