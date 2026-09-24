import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getPublicProjects,
  getPublicSummary
} from "../services/api";

const h = React.createElement;
import PublicProjectExplorer from "../components/PublicProjectExplorer";
import PublicMap from "../components/PublicMap";
import PublicUpdates from "../components/PublicUpdates";
import PublicContact from "../components/PublicContact";

const PROVINCES = [
  "All Provinces",
  "Bagmati",
  "Gandaki",
  "Koshi",
  "Lumbini",
  "Madhesh",
  "Karnali",
  "Sudurpashchim"
];

const STATUSES = [
  "All Status",
  "Active",
  "Delayed",
  "Completed",
  "Critical"
];

const RISKS = [
  "All Risk",
  "Low",
  "Medium",
  "High",
  "Critical"
];

/* ===================================
   BUILD API QUERY
=================================== */

const buildQuery = ({
  search,
  province,
  status,
  risk
}) => {
  const params =
    new URLSearchParams();

  if (search) {
    params.set(
      "search",
      search
    );
  }

  if (
    province &&
    province !== "All Provinces"
  ) {
    params.set(
      "province",
      province
    );
  }

  if (
    status &&
    status !== "All Status"
  ) {
    params.set(
      "status",
      status
    );
  }

  if (
    risk &&
    risk !== "All Risk"
  ) {
    params.set(
      "riskLevel",
      risk
    );
  }

  const query =
    params.toString();

  return query
    ? `?${query}`
    : "";
};

/* ===================================
   PUBLIC PORTAL
=================================== */

