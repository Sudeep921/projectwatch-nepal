import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getProjects } from "../services/api";


/* =========================================
   LEAFLET DEFAULT ICON FIX
========================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


/* =========================================
   NEPAL CENTER
========================================= */

const NEPAL_CENTER = [
  28.3949,
  84.124
];


/* =========================================
   MAP FLY COMPONENT
========================================= */

function MapController({
  selectedProject,
  searchedLocation
}) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedProject &&
      selectedProject.latitude &&
      selectedProject.longitude
    ) {
      map.flyTo(
        [
          Number(selectedProject.latitude),
          Number(selectedProject.longitude)
        ],
        13,
        {
          duration: 1.2
        }
      );
    }
  }, [selectedProject, map]);

  useEffect(() => {
    if (
      searchedLocation &&
      searchedLocation.lat &&
      searchedLocation.lon
    ) {
      map.flyTo(
        [
          Number(searchedLocation.lat),
          Number(searchedLocation.lon)
        ],
        13,
        {
          duration: 1.2
        }
      );
    }
  }, [searchedLocation, map]);

  return null;
}


/* =========================================
   HELPERS
========================================= */

const normalizeProject = (item) => {
  return {
    ...item,

    id:
      item._id ||
      item.id ||
      item.projectId ||
      Math.random(),

    projectName:
      item.projectName ||
      item.name ||
      "Unnamed Project",

    projectId:
      item.projectId ||
      item.code ||
      item._id ||
      "N/A",

    province:
      item.province ||
      "Unknown",

    district:
      item.district ||
      "Unknown",

    municipality:
      item.municipality ||
      "",

    budget:
      item.budget ||
      0,

    progress:
      Number(item.progress || 0),

    status:
      item.status ||
      "Active",

    riskLevel:
      item.riskLevel ||
      item.risk ||
      "Low",

    latitude:
      item.latitude ??
      item.location?.latitude ??
      item.location?.lat ??
      null,

    longitude:
      item.longitude ??
      item.location?.longitude ??
      item.location?.lng ??
      null
  };
};


const formatBudget = (budget) => {
  const value =
    Number(budget || 0);

  if (!value) {
    return "NPR 0";
  }

  if (value >= 1000000000) {
    return (
      "NPR " +
      (value / 1000000000).toFixed(2) +
      "B"
    );
  }

  if (value >= 1000000) {
    return (
      "NPR " +
      (value / 1000000).toFixed(2) +
      "M"
    );
  }

  if (value >= 1000) {
    return (
      "NPR " +
      (value / 1000).toFixed(2) +
      "K"
    );
  }

  return (
    "NPR " +
    value.toLocaleString()
  );
};


/* =========================================
   MAIN PROJECT MAP
========================================= */

