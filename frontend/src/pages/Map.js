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


/* ===================================
   DEFAULT NEPAL LOCATIONS
=================================== */

const LOCATION_COORDINATES = {

  kathmandu: [
    27.7172,
    85.3240
  ],

  lalitpur: [
    27.6588,
    85.3247
  ],

  bhaktapur: [
    27.6710,
    85.4298
  ],

  pokhara: [
    28.2096,
    83.9856
  ],

  biratnagar: [
    26.4525,
    87.2718
  ],

  bharatpur: [
    27.6833,
    84.4333
  ],

  hetauda: [
    27.4284,
    85.0322
  ],

  butwal: [
    27.7006,
    83.4483
  ],

  nepalgunj: [
    28.0500,
    81.6167
  ],

  janakpur: [
    26.7288,
    85.9263
  ],

  dhangadhi: [
    28.6833,
    80.6000
  ],

  dharan: [
    26.8125,
    87.2833
  ],

  bagmati: [
    27.7172,
    85.3240
  ],

  gandaki: [
    28.2096,
    83.9856
  ],

  koshi: [
    26.4525,
    87.2718
  ],

  lumbini: [
    27.7006,
    83.4483
  ],

  madhesh: [
    26.7288,
    85.9263
  ],

  karnali: [
    29.0000,
    82.0000
  ],

  sudurpashchim: [
    28.6833,
    80.6000
  ]

};


/* ===================================
   FALLBACK LOCATION SEARCH
=================================== */

const searchFallbackLocation = (
  query
) => {

  const cleanQuery =
    String(query || "")
      .trim()
      .toLowerCase();


  if (!cleanQuery) {
    return null;
  }


  const exactKey =
    Object.keys(
      LOCATION_COORDINATES
    ).find(
      (key) =>
        key === cleanQuery ||
        cleanQuery.includes(key) ||
        key.includes(cleanQuery)
    );


  if (!exactKey) {
    return null;
  }


  const coordinates =
    LOCATION_COORDINATES[
      exactKey
    ];


  return {

    lat:
      coordinates[0],

    lng:
      coordinates[1],

    displayName:
      exactKey
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        ) +
      ", Nepal"

  };

};


/* ===================================
   REAL NEPAL LOCATION SEARCH
=================================== */

const searchNepalLocation = async (
  query
) => {

  const cleanQuery =
    String(query || "")
      .trim();


  if (!cleanQuery) {
    return null;
  }


  try {

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=jsonv2" +
      "&addressdetails=1" +
      "&limit=5" +
      "&countrycodes=np" +
      "&q=" +
      encodeURIComponent(
        cleanQuery + ", Nepal"
      );


    const response =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "Accept-Language":
              "en"
          }
        }
      );


    if (!response.ok) {
      return null;
    }


    const data =
      await response.json();


    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {

      return null;

    }


    const result =
      data.find(
        (item) => {

          const lat =
            Number(
              item?.lat
            );

          const lon =
            Number(
              item?.lon
            );


          return (
            Number.isFinite(lat) &&
            Number.isFinite(lon)
          );

        }
      );


    if (!result) {
      return null;
    }


    return {

      lat:
        Number(
          result.lat
        ),

      lng:
        Number(
          result.lon
        ),

      displayName:
        result.display_name ||
        cleanQuery

    };


  } catch (error) {

    console.error(
      "Location search error:",
      error
    );

    return null;

  }

};


/* ===================================
   MAP PAGE
=================================== */