const PublicPortal = () => {
  const navigate =
    useNavigate();

  /* ===================================
     STATE
  =================================== */

  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    summary,
    setSummary
  ] = useState({});

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

  const [
    risk,
    setRisk
  ] = useState(
    "All Risk"
  );

  /* ===================================
     LOAD PROJECTS
  =================================== */

  const load =
    async () => {
      try {
        setLoading(true);

        const query =
          buildQuery({
            search,
            province,
            status,
            risk
          });

        const [
          p,
          s
        ] =
          await Promise.all([
            getPublicProjects(
              query
            ),
            getPublicSummary()
          ]);

        setProjects(
          p.projects || []
        );

        setSummary(
          s.summary || {}
        );
      } catch (error) {
        console.error(
          "Failed to load public projects:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  /* ===================================
     INITIAL LOAD
  =================================== */

  useEffect(() => {
    load();

    // eslint-disable-next-line
  }, []);

  /* ===================================
     SEARCH
  =================================== */

  const handleSearch =
    (event) => {
      event.preventDefault();

      load();
    };

  /* ===================================
     CLEAR FILTERS
  =================================== */

  const clearFilters =
    () => {
      setSearch("");
      setProvince(
        "All Provinces"
      );
      setStatus(
        "All Status"
      );
      setRisk(
        "All Risk"
      );

      setTimeout(
        load,
        0
      );
    };

  /* ===================================
     FILTER CHANGE
  =================================== */

  const handleProvinceChange =
    (event) => {
      setProvince(
        event.target.value
      );

      setTimeout(
        load,
        0
      );
    };

  const handleStatusChange =
    (event) => {
      setStatus(
        event.target.value
      );

      setTimeout(
        load,
        0
      );
    };

  const handleRiskChange =
    (event) => {
      setRisk(
        event.target.value
      );

      setTimeout(
        load,
        0
      );
    };

  /* ===================================
     PROJECTS WITH MAP LOCATION
  =================================== */

  const mappedProjects =
    projects.filter(
      (project) =>
        project.latitude !==
          undefined &&
        project.latitude !==
          null &&
        project.longitude !==
          undefined &&
        project.longitude !==
          null
    );

  /* ===================================
     MAP
     
     Default Nepal view.
     OpenStreetMap embed is used here.
  =================================== */

  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=80.0%2C26.0%2C88.5%2C30.5&layer=mapnik";

  /* ===================================
     RENDER
  =================================== */

  return h(
    "div",
    {
      className:
        "public-portal"
    },

    /* ===================================
       HEADER / NAVBAR
    =================================== */

    h(
      "header",
      {
        className:
          "public-header"
      },

      h(
        "div",
        {
          className:
            "public-header-brand"
        },

        h(
          "div",
          {
            className:
              "public-header-logo"
          },
          "PW"
        ),

        h(
          "strong",
          null,
          "ProjectWatch Nepal"
        )
      ),

      /* PUBLIC NAVIGATION */

      h(
        "nav",
        {
          className:
            "public-nav"
        },

        h(
          "a",
          {
            href:
              "#home"
          },
          "Home"
        ),

        h(
          "a",
          {
            href:
              "#projects"
          },
          "Projects"
        ),

        h(
          "a",
          {
            href:
              "#map"
          },
          "Live Map"
        ),

        h(
          "a",
          {
            href:
              "/public/report"
          },
          "Complaints"
        ),

        h(
          "a",
          {
            href:
              "#about"
          },
          "About"
        )
      ),

      h(
        "div",
        {
          className:
            "public-header-actions"
        },

        h(
          "button",
          {
            className:
              "public-header-report",

            onClick:
              () =>
                navigate(
                  "/public/report"
                )
          },
          "⚠ Report an Issue"
        ),

        h(
          "a",
          {
            href:
              "/admin-login"
          },
          "Admin Login"
        )
      )
    ),

    /* ===================================
       HERO
    =================================== */

    h(
      "section",
      {
        id:
          "home",

        className:
          "public-hero"
      },

      h(
        "span",
        {
          className:
            "eyebrow"
        },
        "OPEN GOVERNMENT"
      ),

      h(
        "h1",
        null,
        "Track Nepal's Public Projects"
      ),

      h(
        "p",
        null,
        "Explore government development projects, progress and budget information. See something wrong on the ground? Report it directly."
      ),

      h(
        "form",
        {
          className:
            "public-search",

          onSubmit:
            handleSearch
        },

        h(
          "input",
          {
            value:
              search,

            onChange:
              (e) =>
                setSearch(
                  e.target.value
                ),

            placeholder:
              "Search by project name, code or district..."
          }
        ),

        h(
          "button",
          {
            type:
              "submit"
          },
          "Search"
        )
      )
    ),

    /* ===================================
       STATS
    =================================== */

    h(
      "section",
      {
        id:
          "reports",

        className:
          "public-stats"
      },

      [
        [
          "Projects",
          summary.totalProjects
        ],

        [
          "Active",
          summary.activeProjects
        ],

        [
          "Delayed",
          summary.delayedProjects
        ],

        [
          "Completed",
          summary.completedProjects
        ],

        [
          "Critical",
          summary.criticalProjects
        ]
      ].map(
        ([label, value]) =>
          h(
            "div",
            {
              key:
                label
            },

            h(
              "strong",
              null,
              value || 0
            ),

            h(
              "span",
              null,
              label
            )
          )
      )
    ),

    /* ===================================
       FILTERS
       
       Moved BEFORE the map.
    =================================== */

    h(
      "section",
      {
        className:
          "public-filters"
      },

      /* PROVINCE */

      h(
        "select",
        {
          value:
            province,

          onChange:
            handleProvinceChange
        },

        PROVINCES.map(
          (item) =>
            h(
              "option",
              {
                key:
                  item,

                value:
                  item
              },
              item
            )
        )
      ),

      /* STATUS */

      h(
        "select",
        {
          value:
            status,

          onChange:
            handleStatusChange
        },

        STATUSES.map(
          (item) =>
            h(
              "option",
              {
                key:
                  item,

                value:
                  item
              },
              item
            )
        )
      ),

      /* RISK */

      h(
        "select",
        {
          value:
            risk,

          onChange:
            handleRiskChange
        },

        RISKS.map(
          (item) =>
            h(
              "option",
              {
                key:
                  item,

                value:
                  item
              },
              item
            )
        )
      ),

      /* CLEAR */

      h(
        "button",
        {
          type:
            "button",

          className:
            "public-filters-clear",

          onClick:
            clearFilters
        },
        "Clear Filters"
      )
    ),

    /* ===================================
       LIVE MAP
    =================================== */

    h(
      "section",
      {
        id:
          "map",

        className:
          "public-live-map"
      },

      /* MAP HEADER */

      h(
        "div",
        {
          className:
            "public-live-map-header"
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
            "LIVE MONITORING"
          ),

          h(
            "h2",
            null,
            "Government Project Live Map"
          ),

          h(
            "p",
            null,
            "View project locations across Nepal."
          )
        ),

        h(
          "span",
          {
            className:
              "public-map-count"
          },
          `${mappedProjects.length} mapped projects`
        )
      ),

      /* FULL WIDTH MAP */

      h(
        "div",
        {
          className:
            "public-live-map-content"
        },

        h(
          "div",
          {
            className:
              "public-map-frame"
          },

          h(
            "iframe",
            {
              title:
                "ProjectWatch Nepal Live Map",

              src:
                mapUrl,

              loading:
                "lazy",

              style: {
                width:
                  "100%",

                height:
                  "100%",

                minHeight:
                  "480px",

                border:
                  "0"
              }
            }
          )
        )
      )
    ),

    /* ===================================
       PROJECT GRID
    =================================== */

    loading

      ? h(
          "div",
          {
            className:
              "public-loading"
          },
          "Loading projects..."
        )

      : projects.length === 0

      ? h(
          "div",
          {
            className:
              "public-empty"
          },

          h(
            "h3",
            null,
            "No projects found"
          ),

          h(
            "p",
            null,
            "Try adjusting your search or filters."
          )
        )

      : h(
          "main",
          {
            id:
              "projects",

            className:
              "public-project-grid"
          },

          /* PROJECT SECTION HEADER */

          h(
            "div",
            {
              className:
                "public-projects-heading"
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
                "PROJECTS"
              ),

              h(
                "h2",
                null,
                "Government Projects"
              ),

              h(
                "p",
                null,
                `${projects.length} project${
                  projects.length !== 1
                    ? "s"
                    : ""
                } found`
              )
            )
          ),

          /* PROJECT CARDS */

          h(
            "div",
            {
              className:
                "public-project-grid-items"
            },

            projects.map(
              (project) =>
                h(
                  "article",
                  {
                    key:
                      project._id,

                    className:
                      "public-project-card",

                    onClick:
                      () =>
                        navigate(
                          `/public/projects/${project._id}`
                        )
                  },

                  /* PROJECT CODE */

                  h(
                    "span",
                    {
                      className:
                        "public-project-code"
                    },
                    project.projectCode ||
                      "PROJECT"
                  ),

                  /* PROJECT NAME */

                  h(
                    "h3",
                    null,
                    project.name ||
                      project.projectName ||
                      "Untitled Project"
                  ),

                  /* LOCATION */

                  h(
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
                  ),

                  /* PROGRESS BAR */

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
                  ),

                  /* CARD FOOTER */

                  h(
                    "div",
                    {
                      className:
                        "public-project-card-footer"
                    },

                    h(
                      "strong",
                      null,
                      `${project.progress || 0}%`
                    ),

                    h(
                      "span",
                      {
                        className:
                          `status-pill status-${(
                            project.status ||
                            "active"
                          ).toLowerCase()}`
                      },
                      project.status ||
                        "Active"
                    )
                  ),

                  /* DETAILS */

                  h(
                    "span",
                    {
                      className:
                        "public-project-card-link"
                    },
                    "View details →"
                  )
                )
            )
          )
        ),

    /* ===================================
       FOOTER
    =================================== */

    h(
      "footer",
      {
        id:
          "about",

        className:
          "public-footer"
      },

      /* FOOTER COL 1 */

      h(
        "div",
        {
          className:
            "public-footer-col"
        },

        h(
          "strong",
          null,
          "ProjectWatch Nepal"
        ),

        h(
          "p",
          null,
          "An open-government platform for tracking public development projects, budgets and progress across all seven provinces of Nepal."
        )
      ),

      /* FOOTER COL 2 */

      h(
        "div",
        {
          className:
            "public-footer-col"
        },

        h(
          "strong",
          null,
          "For Citizens"
        ),

        h(
          "button",
          {
            className:
              "public-footer-link",

            onClick:
              () =>
                navigate(
                  "/public/report"
                )
          },
          "Report a Project Issue"
        )
      ),

      /* FOOTER COL 3 */

      h(
        "div",
        {
          className:
            "public-footer-col"
        },

        h(
          "strong",
          null,
          "Administration"
        ),

        h(
          "a",
          {
            href:
              "/admin-login"
          },
          "Officer / Admin Login"
        )
      ),

      /* FOOTER BOTTOM */

      h(
        "div",
        {
          className:
            "public-footer-bottom"
        },

        `© ${new Date().getFullYear()} ProjectWatch Nepal. Government project monitoring, made transparent.`
      )
    )
  );
};

export default PublicPortal;