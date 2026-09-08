import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

/* =====================================================
   PROJECT DATA
===================================================== */

const PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    icon: "🛣️",
    district: "Kathmandu",
    province: "Bagmati",
    budget: "NPR 8.4B",
    progress: 42,
    status: "Critical",
    risk: "Critical",
    updated: "2 hrs ago",
    contractor: "ABC Infrastructure Pvt. Ltd.",
    department: "Department of Roads",
    lat: 27.6939,
    lng: 85.3157
  },

  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    icon: "🌉",
    district: "Kaski",
    province: "Gandaki",
    budget: "NPR 3.8B",
    progress: 38,
    status: "Delayed",
    risk: "High",
    updated: "5 hrs ago",
    contractor: "Gandaki Construction Group",
    department: "Department of Roads",
    lat: 28.2096,
    lng: 83.9856
  },

  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    icon: "🏥",
    district: "Morang",
    province: "Koshi",
    budget: "NPR 2.1B",
    progress: 56,
    status: "Active",
    risk: "Medium",
    updated: "1 day ago",
    contractor: "Himalayan Builders Pvt. Ltd.",
    department: "Ministry of Health",
    lat: 26.4525,
    lng: 87.2718
  },

  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    icon: "🛣️",
    district: "Rupandehi",
    province: "Lumbini",
    budget: "NPR 5.6B",
    progress: 74,
    status: "Active",
    risk: "Low",
    updated: "1 day ago",
    contractor: "National Road Builders",
    department: "Department of Roads",
    lat: 27.7006,
    lng: 83.4483
  },

  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    icon: "💧",
    district: "Dhanusha",
    province: "Madhesh",
    budget: "NPR 4.2B",
    progress: 29,
    status: "Delayed",
    risk: "High",
    updated: "2 days ago",
    contractor: "Terai Development Contractors",
    department: "Department of Irrigation",
    lat: 26.7288,
    lng: 85.9248
  },

  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    icon: "🏥",
    district: "Surkhet",
    province: "Karnali",
    budget: "NPR 1.7B",
    progress: 91,
    status: "Completed",
    risk: "Low",
    updated: "3 days ago",
    contractor: "Karnali Infrastructure Pvt. Ltd.",
    department: "Ministry of Health",
    lat: 28.6,
    lng: 81.633
  },

  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    icon: "🚰",
    district: "Kanchanpur",
    province: "Sudurpashchim",
    budget: "NPR 980M",
    progress: 63,
    status: "Active",
    risk: "Medium",
    updated: "3 days ago",
    contractor: "Sudur Infrastructure Group",
    department: "Department of Water Supply",
    lat: 28.84,
    lng: 80.32
  },

  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    icon: "🏫",
    district: "Lalitpur",
    province: "Bagmati",
    budget: "NPR 1.2B",
    progress: 81,
    status: "Active",
    risk: "Low",
    updated: "4 days ago",
    contractor: "Kathmandu Valley Builders",
    department: "Ministry of Education",
    lat: 27.6588,
    lng: 85.3247
  }
];


/* =====================================================
   MAP CENTER
===================================================== */

const NEPAL_CENTER = [
  28.3949,
  84.1240
];


/* =====================================================
   MARKER ICONS
===================================================== */

function getStatusColor(status) {
  if (status === "Critical") {
    return "#dc2626";
  }

  if (status === "Delayed") {
    return "#f59e0b";
  }

  if (status === "Completed") {
    return "#16a34a";
  }

  return "#2563eb";
}


/* =====================================================
   PROJECT MARKER
===================================================== */

function createProjectIcon(project) {
  const color = getStatusColor(
    project.status
  );

  return L.divIcon({
    className: "project-map-marker",

    html: `
      <div
        class="real-project-marker"
        style="
          width: 34px;
          height: 34px;
          background: ${color};
          box-shadow:
            0 0 0 6px ${color}25,
            0 5px 15px rgba(15,23,42,.30);
        "
      >
        <div class="marker-inner-dot"></div>
      </div>
    `,

    iconSize: [34, 34],

    iconAnchor: [
      17,
      17
    ],

    popupAnchor: [
      0,
      -18
    ]
  });
}


/* =====================================================
   SEARCH LOCATION MARKER
===================================================== */