const ProjectMap = () => {
  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  /* Project search */

  const [
    projectSearch,
    setProjectSearch
  ] = useState("");

  /* Location search */

  const [
    locationSearch,
    setLocationSearch
  ] = useState("");

  const [
    locationResults,
    setLocationResults
  ] = useState([]);

  const [
    locationLoading,
    setLocationLoading
  ] = useState(false);

  const [
    locationError,
    setLocationError
  ] = useState("");

  const [
    searchedLocation,
    setSearchedLocation
  ] = useState(null);

  /* Filters */

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

  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);

  const [
    refreshing,
    setRefreshing
  ] = useState(false);

  const searchTimer =
    useRef(null);


  /* =========================================
     LOAD PROJECTS
  ========================================= */

  const loadProjects =
    async () => {
      try {
        setError("");

        if (!refreshing) {
          setLoading(true);
        }

        const data =
          await getProjects();

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (
          Array.isArray(
            data.projects
          )
        ) {
          list =
            data.projects;
        } else if (
          Array.isArray(
            data.data
          )
        ) {
          list =
            data.data;
        }

        setProjects(
          list.map(
            normalizeProject
          )
        );
      } catch (err) {
        console.error(
          "Map projects error:",
          err
        );

        setError(
          err.message ||
          "Unable to load projects"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);


  /* =========================================
     PROVINCES
  ========================================= */

  const provinces =
    useMemo(() => {
      const values =
        projects
          .map(
            (project) =>
              project.province
          )
          .filter(Boolean);

      return [
        ...new Set(values)
      ];
    }, [projects]);


  /* =========================================
     FILTER PROJECTS
  ========================================= */

  const filteredProjects =
    useMemo(() => {
      const search =
        projectSearch
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          const matchesSearch =
            !search ||
            project.projectName
              .toLowerCase()
              .includes(search) ||
            project.projectId
              .toLowerCase()
              .includes(search) ||
            project.province
              .toLowerCase()
              .includes(search) ||
            project.district
              .toLowerCase()
              .includes(search) ||
            project.municipality
              .toLowerCase()
              .includes(search);

          const matchesProvince =
            province ===
              "All Provinces" ||
            project.province ===
              province;

          const matchesStatus =
            status ===
              "All Status" ||
            project.status ===
              status;

          const matchesRisk =
            risk === "All Risk" ||
            project.riskLevel ===
              risk;

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
      projectSearch,
      province,
      status,
      risk
    ]);


  /* =========================================
     GPS PROJECTS
  ========================================= */

  const mappedProjects =
    useMemo(() => {
      return filteredProjects.filter(
        (project) =>
          project.latitude !==
            null &&
          project.longitude !==
            null &&
          project.latitude !==
            "" &&
          project.longitude !==
            ""
      );
    }, [filteredProjects]);


  /* =========================================
     STATISTICS
  ========================================= */

  const totalProjects =
    projects.length;

  const gpsProjects =
    projects.filter(
      (project) =>
        project.latitude !==
          null &&
        project.longitude !==
          null &&
        project.latitude !==
          "" &&
        project.longitude !==
          ""
    ).length;

  const criticalProjects =
    projects.filter(
      (project) =>
        project.riskLevel ===
        "Critical"
    ).length;


  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setProjectSearch("");

    setLocationSearch("");

    setProvince(
      "All Provinces"
    );

    setStatus(
      "All Status"
    );

    setRisk(
      "All Risk"
    );

    setLocationResults([]);

    setLocationError("");

    setSearchedLocation(
      null
    );

    setSelectedProject(
      null
    );
  };


  /* =========================================
     LOCATION SEARCH
  ========================================= */

  const searchLocation =
    async (event) => {
      if (event) {
        event.preventDefault();
      }

      const query =
        locationSearch.trim();

      if (!query) {
        setLocationResults([]);

        setLocationError(
          "Type a location to search."
        );

        return;
      }

      try {
        setLocationLoading(
          true
        );

        setLocationError("");

        const url =
          "https://nominatim.openstreetmap.org/search" +
          "?format=json" +
          "&limit=5" +
          "&countrycodes=np" +
          "&q=" +
          encodeURIComponent(
            query
          );

        const response =
          await fetch(
            url,
            {
              headers: {
                Accept:
                  "application/json"
              }
            }
          );

        if (!response.ok) {
          throw new Error(
            "Location search failed"
          );
        }

        const data =
          await response.json();

        setLocationResults(
          data
        );

        if (!data.length) {
          setLocationError(
            "No Nepal location found."
          );
        }
      } catch (err) {
        console.error(
          "Location search:",
          err
        );

        setLocationError(
          "Unable to search location."
        );
      } finally {
        setLocationLoading(
          false
        );
      }
    };


  /* =========================================
     SELECT LOCATION
  ========================================= */

  const selectLocation =
    (location) => {
      setSearchedLocation({
        lat:
          location.lat,

        lon:
          location.lon,

        displayName:
          location.display_name
      });

      setLocationResults([]);

      setLocationSearch(
        location.display_name
      );
    };


  /* =========================================
     PROJECT SELECT
  ========================================= */

  const selectProject =
    (project) => {
      setSelectedProject(
        project
      );

      setSearchedLocation(
        null
      );
    };


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh =
    async () => {
      setRefreshing(
        true
      );

      await loadProjects();
    };


  /* =========================================
     SEARCH PROJECT LIVE
  ========================================= */

  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(
        searchTimer.current
      );
    }

    searchTimer.current =
      setTimeout(() => {
        /* filtering is handled by useMemo */
      }, 150);

    return () => {
      if (searchTimer.current) {
        clearTimeout(
          searchTimer.current
        );
      }
    };
  }, [projectSearch]);


  /* =========================================
     STATUS CLASS
  ========================================= */

  const statusClass =
    (value) => {
      return String(
        value || ""
      )
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        );
    };


  const riskClass =
    (value) => {
      return String(
        value || ""
      )
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        );
    };


  /* =========================================
     RENDER
  ========================================= */

  return React.createElement(
    "div",
    {
      className:
        "map-monitoring-page"
    },

    /* PAGE HEADER */

    React.createElement(
      "div",
      {
        className:
          "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "page-eyebrow"
          },
          "GEOSPATIAL MONITORING"
        ),

        React.createElement(
          "h1",
          null,
          "Live Project Map"
        ),

        React.createElement(
          "p",
          null,
          "Monitor government projects, locations, progress and risk across Nepal."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",

          onClick:
            handleRefresh,

          disabled:
            refreshing
        },

        refreshing
          ? "Refreshing..."
          : "↻ Refresh Map"
      )
    ),

    /* STATS */

    React.createElement(
      "div",
      {
        className:
          "map-stats-grid"
      },

      React.createElement(
        "div",
        {
          className:
            "map-stat-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-stat-icon"
          },
          "◉"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            totalProjects
          ),

          React.createElement(
            "span",
            null,
            "Total Projects"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "map-stat-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-stat-icon"
          },
          "⌖"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            gpsProjects
          ),

          React.createElement(
            "span",
            null,
            "GPS Located"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "map-stat-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-stat-icon"
          },
          "⚠"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            criticalProjects
          ),

          React.createElement(
            "span",
            null,
            "Critical Risk"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "map-stat-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-stat-icon"
          },
          "◎"
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
            "Filtered Results"
          )
        )
      )
    ),

    /* FILTER AREA */

    React.createElement(
      "div",
      {
        className:
          "map-filter-panel"
      },

      React.createElement(
        "div",
        {
          className:
            "map-filter-heading"
        },

        React.createElement(
          "div",
          null,

          React.createElement(
            "h2",
            null,
            "Map Search & Filters"
          ),

          React.createElement(
            "p",
            null,
            "Find projects or search any location in Nepal."
          )
        ),

        React.createElement(
          "button",
          {
            className:
              "clear-filter-button",

            onClick:
              clearFilters
          },
          "Clear Filters"
        )
      ),

      /* PROJECT SEARCH */

      React.createElement(
        "div",
        {
          className:
            "map-filter-grid"
        },

        React.createElement(
          "div",
          {
            className:
              "map-search-field"
          },

          React.createElement(
            "label",
            null,
            "Search Projects"
          ),

          React.createElement(
            "div",
            {
              className:
                "map-search-input"
            },

            React.createElement(
              "span",
              null,
              "⌕"
            ),

            React.createElement(
              "input",
              {
                type:
                  "text",

                placeholder:
                  "Project name, ID, district...",

                value:
                  projectSearch,

                onChange:
                  (event) =>
                    setProjectSearch(
                      event.target.value
                    )
              }
            )
          )
        ),

        /* LOCATION SEARCH */

        React.createElement(
          "div",
          {
            className:
              "map-search-field"
          },

          React.createElement(
            "label",
            null,
            "Search Location"
          ),

          React.createElement(
            "form",
            {
              className:
                "map-location-search",

              onSubmit:
                searchLocation
            },

            React.createElement(
              "input",
              {
                type:
                  "text",

                placeholder:
                  "Kathmandu, Pokhara, Biratnagar...",

                value:
                  locationSearch,

                onChange:
                  (event) =>
                    setLocationSearch(
                      event.target.value
                    )
              }
            ),

            React.createElement(
              "button",
              {
                type:
                  "submit",

                disabled:
                  locationLoading
              },

              locationLoading
                ? "..."
                : "Search"
            )
          )
        ),

        /* PROVINCE */

        React.createElement(
          "div",
          {
            className:
              "map-filter-field"
          },

          React.createElement(
            "label",
            null,
            "Province"
          ),

          React.createElement(
            "select",
            {
              value:
                province,

              onChange:
                (event) =>
                  setProvince(
                    event.target.value
                  )
            },

            React.createElement(
              "option",
              null,
              "All Provinces"
            ),

            provinces.map(
              (item) =>
                React.createElement(
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
          )
        ),

        /* STATUS */

        React.createElement(
          "div",
          {
            className:
              "map-filter-field"
          },

          React.createElement(
            "label",
            null,
            "Status"
          ),

          React.createElement(
            "select",
            {
              value:
                status,

              onChange:
                (event) =>
                  setStatus(
                    event.target.value
                  )
            },

            React.createElement(
              "option",
              null,
              "All Status"
            ),

            React.createElement(
              "option",
              null,
              "Active"
            ),

            React.createElement(
              "option",
              null,
              "Delayed"
            ),

            React.createElement(
              "option",
              null,
              "Completed"
            ),

            React.createElement(
              "option",
              null,
              "Critical"
            )
          )
        ),

        /* RISK */

        React.createElement(
          "div",
          {
            className:
              "map-filter-field"
          },

          React.createElement(
            "label",
            null,
            "Risk Level"
          ),

          React.createElement(
            "select",
            {
              value:
                risk,

              onChange:
                (event) =>
                  setRisk(
                    event.target.value
                  )
            },

            React.createElement(
              "option",
              null,
              "All Risk"
            ),

            React.createElement(
              "option",
              null,
              "Low"
            ),

            React.createElement(
              "option",
              null,
              "Medium"
            ),

            React.createElement(
              "option",
              null,
              "High"
            ),

            React.createElement(
              "option",
              null,
              "Critical"
            )
          )
        )
      ),

      /* LOCATION RESULTS */

      locationResults.length > 0 &&
        React.createElement(
          "div",
          {
            className:
              "location-results"
          },

          React.createElement(
            "div",
            {
              className:
                "location-results-title"
            },
            "Location Results"
          ),

          locationResults.map(
            (
              location,
              index
            ) =>
              React.createElement(
                "button",
                {
                  key:
                    location.place_id ||
                    index,

                  className:
                    "location-result-item",

                  onClick:
                    () =>
                      selectLocation(
                        location
                      )
                },

                React.createElement(
                  "span",
                  null,
                  "⌖"
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "strong",
                    null,
                    location.display_name
                  ),

                  React.createElement(
                    "small",
                    null,
                    "Open location on map"
                  )
                )
              )
          )
        ),

      locationError &&
        React.createElement(
          "div",
          {
            className:
              "map-search-error"
          },
          locationError
        ),

      searchedLocation &&
        React.createElement(
          "div",
          {
            className:
              "selected-location-banner"
          },

          React.createElement(
            "span",
            null,
            "⌖"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              "Location selected"
            ),

            React.createElement(
              "small",
              null,
              searchedLocation.displayName
            )
          ),

          React.createElement(
            "button",
            {
              onClick:
                () => {
                  setSearchedLocation(
                    null
                  );

                  setLocationSearch(
                    ""
                  );
                }
            },
            "×"
          )
        )
    ),

    /* ERROR */

    error &&
      React.createElement(
        "div",
        {
          className:
            "page-error"
        },

        React.createElement(
          "strong",
          null,
          "Unable to load map data"
        ),

        React.createElement(
          "span",
          null,
          error
        )
      ),

    /* MAP + PROJECT LIST */

    React.createElement(
      "div",
      {
        className:
          "map-content-grid"
      },

      /* MAP */

      React.createElement(
        "div",
        {
          className:
            "live-map-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-card-header"
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Nepal Project Map"
            ),

            React.createElement(
              "p",
              null,
              mappedProjects.length +
                " projects currently visible"
            )
          ),

          React.createElement(
            "span",
            {
              className:
                "map-live-badge"
            },
            "● LIVE"
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "project-map"
          },

          loading
            ? React.createElement(
                "div",
                {
                  className:
                    "map-loading"
                },
                "Loading project map..."
              )
            : React.createElement(
                MapContainer,
                {
                  center:
                    NEPAL_CENTER,

                  zoom:
                    7,

                  scrollWheelZoom:
                    true,

                  className:
                    "leaflet-map"
                },

                React.createElement(
                  TileLayer,
                  {
                    attribution:
                      "&copy; OpenStreetMap contributors",

                    url:
                      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                ),

                React.createElement(
                  MapController,
                  {
                    selectedProject:
                      selectedProject,

                    searchedLocation:
                      searchedLocation
                  }
                ),

                mappedProjects.map(
                  (project) =>
                    React.createElement(
                      Marker,
                      {
                        key:
                          project.id,

                        position: [
                          Number(
                            project.latitude
                          ),

                          Number(
                            project.longitude
                          )
                        ],

                        eventHandlers: {
                          click:
                            () =>
                              setSelectedProject(
                                project
                              )
                        }
                      },

                      React.createElement(
                        Popup,
                        null,

                        React.createElement(
                          "div",
                          {
                            className:
                              "map-popup"
                          },

                          React.createElement(
                            "strong",
                            null,
                            project.projectName
                          ),

                          React.createElement(
                            "span",
                            null,
                            project.projectId
                          ),

                          React.createElement(
                            "p",
                            null,
                            project.district +
                              ", " +
                              project.province
                          ),

                          React.createElement(
                            "div",
                            {
                              className:
                                "popup-progress"
                            },

                            React.createElement(
                              "span",
                              null,
                              "Progress"
                            ),

                            React.createElement(
                              "b",
                              null,
                              project.progress +
                                "%"
                            )
                          )
                        )
                      )
                    )
                )
              )
        )
      ),

      /* PROJECT LIST */

      React.createElement(
        "div",
        {
          className:
            "map-project-list-card"
        },

        React.createElement(
          "div",
          {
            className:
              "map-card-header"
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
              filteredProjects.length +
                " matching projects"
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "map-project-list"
          },

          filteredProjects.length === 0

            ? React.createElement(
                "div",
                {
                  className:
                    "map-empty-state"
                },

                React.createElement(
                  "div",
                  null,
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

            : filteredProjects.map(
                (project) =>
                  React.createElement(
                    "button",
                    {
                      key:
                        project.id,

                      className:
                        "mapped-project-item" +
                        (
                          selectedProject &&
                          selectedProject.id ===
                            project.id
                            ? " selected"
                            : ""
                        ),

                      onClick:
                        () =>
                          selectProject(
                            project
                          )
                    },

                    React.createElement(
                      "div",
                      {
                        className:
                          "mapped-project-top"
                      },

                      React.createElement(
                        "div",
                        {
                          className:
                            "mapped-project-icon"
                        },
                        "⌖"
                      ),

                      React.createElement(
                        "div",
                        {
                          className:
                            "mapped-project-info"
                        },

                        React.createElement(
                          "strong",
                          null,
                          project.projectName
                        ),

                        React.createElement(
                          "small",
                          null,
                          project.projectId
                        )
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "mapped-project-location"
                      },

                      project.district +
                        ", " +
                        project.province
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "mapped-project-bottom"
                      },

                      React.createElement(
                        "span",
                        {
                          className:
                            "status-badge " +
                            statusClass(
                              project.status
                            )
                        },
                        project.status
                      ),

                      React.createElement(
                        "span",
                        {
                          className:
                            "risk-badge " +
                            riskClass(
                              project.riskLevel
                            )
                        },
                        project.riskLevel
                      ),

                      React.createElement(
                        "b",
                        null,
                        project.progress +
                          "%"
                      )
                    )
                  )
              )
        )
      )
    )
  );
};

export default ProjectMap;