import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  getProjects
} from "../services/api";

const h = React.createElement;

const MapPage = () => {
  const navigate = useNavigate();

  const mapContainerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const markersRef =
    useRef([]);

  const tileLayerRef =
    useRef(null);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tileError, setTileError] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [riskFilter, setRiskFilter] =
    useState("All Risk");

  /* =========================================
     LOAD PROJECTS
  ========================================= */

  const loadProjects = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getProjects();

      let data =
        result?.projects ||
        result?.data ||
        result;

      if (
        data &&
        !Array.isArray(data) &&
        Array.isArray(data.projects)
      ) {
        data = data.projects;
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      setProjects(data);

    } catch (err) {
      console.error(
        "Map project loading error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load projects."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects(false);
  }, []);

  /* =========================================
     GET COORDINATES
  ========================================= */

  const getCoordinates = (
    project
  ) => {
    const latitude =
      Number(
        project?.latitude ??
        project?.lat ??
        project?.location?.latitude ??
        project?.location?.lat
      );

    const longitude =
      Number(
        project?.longitude ??
        project?.lng ??
        project?.lon ??
        project?.location?.longitude ??
        project?.location?.lon
      );

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      return {
        latitude,
        longitude
      };
    }

    return null;
  };

  /* =========================================
     FILTER PROJECTS
  ========================================= */

  const filteredProjects =
    useMemo(() => {

      let result =
        [...projects];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {

        result =
          result.filter(
            (project) => {

              const name =
                project?.name ||
                project?.projectName ||
                "";

              const code =
                project?.projectCode ||
                project?.code ||
                "";

              const province =
                project?.province ||
                "";

              const district =
                project?.district ||
                "";

              const municipality =
                project?.municipality ||
                "";

              const location =
                project?.location ||
                "";

              const text =
                `${name} ${code} ${province} ${district} ${municipality} ${location}`
                  .toLowerCase();

              return text.includes(
                query
              );
            }
          );
      }

      if (
        statusFilter !==
        "All Status"
      ) {

        result =
          result.filter(
            (project) =>
              String(
                project?.status ||
                ""
              ).toLowerCase() ===
              statusFilter.toLowerCase()
          );
      }

      if (
        riskFilter !==
        "All Risk"
      ) {

        result =
          result.filter(
            (project) =>
              String(
                project?.riskLevel ||
                project?.risk ||
                ""
              ).toLowerCase() ===
              riskFilter.toLowerCase()
          );
      }

      return result;

    }, [
      projects,
      search,
      statusFilter,
      riskFilter
    ]);

  /* =========================================
     INITIALIZE LEAFLET MAP
  ========================================= */

  useEffect(() => {

    if (
      loading ||
      !mapContainerRef.current
    ) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map =
      L.map(
        mapContainerRef.current,
        {
          zoomControl: true,
          attributionControl: true
        }
      );

    /* Nepal */

    map.setView(
      [28.3949, 84.1240],
      7
    );

    /* OpenStreetMap */

    const tileLayer =
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            "&copy; OpenStreetMap contributors",

          maxZoom: 19,

          minZoom: 5
        }
      );

    tileLayer.addTo(map);

    tileLayerRef.current =
      tileLayer;

    tileLayer.on(
      "tileerror",
      () => {

        console.error(
          "OpenStreetMap tile failed to load."
        );

        setTileError(true);
      }
    );

    tileLayer.on(
      "tileload",
      () => {
        setTileError(false);
      }
    );

    mapRef.current =
      map;

    /* Scale */

    L.control
      .scale({
        imperial: false
      })
      .addTo(map);

    /* Fix map size */

    setTimeout(() => {

      if (map) {
        map.invalidateSize(true);
      }

    }, 500);

    window.setTimeout(() => {

      if (map) {
        map.invalidateSize(true);
      }

    }, 1200);

    const handleResize =
      () => {

        if (mapRef.current) {
          mapRef.current
            .invalidateSize(true);
        }

      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current =
        null;

      tileLayerRef.current =
        null;

    };

  }, [loading]);

  /* =========================================
     MARKER ICON
  ========================================= */

  const createMarkerIcon = (
    project
  ) => {

    const status =
      String(
        project?.status ||
        ""
      ).toLowerCase();

    let symbol =
      "●";

    if (
      status.includes(
        "complete"
      )
    ) {
      symbol = "✓";

    } else if (
      status.includes(
        "delay"
      )
    ) {
      symbol = "!";

    } else if (
      status.includes(
        "critical"
      )
    ) {
      symbol = "!";

    }

    return L.divIcon({

      className:
        "project-map-marker-wrapper",

      html:
        `<div class="project-map-marker">
          ${symbol}
        </div>`,

      iconSize: [
        34,
        34
      ],

      iconAnchor: [
        17,
        17
      ],

      popupAnchor: [
        0,
        -17
      ]

    });
  };

  /* =========================================
     UPDATE MARKERS
  ========================================= */

  useEffect(() => {

    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    /* Remove old markers */

    markersRef.current.forEach(
      (marker) => {

        try {
          map.removeLayer(
            marker
          );
        } catch (err) {
          console.error(err);
        }

      }
    );

    markersRef.current =
      [];

    /* Find mapped projects */

    const mappedProjects =
      filteredProjects.filter(
        (project) =>
          getCoordinates(
            project
          )
      );

    /* Add markers */

    mappedProjects.forEach(
      (project) => {

        const coordinates =
          getCoordinates(
            project
          );

        if (!coordinates) {
          return;
        }

        const name =
          project?.name ||
          project?.projectName ||
          "Unnamed Project";

        const code =
          project?.projectCode ||
          project?.code ||
          "N/A";

        const status =
          project?.status ||
          "Unknown";

        const risk =
          project?.riskLevel ||
          project?.risk ||
          "Unknown";

        const progress =
          Number(
            project?.progress ??
            project?.completionPercentage ??
            project?.completion ??
            0
          );

        const safeProgress =
          Math.min(
            100,
            Math.max(
              0,
              Number.isFinite(
                progress
              )
                ? progress
                : 0
            )
          );

        const budget =
          Number(
            project?.budget ??
            project?.totalBudget ??
            0
          );

        const budgetText =
          budget > 0
            ? `NPR ${budget.toLocaleString(
                "en-IN"
              )}`
            : "NPR 0";

        const municipality =
          project?.municipality ||
          "N/A";

        const district =
          project?.district ||
          "N/A";

        const province =
          project?.province ||
          "N/A";

        const projectId =
          project?._id ||
          project?.id;

        const popup =
          `
          <div class="project-map-popup">

            <div class="map-popup-code">
              ${code}
            </div>

            <h3>
              ${name}
            </h3>

            <div class="map-popup-location">
              📍 ${municipality},
              ${district},
              ${province}
            </div>

            <div class="map-popup-row">
              <span>Status</span>
              <strong>${status}</strong>
            </div>

            <div class="map-popup-row">
              <span>Risk</span>
              <strong>${risk}</strong>
            </div>

            <div class="map-popup-row">
              <span>Budget</span>
              <strong>${budgetText}</strong>
            </div>

            <div class="map-popup-progress">

              <div class="map-popup-progress-head">
                <span>Progress</span>
                <strong>${safeProgress}%</strong>
              </div>

              <div class="map-popup-progress-track">

                <div
                  class="map-popup-progress-fill"
                  style="width:${safeProgress}%"
                ></div>

              </div>

            </div>

            ${
              projectId
                ? `
                  <button
                    class="map-popup-view-btn"
                    data-project-id="${projectId}"
                  >
                    View Project
                  </button>
                `
                : ""
            }

          </div>
          `;

        const marker =
          L.marker(
            [
              coordinates.latitude,
              coordinates.longitude
            ],
            {
              icon:
                createMarkerIcon(
                  project
                )
            }
          )
            .addTo(map)
            .bindPopup(
              popup,
              {
                maxWidth: 320
              }
            );

        marker.on(
          "popupopen",
          () => {

            if (!projectId) {
              return;
            }

            const button =
              document.querySelector(
                `[data-project-id="${projectId}"]`
              );

            if (button) {

              button.onclick =
                () => {

                  navigate(
                    `/projects/${projectId}`
                  );

                };

            }

          }
        );

        markersRef.current.push(
          marker
        );

      }
    );

    /* =====================================
       MAP VIEW
    ===================================== */

    if (
      mappedProjects.length > 0
    ) {

      const bounds =
        L.latLngBounds([]);

      mappedProjects.forEach(
        (project) => {

          const coordinates =
            getCoordinates(
              project
            );

          if (coordinates) {

            bounds.extend([
              coordinates.latitude,
              coordinates.longitude
            ]);

          }

        }
      );

      if (
        bounds.isValid()
      ) {

        map.fitBounds(
          bounds,
          {
            padding: [
              50,
              50
            ],
            maxZoom: 12
          }
        );

      }

    } else {

      /* Keep Nepal visible */

      map.setView(
        [28.3949, 84.1240],
        7
      );

    }

    setTimeout(() => {

      map.invalidateSize(
        true
      );

    }, 300);

  }, [
    filteredProjects,
    navigate
  ]);

  /* =========================================
     COUNTS
  ========================================= */

  const mappedCount =
    filteredProjects.filter(
      (project) =>
        getCoordinates(
          project
        )
    ).length;

  const unmappedCount =
    filteredProjects.length -
    mappedCount;

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters =
    () => {

      setSearch("");

      setStatusFilter(
        "All Status"
      );

      setRiskFilter(
        "All Risk"
      );

    };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return h(
      "div",
      {
        className:
          "map-page-loading"
      },

      h(
        "div",
        {
          className:
            "map-loading-icon"
        },
        "⟳"
      ),

      h(
        "h3",
        null,
        "Loading Project Map..."
      ),

      h(
        "p",
        null,
        "Loading project locations."
      )

    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return h(
    "div",
    {
      className:
        "page project-map-page"
    },

    /* HEADER */

    h(
      "div",
      {
        className:
          "project-map-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Live Project Map"
        ),

        h(
          "p",
          null,
          "Monitor government projects across Nepal"
        )

      ),

      h(
        "div",
        {
          className:
            "project-map-header-actions"
        },

        h(
          "button",
          {
            className:
              "map-refresh-btn",

            onClick:
              () =>
                loadProjects(true),

            disabled:
              refreshing
          },

          refreshing
            ? "⟳ Refreshing..."
            : "↻ Refresh"

        )

      )

    ),

    /* ERROR */

    error
      ? h(
          "div",
          {
            className:
              "map-page-error"
          },

          "⚠️ ",
          error
        )
      : null,

    /* CONTROLS */

    h(
      "div",
      {
        className:
          "project-map-controls"
      },

      /* SEARCH */

      h(
        "div",
        {
          className:
            "map-search-box"
        },

        h(
          "span",
          {
            className:
              "map-search-icon"
          },
          "⌕"
        ),

        h(
          "input",
          {
            type: "text",

            value:
              search,

            placeholder:
              "Search project, code, province, district...",

            onChange:
              (event) =>
                setSearch(
                  event.target.value
                )
          }
        )

      ),

      /* STATUS */

      h(
        "select",
        {
          value:
            statusFilter,

          onChange:
            (event) =>
              setStatusFilter(
                event.target.value
              )
        },

        h(
          "option",
          null,
          "All Status"
        ),

        h(
          "option",
          null,
          "Active"
        ),

        h(
          "option",
          null,
          "Delayed"
        ),

        h(
          "option",
          null,
          "Completed"
        ),

        h(
          "option",
          null,
          "Critical"
        )

      ),

      /* RISK */

      h(
        "select",
        {
          value:
            riskFilter,

          onChange:
            (event) =>
              setRiskFilter(
                event.target.value
              )
        },

        h(
          "option",
          null,
          "All Risk"
        ),

        h(
          "option",
          null,
          "Low"
        ),

        h(
          "option",
          null,
          "Medium"
        ),

        h(
          "option",
          null,
          "High"
        ),

        h(
          "option",
          null,
          "Critical"
        )

      ),

      /* CLEAR */

      h(
        "button",
        {
          className:
            "map-clear-btn",

          onClick:
            clearFilters
        },

        "Clear Filters"

      )

    ),

    /* STATS */

    h(
      "div",
      {
        className:
          "map-mini-stats"
      },

      h(
        "div",
        {
          className:
            "map-mini-stat"
        },

        h(
          "span",
          null,
          "Projects Found"
        ),

        h(
          "strong",
          null,
          filteredProjects.length
        )

      ),

      h(
        "div",
        {
          className:
            "map-mini-stat"
        },

        h(
          "span",
          null,
          "Mapped"
        ),

        h(
          "strong",
          null,
          mappedCount
        )

      ),

      h(
        "div",
        {
          className:
            "map-mini-stat"
        },

        h(
          "span",
          null,
          "No Coordinates"
        ),

        h(
          "strong",
          null,
          unmappedCount
        )

      )

    ),

    /* MAP CARD */

    h(
      "div",
      {
        className:
          "project-map-card"
      },

      h(
        "div",
        {
          className:
            "project-map-card-header"
        },

        h(
          "div",
          null,

          h(
            "h3",
            null,
            "🗺️ Project Locations"
          ),

          h(
            "p",
            null,
            "Click a marker to view project information"
          )

        ),

        h(
          "span",
          {
            className:
              "map-live-badge"
          },

          "● LIVE"

        )

      ),

      /* ACTUAL MAP */

      h(
        "div",
        {
          ref:
            mapContainerRef,

          className:
            "project-map-container"
        }
      ),

      /* TILE ERROR */

      tileError
        ? h(
            "div",
            {
              className:
                "map-tile-error"
            },

            h(
              "strong",
              null,
              "⚠️ Map tiles could not be loaded"
            ),

            h(
              "span",
              null,
              "Please check your internet connection."
            )

          )
        : null

    ),

    /* NO COORDINATES */

    unmappedCount > 0
      ? h(
          "div",
          {
            className:
              "map-coordinate-notice"
          },

          h(
            "strong",
            null,
            "📍 "
          ),

          h(
            "span",
            null,

            `${unmappedCount} project${
              unmappedCount === 1
                ? ""
                : "s"
            } ${
              unmappedCount === 1
                ? "does"
                : "do"
            } not have valid latitude/longitude coordinates, so ${
              unmappedCount === 1
                ? "it is"
                : "they are"
            } not shown on the map.`

          )

        )
      : null

  );
};

export default MapPage;