const searchedLocationIcon =
  L.divIcon({
    className:
      "clicked-location-marker",

    html: `
      <div
        class="clicked-pin"
        style="
          width: 28px;
          height: 28px;
          background: #7c3aed;
          border: 4px solid #ffffff;
          box-shadow:
            0 0 0 8px rgba(124,58,237,.18),
            0 6px 18px rgba(15,23,42,.30);
        "
      >
        <div class="clicked-pin-center"></div>
      </div>
    `,

    iconSize: [
      28,
      28
    ],

    iconAnchor: [
      14,
      14
    ],

    popupAnchor: [
      0,
      -15
    ]
  });


/* =====================================================
   CLICK MARKER
===================================================== */

const clickedLocationIcon =
  L.divIcon({
    className:
      "clicked-location-marker",

    html: `
      <div class="clicked-pin">
        <div class="clicked-pin-center"></div>
      </div>
    `,

    iconSize: [
      20,
      20
    ],

    iconAnchor: [
      10,
      10
    ]
  });


/* =====================================================
   USER LOCATION ICON
===================================================== */

const userLocationIcon =
  L.divIcon({
    className:
      "user-location-marker",

    html: `
      <div class="user-location-dot">
        <div class="user-location-center"></div>
      </div>
    `,

    iconSize: [
      18,
      18
    ],

    iconAnchor: [
      9,
      9
    ]
  });


/* =====================================================
   MAP CONTROLLER
===================================================== */

function MapController({
  location,
  zoom
}) {
  const map = useMap();

  useEffect(
    function () {
      if (!location) {
        return;
      }

      map.flyTo(
        [
          Number(location.lat),
          Number(location.lng)
        ],
        zoom || 15,
        {
          duration: 1.5
        }
      );
    },
    [
      location,
      zoom,
      map
    ]
  );

  return null;
}


/* =====================================================
   MAP CLICK HANDLER
===================================================== */

