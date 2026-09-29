import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getPublicProjects
} from "../services/api";

const h = React.createElement;

const PublicMap = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicProjects();

      const data =
        response?.projects ||
        response?.data ||
        response ||
        [];

      setProjects(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "PUBLIC MAP ERROR:",
        err
      );

      setError(
        err.message ||
        "Failed to load public projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const provinces = useMemo(() => {
    return [
      ...new Set(
        projects
          .map(
            (p) =>
              p.province
          )
          .filter(Boolean)
      )
    ];
  }, [projects]);

  const filteredProjects =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          const name =
            String(
              project.name ||
              project.projectName ||
              ""
            ).toLowerCase();

          const code =
            String(
              project.projectCode ||
              ""
            ).toLowerCase();

          const district =
            String(
              project.district ||
              ""
            ).toLowerCase();

          const provinceName =
            String(
              project.province ||
              ""
            );

          const matchesSearch =
            !q ||
            name.includes(q) ||
            code.includes(q) ||
            district.includes(q);

          const matchesProvince =
            province === "all" ||
            provinceName === province;

          return (
            matchesSearch &&
            matchesProvince
          );
        }
      );
    }, [
      projects,
      search,
      province
    ]);

  const getPosition = (
    project,
    index
  ) => {
    const lat =
      Number(project.latitude);

    const lng =
      Number(project.longitude);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      return {
        left:
          `${Math.min(
            Math.max(
              ((lng - 80) / 8) * 100,
              5
            ),
            95
          )}%`,
        top:
          `${Math.min(
            Math.max(
              ((30 - lat) / 6) * 100,
              5
            ),
            95
          )}%`
      };
    }

    const positions = [
      [18, 28],
      [38, 42],
      [57, 25],
      [72, 50],
      [30, 65],
      [65, 72],
      [82, 30],
      [48, 78]
    ];

    const pos =
      positions[
        index %
        positions.length
      ];

    return {
      left: `${pos[0]}%`,
      top: `${pos[1]}%`
    };
  };

  if (loading) {
    return h(
      "div",
      {
        className:
          "public-map-page"
      },
      h(
        "div",
        {
          className:
            "public-map-loading"
        },
        "Loading public map..."
      )
    );
  }

  return h(
    "div",
    {
      className:
        "public-map-page"
    },

    h(
      "div",
      {
        className:
          "public-map-header"
      },
      h(
        "div",
        null,
        h(
          "h1",
          null,
          "ProjectWatch Nepal Map"
        ),
        h(
          "p",
          null,
          "Explore public government projects across Nepal."
        )
      ),

      h(
        "button",
        {
          type: "button",
          onClick: () =>
            navigate("/public")
        },
        "← Public Portal"
      )
    ),

    h(
      "div",
      {
        className:
          "public-map-controls"
      },

      h(
        "input",
        {
          type: "text",
          placeholder:
            "Search project, code or district...",
          value: search,
          onChange: (e) =>
            setSearch(
              e.target.value
            )
        }
      ),

      h(
        "select",
        {
          value: province,
          onChange: (e) =>
            setProvince(
              e.target.value
            )
        },
        h(
          "option",
          { value: "all" },
          "All Provinces"
        ),
        provinces.map(
          (item) =>
            h(
              "option",
              {
                key: item,
                value: item
              },
              item
            )
        )
      ),

      h(
        "span",
        {
          className:
            "public-map-count"
        },
        `${filteredProjects.length} Projects`
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "public-map-error"
          },
          error
        )
      : null,

    h(
      "div",
      {
        className:
          "public-map-layout"
      },

      h(
        "div",
        {
          className:
            "public-map-canvas"
        },

        h(
          "div",
          {
            className:
              "public-map-watermark"
          },
          "NEPAL"
        ),

        filteredProjects.map(
          (project, index) =>
            h(
              "button",
              {
                key:
                  project._id ||
                  project.id ||
                  index,
                type: "button",
                className:
                  "public-map-marker",
                style:
                  getPosition(
                    project,
                    index
                  ),
                title:
                  project.name ||
                  project.projectName ||
                  "Project",
                onClick: () =>
                  setSelectedProject(
                    project
                  )
              },
              "📍"
            )
        )
      ),

      h(
        "div",
        {
          className:
            "public-map-project-list"
        },

        h(
          "h2",
          null,
          "Projects"
        ),

        filteredProjects.length
          ? filteredProjects.map(
              (project) =>
                h(
                  "div",
                  {
                    key:
                      project._id ||
                      project.id,
                    className:
                      "public-map-project-card",
                    onClick: () =>
                      setSelectedProject(
                        project
                      )
                  },

                  h(
                    "strong",
                    null,
                    project.name ||
                      project.projectName ||
                      "Untitled Project"
                  ),

                  h(
                    "span",
                    null,
                    project.projectCode ||
                      "No project code"
                  ),

                  h(
                    "small",
                    null,
                    [
                      project.district,
                      project.province
                    ]
                      .filter(Boolean)
                      .join(", ")
                  )
                )
            )
          : h(
              "div",
              {
                className:
                  "public-map-empty"
              },
              "No public projects found."
            )
      )
    ),

    selectedProject
      ? h(
          "div",
          {
            className:
              "public-map-modal-overlay",
            onClick: () =>
              setSelectedProject(null)
          },

          h(
            "div",
            {
              className:
                "public-map-modal",
              onClick: (e) =>
                e.stopPropagation()
            },

            h(
              "button",
              {
                type: "button",
                className:
                  "public-map-modal-close",
                onClick: () =>
                  setSelectedProject(null)
              },
              "×"
            ),

            h(
              "h2",
              null,
              selectedProject.name ||
                selectedProject.projectName ||
                "Project"
            ),

            h(
              "p",
              null,
              selectedProject.description ||
                "No description available."
            ),

            h(
              "div",
              {
                className:
                  "public-map-project-info"
              },

              h(
                "span",
                null,
                `Code: ${
                  selectedProject.projectCode ||
                  "N/A"
                }`
              ),

              h(
                "span",
                null,
                `Province: ${
                  selectedProject.province ||
                  "N/A"
                }`
              ),

              h(
                "span",
                null,
                `Status: ${
                  selectedProject.status ||
                  "N/A"
                }`
              ),

              h(
                "span",
                null,
                `Progress: ${
                  selectedProject.progress ??
                  0
                }%`
              )
            ),

            h(
              "button",
              {
                type: "button",
                className:
                  "public-map-view-button",
                onClick: () => {
                  const id =
                    selectedProject._id ||
                    selectedProject.id;

                  if (id) {
                    navigate(
                      `/public/projects/${id}`
                    );
                  }
                }
              },
              "View Project Details →"
            )
          )
        )
      : null
  );
};

export default PublicMap;