const MapPage = () => {

  const navigate =
    useNavigate();


  /* =================================
     MAP REFS
  ================================= */

  const mapContainerRef =
    useRef(null);


  const mapRef =
    useRef(null);


  const markersRef =
    useRef([]);


  /* =================================
     STATE
  ================================= */

  const [
    projects,
    setProjects
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter
  ] = useState(
    "All Status"
  );


  const [
    riskFilter,
    setRiskFilter
  ] = useState(
    "All Risk"
  );


  /* =================================
     SEARCH MESSAGE
  ================================= */

  const [
    searchMessage,
    setSearchMessage
  ] = useState("");


  const [
    searching,
    setSearching
  ] = useState(false);


  /* =================================
     LOAD PROJECTS
  ================================= */

  const loadProjects =
    async (
      isRefresh = false
    ) => {

      try {

        if (isRefresh) {

          setRefreshing(
            true
          );

        } else {

          setLoading(
            true
          );

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
          Array.isArray(
            data.projects
          )
        ) {

          data =
            data.projects;

        }


        if (
          !Array.isArray(data)
        ) {

          data = [];

        }


        setProjects(
          data
        );


      } catch (err) {

        console.error(err);


        setError(
          err?.message ||
          "Failed to load projects."
        );


      } finally {

        setLoading(
          false
        );

        setRefreshing(
          false
        );

      }

    };


  useEffect(
    () => {

      loadProjects();

    },
    []
  );


  /* =================================
     PROJECT LOCATION
  ================================= */

  const getCoordinates =
    (project) => {

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
          project?.location?.lng ??
          project?.location?.lon
        );


      if (
        Number.isFinite(
          latitude
        ) &&
        Number.isFinite(
          longitude
        ) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180 &&
        latitude !== 0 &&
        longitude !== 0
      ) {

        return {

          latitude,

          longitude

        };

      }


      /* ===============================
         LOCATION TEXT FALLBACK
      =============================== */

      const text = [

        project?.location,

        project?.municipality,

        project?.district,

        project?.province,

        project?.name,

        project?.projectName

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


      for (
        const key of Object.keys(
          LOCATION_COORDINATES
        )
      ) {

        if (
          text.includes(key)
        ) {

          return {

            latitude:
              LOCATION_COORDINATES[
                key
              ][0],

            longitude:
              LOCATION_COORDINATES[
                key
              ][1]

          };

        }

      }


      return null;

    };


  /* =================================
     FILTER PROJECTS
  ================================= */

  const filteredProjects =
    useMemo(
      () => {

        let result =
          [
            ...projects
          ];


        const query =
          search
            .trim()
            .toLowerCase();


        if (query) {

          result =
            result.filter(
              (project) => {

                const name =
                  project.name ||
                  project.projectName ||
                  "";


                const code =
                  project.projectCode ||
                  project.code ||
                  "";


                const province =
                  project.province ||
                  "";


                const district =
                  project.district ||
                  "";


                const municipality =
                  project.municipality ||
                  "";


                const location =
                  project.location ||
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
                  project.status ||
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
                  project.riskLevel ||
                  project.risk ||
                  ""
                ).toLowerCase() ===
                riskFilter.toLowerCase()
            );

        }


        return result;

      },
      [
        projects,
        search,
        statusFilter,
        riskFilter
      ]
    );


  /* =================================
     AUTO SCROLL TO MAP
  ================================= */

  const scrollToMap =
    () => {

      const mapCard =
        document.getElementById(
          "admin-live-map"
        );


      if (!mapCard) {
        return;
      }


      setTimeout(
        () => {

          mapCard.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });

        },
        100
      );

    };


  /* =================================
     INITIALIZE MAP
  ================================= */

  useEffect(
    () => {

      if (
        loading ||
        !mapContainerRef.current
      ) {

        return;

      }


      if (
        mapRef.current
      ) {

        return;

      }


      const map =
        L.map(
          mapContainerRef.current,
          {
            zoomControl:
              true
          }
        ).setView(
          [
            28.3949,
            84.1240
          ],
          7
        );


      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

          attribution:
            "&copy; OpenStreetMap contributors",

          maxZoom:
            19

        }
      ).addTo(map);


      mapRef.current =
        map;


      setTimeout(
        () => {

          map.invalidateSize();

        },
        300
      );


      return () => {

        map.remove();

        mapRef.current =
          null;

      };

    },
    [
      loading
    ]
  );


  /* =================================
     MARKER ICON
  ================================= */

  const createMarkerIcon =
    (project) => {

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

        symbol =
          "✓";

      } else if (
        status.includes(
          "delay"
        )
      ) {

        symbol =
          "!";

      } else if (
        status.includes(
          "critical"
        )
      ) {

        symbol =
          "!";

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


  /* =================================
     UPDATE MARKERS
  ================================= */

  useEffect(
    () => {

      const map =
        mapRef.current;


      if (!map) {
        return;
      }


      /* ===============================
         REMOVE OLD MARKERS
      =============================== */

      markersRef.current.forEach(
        (marker) => {

          map.removeLayer(
            marker
          );

        }
      );


      markersRef.current =
        [];


      /* ===============================
         ADD NEW MARKERS
      =============================== */

      const mappedProjects =
        filteredProjects.filter(
          (project) =>
            getCoordinates(
              project
            )
        );


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
            project.name ||
            project.projectName ||
            "Unnamed Project";


          const code =
            project.projectCode ||
            project.code ||
            "N/A";


          const status =
            project.status ||
            "Unknown";


          const risk =
            project.riskLevel ||
            project.risk ||
            "Unknown";


          const progress =
            Number(
              project.progress ??
              project.completionPercentage ??
              project.completion ??
              0
            );


          const budget =
            Number(
              project.budget ||
              project.totalBudget ||
              0
            );


          const budgetText =
            budget
              ? `NPR ${budget.toLocaleString("en-IN")}`
              : "NPR 0";


          const municipality =
            project.municipality ||
            "N/A";


          const district =
            project.district ||
            "N/A";


          const province =
            project.province ||
            "N/A";


          const projectId =
            project._id ||
            project.id;


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
                  <strong>${progress}%</strong>
                </div>

                <div class="map-popup-progress-track">

                  <div
                    class="map-popup-progress-fill"
                    style="width:${Math.min(
                      100,
                      Math.max(
                        0,
                        progress
                      )
                    )}%"
                  ></div>

                </div>

              </div>

              <button
                class="map-popup-view-btn"
                data-project-id="${projectId}"
              >
                View Project
              </button>

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
                  maxWidth:
                    300
                }
              );


          marker.on(
            "popupopen",
            () => {

              const button =
                document.querySelector(
                  `[data-project-id="${projectId}"]`
                );


              if (button) {

                button.onclick =
                  () => {

                    if (
                      projectId
                    ) {

                      navigate(
                        `/projects/${projectId}`
                      );

                    }

                  };

              }

            }
          );


          markersRef.current.push(
            marker
          );

        }
      );


      /*
       * IMPORTANT:
       * Search handler controls
       * map movement.
       */

      setTimeout(
        () => {

          map.invalidateSize();

        },
        200
      );

    },
    [
      filteredProjects,
      navigate
    ]
  );


  /* =================================
     SEARCH PROJECT / LOCATION
  ================================= */

  const handleSearch =
    async (event) => {

      if (event) {

        event.preventDefault();

      }


      const query =
        search.trim();


      /* ===============================
         EMPTY SEARCH
      =============================== */

      if (!query) {

        setSearchMessage(
          ""
        );


        if (
          mapRef.current
        ) {

          mapRef.current.flyTo(
            [
              28.3949,
              84.1240
            ],
            7,
            {

              animate:
                true,

              duration:
                1

            }
          );

        }


        return;

      }


      setSearching(
        true
      );


      setSearchMessage(
        ""
      );


      /* ===============================
         LOCAL PROJECT SEARCH
      =============================== */

      const q =
        query.toLowerCase();


      const projectMatches =
        projects.filter(
          (project) => {

            const name =
              String(
                project?.name ||
                project?.projectName ||
                ""
              ).toLowerCase();


            const code =
              String(
                project?.projectCode ||
                project?.code ||
                ""
              ).toLowerCase();


            const province =
              String(
                project?.province ||
                ""
              ).toLowerCase();


            const district =
              String(
                project?.district ||
                ""
              ).toLowerCase();


            const municipality =
              String(
                project?.municipality ||
                ""
              ).toLowerCase();


            const location =
              String(
                project?.location ||
                ""
              ).toLowerCase();


            return (

              name.includes(q) ||

              code.includes(q) ||

              province.includes(q) ||

              district.includes(q) ||

              municipality.includes(q) ||

              location.includes(q)

            );

          }
        );


      /* ===============================
         SEARCH LOCATION
      =============================== */

      let location =
        await searchNepalLocation(
          query
        );


      if (!location) {

        location =
          searchFallbackLocation(
            query
          );

      }


      setSearching(
        false
      );


      /* ===============================
         PROJECT FOUND
      =============================== */

      if (
        projectMatches.length > 0
      ) {

        const projectsWithCoordinates =
          projectMatches

            .map(
              (project) => ({

                project,

                coordinates:
                  getCoordinates(
                    project
                  )

              })
            )

            .filter(
              (item) =>
                Boolean(
                  item.coordinates
                )
            );


        /* =============================
           PROJECTS WITH COORDINATES
        ============================= */

        if (
          projectsWithCoordinates.length >
          0 &&
          mapRef.current
        ) {

          /* ===========================
             ONE PROJECT
          =========================== */

          if (
            projectsWithCoordinates.length ===
            1
          ) {

            const coordinates =
              projectsWithCoordinates[0]
                .coordinates;


            scrollToMap();


            setTimeout(
              () => {

                if (
                  mapRef.current
                ) {

                  mapRef.current.flyTo(
                    [
                      coordinates.latitude,
                      coordinates.longitude
                    ],
                    14,
                    {

                      animate:
                        true,

                      duration:
                        1.2

                    }
                  );

                }

              },
              150
            );

          }


          /* ===========================
             MULTIPLE PROJECTS
          =========================== */

          else {

            const bounds =
              L.latLngBounds(
                projectsWithCoordinates.map(
                  (item) => [

                    item.coordinates.latitude,

                    item.coordinates.longitude

                  ]
                )
              );


            scrollToMap();


            setTimeout(
              () => {

                if (
                  mapRef.current
                ) {

                  mapRef.current.fitBounds(
                    bounds,
                    {

                      padding: [
                        60,
                        60
                      ],

                      maxZoom:
                        14,

                      animate:
                        true

                    }
                  );

                }

              },
              150
            );

          }


          setSearchMessage(

            `${projectMatches.length} project${
              projectMatches.length !== 1
                ? "s"
                : ""
            } found for "${query}".`

          );


          return;

        }


        /* =============================
           PROJECT FOUND BUT NO COORDINATE
        ============================= */

        if (
          location &&
          mapRef.current
        ) {

          scrollToMap();


          setTimeout(
            () => {

              if (
                mapRef.current
              ) {

                mapRef.current.flyTo(
                  [
                    location.lat,
                    location.lng
                  ],
                  14,
                  {

                    animate:
                      true,

                    duration:
                      1.2

                  }
                );

              }

            },
            150
          );


          setSearchMessage(

            `${projectMatches.length} project${
              projectMatches.length !== 1
                ? "s"
                : ""
            } found for "${query}". Location shown on map.`

          );


          return;

        }


        setSearchMessage(

          `${projectMatches.length} project${
            projectMatches.length !== 1
              ? "s"
              : ""
          } found for "${query}", but no map coordinates are available.`

        );


        return;

      }


      /* ===============================
         LOCATION FOUND
      =============================== */

      if (
        location
      ) {

        setSearchMessage(

          `No project found for "${query}", but this location was found on the map.`

        );


        if (
          mapRef.current
        ) {

          scrollToMap();


          setTimeout(
            () => {

              if (
                mapRef.current
              ) {

                mapRef.current.flyTo(
                  [
                    location.lat,
                    location.lng
                  ],
                  14,
                  {

                    animate:
                      true,

                    duration:
                      1.2

                  }
                );

              }

            },
            150
          );

        }


        return;

      }


      /* ===============================
         NOTHING FOUND
      =============================== */

      setSearchMessage(

        `"${query}" was not found in Nepal and no matching project was found.`

      );


      if (
        mapRef.current
      ) {

        scrollToMap();


        setTimeout(
          () => {

            if (
              mapRef.current
            ) {

              mapRef.current.flyTo(
                [
                  28.3949,
                  84.1240
                ],
                7,
                {

                  animate:
                    true,

                  duration:
                    1

                }
              );

            }

          },
          150
        );

      }

    };


  /* =================================
     SEARCH INPUT
  ================================= */

  const handleSearchChange =
    (event) => {

      setSearch(
        event.target.value
      );


      setSearchMessage(
        ""
      );

    };


  /* =================================
     CLEAR FILTERS
  ================================= */

  const clearFilters =
    () => {

      setSearch("");

      setStatusFilter(
        "All Status"
      );

      setRiskFilter(
        "All Risk"
      );

      setSearchMessage(
        ""
      );


      if (
        mapRef.current
      ) {

        mapRef.current.flyTo(
          [
            28.3949,
            84.1240
          ],
          7,
          {

            animate:
              true,

            duration:
              1

          }
        );

      }

    };


  /* =================================
     PROJECT COUNTS
  ================================= */

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


  /* =================================
     LOADING
  ================================= */

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


  /* =================================
     PAGE
  ================================= */

  return h(
    "div",
    {
      className:
        "page project-map-page"
    },


    /* =================================
       HEADER
    ================================= */

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
                loadProjects(
                  true
                ),

            disabled:
              refreshing
          },

          refreshing
            ? "⟳ Refreshing..."
            : "↻ Refresh"

        )

      )

    ),


    /* =================================
       ERROR
    ================================= */

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


    /* =================================
       CONTROLS
    ================================= */

    h(
      "div",
      {
        className:
          "project-map-controls"
      },

      /*
       * SEARCH INPUT
       * Search happens when ENTER is pressed.
       * Search button removed.
       */

      h(
        "form",
        {
          className:
            "map-search-box",

          onSubmit:
            handleSearch
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
            type:
              "text",

            value:
              search,

            placeholder:
              "Search project, code, province, district or location...",

            onChange:
              handleSearchChange
          }

        )

      ),


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


    /* =================================
       SEARCH MESSAGE
    ================================= */

    searchMessage
      ? h(
          "div",
          {
            className:
              "map-search-message"
          },

          searchMessage

        )
      : null,


    /* =================================
       MAP STATS
    ================================= */

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


    /* =================================
       MAP
    ================================= */

    h(
      "div",
      {
        id:
          "admin-live-map",

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


      h(
        "div",
        {
          ref:
            mapContainerRef,

          className:
            "project-map-container"
        }

      )

    ),


    /* =================================
       NO COORDINATES NOTICE
    ================================= */

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