function MapClickHandler({
  onClick
}) {
  useMapEvents({
    click: function (event) {
      onClick({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    }
  });

  return null;
}


/* =====================================================
   MAIN MAP PAGE
===================================================== */

function Map({
  setPage,
  onViewProject
}) {
  const [
    search,
    setSearch
  ] = useState("");

  const [
    province,
    setProvince
  ] = useState("All");

  const [
    status,
    setStatus
  ] = useState("All");

  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);

  const [
    searchedLocation,
    setSearchedLocation
  ] = useState(null);

  const [
    clickedLocation,
    setClickedLocation
  ] = useState(null);

  const [
    userLocation,
    setUserLocation
  ] = useState(null);

  const [
    mapMode,
    setMapMode
  ] = useState("street");

  const [
    searchingLocation,
    setSearchingLocation
  ] = useState(false);

  const [
    searchMessage,
    setSearchMessage
  ] = useState("");


  /* =================================================
     FILTER PROJECTS

     IMPORTANT:
     Search text is NOT used here.

     Therefore if user searches "Dhading",
     project markers will NOT disappear.
  ================================================= */

  const filteredProjects =
    useMemo(
      function () {
        return PROJECTS.filter(
          function (project) {
            const matchesProvince =
              province === "All" ||
              project.province === province;

            const matchesStatus =
              status === "All" ||
              project.status === status;

            return (
              matchesProvince &&
              matchesStatus
            );
          }
        );
      },
      [
        province,
        status
      ]
    );


  /* =================================================
     PROJECT SEARCH
  ================================================= */

  function findProject(text) {
    const value =
      text
        .trim()
        .toLowerCase();

    if (!value) {
      return null;
    }

    return PROJECTS.find(
      function (project) {
        return (
          project.name
            .toLowerCase()
            .includes(value) ||

          project.id
            .toLowerCase()
            .includes(value) ||

          project.district
            .toLowerCase()
            .includes(value) ||

          project.province
            .toLowerCase()
            .includes(value)
        );
      }
    );
  }


  /* =================================================
     REAL LOCATION SEARCH

     OpenStreetMap Nominatim
  ================================================= */

  async function searchLocation(
    searchText
  ) {
    const text =
      searchText.trim();

    if (!text) {
      setSearchMessage(
        "Please enter a location."
      );

      return;
    }

    setSearchingLocation(true);
    setSearchMessage("");

    /* ===============================================
       FIRST CHECK PROJECT
    =============================================== */

    const project =
      findProject(text);

    if (project) {
      setSelectedProject(project);

      setSearchedLocation(null);
      setClickedLocation(null);
      setUserLocation(null);

      setSearchMessage(
        "Project found: " +
        project.name
      );

      setSearchingLocation(false);

      return;
    }


    /* ===============================================
       REAL LOCATION SEARCH
    =============================================== */

    try {
      const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=jsonv2" +
        "&addressdetails=1" +
        "&limit=5" +
        "&countrycodes=np" +
        "&q=" +
        encodeURIComponent(
          text + ", Nepal"
        );

      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json"
          }
        });

      if (!response.ok) {
        throw new Error(
          "Location search failed"
        );
      }

      const results =
        await response.json();

      if (
        !results ||
        results.length === 0
      ) {
        setSearchMessage(
          "Location not found: " +
          text
        );

        setSearchingLocation(false);

        return;
      }


      /* =============================================
         BEST RESULT
      ============================================= */

      const result =
        results[0];

      const location = {
        lat: Number(result.lat),
        lng: Number(result.lon),
        name:
          result.display_name,
        type:
          result.type,
        address:
          result.address || {}
      };


      /* =============================================
         SET LOCATION
      ============================================= */

      setSearchedLocation(
        location
      );

      setSelectedProject(
        null
      );

      setClickedLocation(
        null
      );

      setUserLocation(
        null
      );

      setSearchMessage(
        "Found: " +
        result.display_name
      );

    } catch (error) {
      console.error(
        "Location search error:",
        error
      );

      setSearchMessage(
        "Unable to search location. Please try again."
      );
    }

    setSearchingLocation(false);
  }


  /* =================================================
     SEARCH BUTTON
  ================================================= */

  function handleSearch() {
    searchLocation(search);
  }


  /* =================================================
     ENTER SEARCH
  ================================================= */

  function handleSearchKeyDown(
    event
  ) {
    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      searchLocation(search);
    }
  }


  /* =================================================
     PROJECT CLICK
  ================================================= */

  function handleProjectClick(
    project
  ) {
    setSelectedProject(project);

    setSearchedLocation(null);
    setClickedLocation(null);

    setSearch(
      project.name
    );

    setSearchMessage(
      "Project location: " +
      project.name
    );
  }


  /* =================================================
     MAP CLICK
  ================================================= */

  function handleMapClick(
    location
  ) {
    setClickedLocation(
      location
    );

    setSearchedLocation(
      null
    );

    setSelectedProject(
      null
    );

    setSearchMessage(
      "Map location selected."
    );
  }


  /* =================================================
     MY LOCATION
  ================================================= */

  function findMyLocation() {
    if (
      !navigator.geolocation
    ) {
      setSearchMessage(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setSearchMessage(
      "Finding your location..."
    );

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const location = {
          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude
        };

        setUserLocation(
          location
        );

        setSearchedLocation(
          null
        );

        setClickedLocation(
          null
        );

        setSelectedProject(
          null
        );

        setSearchMessage(
          "Your current location"
        );
      },

      function () {
        setSearchMessage(
          "Unable to get your location. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  /* =================================================
     CLEAR SEARCH
  ================================================= */

  function clearSearch() {
    setSearch("");

    setSearchedLocation(
      null
    );

    setClickedLocation(
      null
    );

    setSelectedProject(
      null
    );

    setUserLocation(
      null
    );

    setSearchMessage("");
  }


  /* =================================================
     MAP LOCATION

     Priority:
     searched location
     project
     user location
  ================================================= */

  const mapLocation =
    searchedLocation ||
    selectedProject ||
    userLocation ||
    null;


  /* =================================================
     MAP ZOOM
  ================================================= */

  const mapZoom =
    searchedLocation
      ? 15
      : selectedProject
      ? 15
      : userLocation
      ? 15
      : 7;


  /* =================================================
     UNIQUE PROVINCES
  ================================================= */

  const provinces =
    [
      "All",
      ...Array.from(
        new Set(
          PROJECTS.map(
            function (project) {
              return project.province;
            }
          )
        )
      )
    ];


  /* =================================================
     TILE URL
  ================================================= */

  const streetTile =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const satelliteTile =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";


  /* =================================================
     RENDER
  ================================================= */

  return React.createElement(
    "main",
    {
      className:
        "page-content live-map-page"
    },

    /* ===============================================
       PAGE HEADER
    =============================================== */

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
          "div",
          {
            className:
              "breadcrumb"
          },

          "ProjectWatch Nepal",

          React.createElement(
            "span",
            null,
            "/"
          ),

          " Live Map"
        ),

        React.createElement(
          "h1",
          null,
          "Live Project Map"
        ),

        React.createElement(
          "p",
          null,
          "Explore government projects and real locations across Nepal."
        )
      )
    ),


    /* ===============================================
       SUMMARY CARDS
    =============================================== */

    React.createElement(
      "div",
      {
        className:
          "map-summary-grid"
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
          "📍"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "Mapped Projects"
          ),

          React.createElement(
            "strong",
            null,
            PROJECTS.length
          ),

          React.createElement(
            "small",
            null,
            "Project locations"
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
          "🔴"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "Critical"
          ),

          React.createElement(
            "strong",
            null,

            PROJECTS.filter(
              function (p) {
                return (
                  p.status ===
                  "Critical"
                );
              }
            ).length
          ),

          React.createElement(
            "small",
            null,
            "Immediate attention"
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
          "🟠"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "Delayed"
          ),

          React.createElement(
            "strong",
            null,

            PROJECTS.filter(
              function (p) {
                return (
                  p.status ===
                  "Delayed"
                );
              }
            ).length
          ),

          React.createElement(
            "small",
            null,
            "Behind schedule"
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
          "🟢"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "Active"
          ),

          React.createElement(
            "strong",
            null,

            PROJECTS.filter(
              function (p) {
                return (
                  p.status ===
                  "Active"
                );
              }
            ).length
          ),

          React.createElement(
            "small",
            null,
            "Currently active"
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
          "🗺️"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "Visible"
          ),

          React.createElement(
            "strong",
            null,
            filteredProjects.length
          ),

          React.createElement(
            "small",
            null,
            "On current filters"
          )
        )
      )
    ),


    /* ===============================================
       TOOLBAR
    =============================================== */

    React.createElement(
      "div",
      {
        className:
          "map-toolbar"
      },

      React.createElement(
        "div",
        {
          className:
            "map-search"
        },

        React.createElement(
          "span",
          null,
          "⌕"
        ),

        React.createElement(
          "input",
          {
            type: "text",
            value: search,
            placeholder:
              "Search project, village, place, district...",
            onChange:
              function (event) {
                setSearch(
                  event.target.value
                );
              },
            onKeyDown:
              handleSearchKeyDown
          }
        ),

        React.createElement(
          "button",
          {
            className:
              "map-search-button",
            onClick:
              handleSearch,
            disabled:
              searchingLocation
          },

          searchingLocation
            ? "Searching..."
            : "Search"
        )
      ),

      React.createElement(
        "select",
        {
          className:
            "map-filter-select",
          value:
            province,
          onChange:
            function (event) {
              setProvince(
                event.target.value
              );
            }
        },

        provinces.map(
          function (item) {
            return React.createElement(
              "option",
              {
                key: item,
                value: item
              },
              item === "All"
                ? "All Provinces"
                : item
            );
          }
        )
      ),

      React.createElement(
        "select",
        {
          className:
            "map-filter-select",
          value:
            status,
          onChange:
            function (event) {
              setStatus(
                event.target.value
              );
            }
        },

        React.createElement(
          "option",
          {
            value: "All"
          },
          "All Status"
        ),

        React.createElement(
          "option",
          {
            value:
              "Active"
          },
          "Active"
        ),

        React.createElement(
          "option",
          {
            value:
              "Delayed"
          },
          "Delayed"
        ),

        React.createElement(
          "option",
          {
            value:
              "Critical"
          },
          "Critical"
        ),

        React.createElement(
          "option",
          {
            value:
              "Completed"
          },
          "Completed"
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "map-clear-button",
          onClick:
            clearSearch
        },
        "Clear"
      )
    ),


    /* ===============================================
       SEARCH RESULT
    =============================================== */

    searchMessage
      ? React.createElement(
          "div",
          {
            className:
              "map-search-result"
          },

          React.createElement(
            "span",
            null,
            searchedLocation
              ? "📍"
              : selectedProject
              ? "🛣️"
              : "✓"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              searchedLocation
                ? "Real Location Found"
                : selectedProject
                ? "Project Found"
                : "Map"
            ),

            React.createElement(
              "small",
              null,
              searchMessage
            )
          )
        )
      : null,


    /* ===============================================
       MAP + PROJECT LIST
    =============================================== */

    React.createElement(
      "div",
      {
        className:
          "live-map-layout"
      },

      /* =============================================
         MAP
      ============================================= */

      React.createElement(
        "div",
        {
          className:
            "live-map-container"
        },

        React.createElement(
          MapContainer,
          {
            center:
              NEPAL_CENTER,
            zoom: 7,
            minZoom: 6,
            maxZoom: 19,
            zoomControl: false,
            scrollWheelZoom:
              true
          },

          React.createElement(
            TileLayer,
            {
              key:
                mapMode,

              url:
                mapMode ===
                "satellite"
                  ? satelliteTile
                  : streetTile,

              attribution:
                mapMode ===
                "satellite"
                  ? "&copy; Esri"
                  : "&copy; OpenStreetMap contributors"
            }
          ),


          /* =========================================
             MAP CONTROLLER
          ========================================= */

          React.createElement(
            MapController,
            {
              location:
                mapLocation,
              zoom:
                mapZoom
            }
          ),


          /* =========================================
             MAP CLICK
          ========================================= */

          React.createElement(
            MapClickHandler,
            {
              onClick:
                handleMapClick
            }
          ),


          /* =========================================
             ZOOM
          ========================================= */

          React.createElement(
            ZoomControl,
            {
              position:
                "topleft"
            }
          ),


          /* =========================================
             PROJECT MARKERS
          ========================================= */

          filteredProjects.map(
            function (project) {
              return React.createElement(
                Marker,
                {
                  key:
                    project.id,

                  position: [
                    project.lat,
                    project.lng
                  ],

                  icon:
                    createProjectIcon(
                      project
                    ),

                  eventHandlers: {
                    click:
                      function () {
                        setSelectedProject(
                          project
                        );

                        setSearchedLocation(
                          null
                        );

                        setClickedLocation(
                          null
                        );
                      }
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
                      "div",
                      {
                        className:
                          "popup-project-id"
                      },
                      project.id
                    ),

                    React.createElement(
                      "strong",
                      {
                        className:
                          "popup-project-name"
                      },
                      project.name
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "popup-location"
                      },
                      "📍 " +
                      project.district +
                      ", " +
                      project.province
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "popup-budget"
                      },

                      "Budget: ",

                      React.createElement(
                        "strong",
                        null,
                        project.budget
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "popup-progress"
                      },

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "span",
                          null,
                          "Progress"
                        ),

                        React.createElement(
                          "strong",
                          null,
                          project.progress +
                            "%"
                        )
                      ),

                      React.createElement(
                        "div",
                        {
                          className:
                            "popup-progress-track"
                        },

                        React.createElement(
                          "span",
                          {
                            style: {
                              width:
                                project.progress +
                                "%"
                            }
                          }
                        )
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "popup-bottom"
                      },

                      React.createElement(
                        "span",
                        {
                          className:
                            "popup-status " +
                            project.status.toLowerCase()
                        },
                        project.status
                      ),

                      React.createElement(
                        "button",
                        {
                          onClick:
                            function () {
                              if (
                                onViewProject
                              ) {
                                onViewProject(
                                  project
                                );
                              }
                            }
                        },
                        "View Project"
                      )
                    )
                  )
                )
              );
            }
          ),


          /* =========================================
             REAL SEARCH LOCATION MARKER
          ========================================= */

          searchedLocation
            ? React.createElement(
                Marker,
                {
                  position: [
                    searchedLocation.lat,
                    searchedLocation.lng
                  ],

                  icon:
                    searchedLocationIcon
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
                      {
                        className:
                          "popup-project-name"
                      },
                      searchedLocation.name
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "popup-location"
                      },
                      "📍 Real searched location"
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "coordinate-row"
                      },

                      "Latitude: ",

                      searchedLocation.lat.toFixed(
                        6
                      ),

                      React.createElement(
                        "br"
                      ),

                      "Longitude: ",

                      searchedLocation.lng.toFixed(
                        6
                      )
                    )
                  )
                )
              )
            : null,


          /* =========================================
             MAP CLICK MARKER
          ========================================= */

          clickedLocation
            ? React.createElement(
                Marker,
                {
                  position: [
                    clickedLocation.lat,
                    clickedLocation.lng
                  ],

                  icon:
                    clickedLocationIcon
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
                      {
                        className:
                          "popup-project-name"
                      },
                      "Selected Map Location"
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "coordinate-row"
                      },

                      "Latitude: ",

                      clickedLocation.lat.toFixed(
                        6
                      ),

                      React.createElement(
                        "br"
                      ),

                      "Longitude: ",

                      clickedLocation.lng.toFixed(
                        6
                      )
                    )
                  )
                )
              )
            : null,


          /* =========================================
             USER LOCATION
          ========================================= */

          userLocation
            ? React.createElement(
                Marker,
                {
                  position: [
                    userLocation.lat,
                    userLocation.lng
                  ],

                  icon:
                    userLocationIcon
                },

                React.createElement(
                  Popup,
                  null,
                  "Your current location"
                )
              )
            : null
        ),


        /* ===========================================
           MY LOCATION BUTTON
        =========================================== */

        React.createElement(
          "button",
          {
            className:
              "map-locate-button",
            onClick:
              findMyLocation
          },

          React.createElement(
            "span",
            null,
            "📍"
          ),

          React.createElement(
            "span",
            null,
            "My Location"
          )
        ),


        /* ===========================================
           STREET / SATELLITE
        =========================================== */

        React.createElement(
          "div",
          {
            className:
              "map-mode-switcher"
          },

          React.createElement(
            "button",
            {
              className:
                mapMode ===
                "street"
                  ? "active"
                  : "",
              onClick:
                function () {
                  setMapMode(
                    "street"
                  );
                }
            },
            "Street"
          ),

          React.createElement(
            "button",
            {
              className:
                mapMode ===
                "satellite"
                  ? "active"
                  : "",
              onClick:
                function () {
                  setMapMode(
                    "satellite"
                  );
                }
            },
            "Satellite"
          )
        ),


        /* ===========================================
           LEGEND
        =========================================== */

        React.createElement(
          "div",
          {
            className:
              "map-legend"
          },

          React.createElement(
            "strong",
            null,
            "Project Status"
          ),

          React.createElement(
            "div",
            {
              className:
                "legend-item"
            },

            React.createElement(
              "span",
              {
                className:
                  "legend-dot critical"
              }
            ),

            "Critical"
          ),

          React.createElement(
            "div",
            {
              className:
                "legend-item"
            },

            React.createElement(
              "span",
              {
                className:
                  "legend-dot delayed"
              }
            ),

            "Delayed"
          ),

          React.createElement(
            "div",
            {
              className:
                "legend-item"
            },

            React.createElement(
              "span",
              {
                className:
                  "legend-dot active"
              }
            ),

            "Active"
          ),

          React.createElement(
            "div",
            {
              className:
                "legend-item"
            },

            React.createElement(
              "span",
              {
                className:
                  "legend-dot completed"
              }
            ),

            "Completed"
          )
        )
      ),


      /* =============================================
         PROJECT LIST
      ============================================= */

      React.createElement(
        "aside",
        {
          className:
            "map-project-list"
        },

        React.createElement(
          "div",
          {
            className:
              "map-list-header"
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Project Locations"
            ),

            React.createElement(
              "span",
              null,

              filteredProjects.length +
              " projects visible on map"
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "map-project-items"
          },

          filteredProjects.length ===
          0
            ? React.createElement(
                "div",
                {
                  className:
                    "map-empty"
                },

                React.createElement(
                  "div",
                  null,
                  "📍"
                ),

                React.createElement(
                  "strong",
                  null,
                  "No projects found"
                ),

                React.createElement(
                  "span",
                  null,
                  "Try changing the filters."
                )
              )
            : filteredProjects.map(
                function (project) {
                  return React.createElement(
                    "button",
                    {
                      key:
                        project.id,

                      className:
                        "map-project-item" +
                        (
                          selectedProject &&
                          selectedProject.id ===
                            project.id
                            ? " selected"
                            : ""
                        ),

                      onClick:
                        function () {
                          handleProjectClick(
                            project
                          );
                        }
                    },

                    React.createElement(
                      "span",
                      {
                        className:
                          "map-project-status-dot " +
                          project.status.toLowerCase()
                      }
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "map-project-item-content"
                      },

                      React.createElement(
                        "strong",
                        null,
                        project.name
                      ),

                      React.createElement(
                        "span",
                        null,

                        project.district +
                        ", " +
                        project.province
                      ),

                      React.createElement(
                        "small",
                        null,

                        project.progress +
                        "% • " +
                        project.status
                      )
                    ),

                    React.createElement(
                      "span",
                      {
                        className:
                          "map-project-arrow"
                      },
                      "›"
                    )
                  );
                }
              )
        )
      )
    )
  );
}

export default Map;