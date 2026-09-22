import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  getProjects
} from "../services/api";

const MapPage = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [mapReady, setMapReady] =
    useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response =
        await getProjects();

      setProjects(
        response?.projects ||
          response?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Map project loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (
      !mapRef.current ||
      leafletMap.current
    ) {
      return;
    }

    let mounted = true;

    const initializeMap = async () => {
      try {
        const L =
          await import("leaflet");

        if (!mounted) {
          return;
        }

        const map =
          L.map(
            mapRef.current,
            {
              zoomControl: true
            }
          ).setView(
            [28.3949, 84.124],
            7
          );

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              "&copy; OpenStreetMap contributors",
            maxZoom: 19
          }
        ).addTo(map);

        leafletMap.current =
          map;

        setMapReady(true);

        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      } catch (error) {
        console.error(
          "Leaflet initialization failed:",
          error
        );
      }
    };

    initializeMap();

    return () => {
      mounted = false;

      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      !leafletMap.current ||
      !mapReady
    ) {
      return;
    }

    const addMarkers = async () => {
      const L =
        await import("leaflet");

      markersRef.current.forEach(
        (marker) => {
          marker.remove();
        }
      );

      markersRef.current = [];

      const validProjects =
        projects.filter(
          (project) => {
            const lat = Number(
              project.latitude ??
                project.location?.latitude
            );

            const lng = Number(
              project.longitude ??
                project.location?.longitude
            );

            return (
              !Number.isNaN(lat) &&
              !Number.isNaN(lng) &&
              lat >= -90 &&
              lat <= 90 &&
              lng >= -180 &&
              lng <= 180
            );
          }
        );

      validProjects.forEach(
        (project) => {
          const lat =
            Number(
              project.latitude ??
                project.location?.latitude
            );

          const lng =
            Number(
              project.longitude ??
                project.location?.longitude
            );

          const marker =
            L.marker([
              lat,
              lng
            ]).addTo(
              leafletMap.current
            );

          const projectName =
            project.name ||
            "Government Project";

          marker.bindPopup(`
            <div style="min-width:220px">
              <strong>${projectName}</strong>
              <br/>
              ${
                project.district ||
                project.province ||
                ""
              }
              <br/>
              Progress:
              ${
                project.progress ||
                0
              }%
              <br/>
              Status:
              ${
                project.status ||
                "Unknown"
              }
            </div>
          `);

          markersRef.current.push(
            marker
          );
        }
      );

      if (
        validProjects.length === 1
      ) {
        const project =
          validProjects[0];

        const lat =
          Number(
            project.latitude ??
              project.location?.latitude
          );

        const lng =
          Number(
            project.longitude ??
              project.location?.longitude
          );

        leafletMap.current.setView(
          [lat, lng],
          13
        );
      }
    };

    addMarkers();
  }, [
    projects,
    mapReady
  ]);

  const projectsWithGPS =
    projects.filter(
      (project) => {
        const lat = Number(
          project.latitude ??
            project.location?.latitude
        );

        const lng = Number(
          project.longitude ??
            project.location?.longitude
        );

        return (
          !Number.isNaN(lat) &&
          !Number.isNaN(lng)
        );
      }
    );

  return React.createElement(
    "div",
    {
      className:
        "page-container map-page"
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
          "Monitor government projects across Nepal."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",
          onClick:
            loadProjects
        },
        "↻ Refresh Map"
      )
    ),

    React.createElement(
      "div",
      {
        className:
          "map-summary"
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
          projectsWithGPS.length
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
          "map-container"
      },

      React.createElement(
        "div",
        {
          ref: mapRef,
          className:
            "project-map"
        }
      ),

      loading
        ? React.createElement(
            "div",
            {
              className:
                "map-loading"
            },
            "Loading project locations..."
          )
        : null
    ),

    !loading &&
    projectsWithGPS.length === 0
      ? React.createElement(
          "div",
          {
            className:
              "map-info-card"
          },

          React.createElement(
            "strong",
            null,
            "No GPS coordinates available"
          ),

          React.createElement(
            "p",
            null,
            "Projects will appear on the map after latitude and longitude are recorded."
          )
        )
      : null
  );
};

export default MapPage;