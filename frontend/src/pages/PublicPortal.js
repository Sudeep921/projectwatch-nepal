// import React, {
//   useEffect,
//   useState
// } from "react";

// import {
//   useNavigate
// } from "react-router-dom";

// import {
//   getPublicProjects,
//   getPublicSummary
// } from "../services/api";

// import PublicProjectExplorer from "../components/PublicProjectExplorer";
// import PublicMap from "../components/PublicMap";
// import PublicUpdates from "../components/PublicUpdates";
// import PublicContact from "../components/PublicContact";

// const h = React.createElement;

// const PROVINCES = [
//   "All Provinces",
//   "Bagmati",
//   "Gandaki",
//   "Koshi",
//   "Lumbini",
//   "Madhesh",
//   "Karnali",
//   "Sudurpashchim"
// ];

// const STATUSES = [
//   "All Status",
//   "Active",
//   "Delayed",
//   "Completed",
//   "Critical"
// ];

// const RISKS = [
//   "All Risk",
//   "Low",
//   "Medium",
//   "High",
//   "Critical"
// ];

// /* ===================================
//    BUILD API QUERY
// =================================== */

// const buildQuery = ({
//   search,
//   province,
//   status,
//   risk
// }) => {
//   const params =
//     new URLSearchParams();

//   if (search) {
//     params.set(
//       "search",
//       search
//     );
//   }

//   if (
//     province &&
//     province !== "All Provinces"
//   ) {
//     params.set(
//       "province",
//       province
//     );
//   }

//   if (
//     status &&
//     status !== "All Status"
//   ) {
//     params.set(
//       "status",
//       status
//     );
//   }

//   if (
//     risk &&
//     risk !== "All Risk"
//   ) {
//     params.set(
//       "riskLevel",
//       risk
//     );
//   }

//   const query =
//     params.toString();

//   return query
//     ? `?${query}`
//     : "";
// };

// /* ===================================
//    PUBLIC PORTAL
// =================================== */

// const PublicPortal = () => {
//   const navigate =
//     useNavigate();

//   /* ===================================
//      STATE
//   =================================== */

//   const [
//     projects,
//     setProjects
//   ] = useState([]);

//   const [
//     summary,
//     setSummary
//   ] = useState({});

//   const [
//     loading,
//     setLoading
//   ] = useState(true);

//   const [
//     search,
//     setSearch
//   ] = useState("");

//   const [
//     province,
//     setProvince
//   ] = useState(
//     "All Provinces"
//   );

//   const [
//     status,
//     setStatus
//   ] = useState(
//     "All Status"
//   );

//   const [
//     risk,
//     setRisk
//   ] = useState(
//     "All Risk"
//   );

//   /* ===================================
//      LOCAL PROJECT FILTER
//   =================================== */

//   const filteredProjects =
//     projects.filter((project) => {
//       const q =
//         search
//           .trim()
//           .toLowerCase();

//       const name =
//         String(
//           project.name ||
//           project.projectName ||
//           ""
//         ).toLowerCase();

//       const code =
//         String(
//           project.projectCode ||
//           ""
//         ).toLowerCase();

//       const district =
//         String(
//           project.district ||
//           ""
//         ).toLowerCase();

//       const matchesSearch =
//         !q ||
//         name.includes(q) ||
//         code.includes(q) ||
//         district.includes(q);

//       const matchesProvince =
//         province === "All Provinces" ||
//         String(
//           project.province ||
//           ""
//         ).toLowerCase() ===
//           province.toLowerCase();

//       const matchesStatus =
//         status === "All Status" ||
//         String(
//           project.status ||
//           ""
//         ).toLowerCase() ===
//           status.toLowerCase();

//       const matchesRisk =
//         risk === "All Risk" ||
//         String(
//           project.riskLevel ||
//           ""
//         ).toLowerCase() ===
//           risk.toLowerCase();

//       return (
//         matchesSearch &&
//         matchesProvince &&
//         matchesStatus &&
//         matchesRisk
//       );
//     });

//   /* ===================================
//      LOAD PROJECTS
//   =================================== */

//   const load =
//     async () => {
//       try {
//         setLoading(true);

//         const query =
//           buildQuery({
//             search,
//             province,
//             status,
//             risk
//           });

//         const [
//           p,
//           s
//         ] =
//           await Promise.all([
//             getPublicProjects(
//               query
//             ),
//             getPublicSummary()
//           ]);

//         setProjects(
//           p?.projects || []
//         );

//         setSummary(
//           s?.summary || {}
//         );
//       } catch (error) {
//         console.error(
//           "Failed to load public projects:",
//           error
//         );

//         setProjects([]);
//         setSummary({});
//       } finally {
//         setLoading(false);
//       }
//     };

//   /* ===================================
//      INITIAL LOAD
//   =================================== */

//   useEffect(() => {
//     load();

//     // eslint-disable-next-line
//   }, []);

//   /* ===================================
//      SEARCH
//   =================================== */

//   const handleSearch =
//     (event) => {
//       event.preventDefault();

//       load();
//     };

//   /* ===================================
//      CLEAR FILTERS
//   =================================== */

//   const clearFilters =
//     () => {
//       setSearch("");

//       setProvince(
//         "All Provinces"
//       );

//       setStatus(
//         "All Status"
//       );

//       setRisk(
//         "All Risk"
//       );

//       setTimeout(
//         load,
//         0
//       );
//     };

//   /* ===================================
//      FILTER CHANGE
//   =================================== */

//   const handleProvinceChange =
//     (event) => {
//       const value =
//         event.target.value;

//       setProvince(value);

//       setTimeout(
//         () => {
//           const query =
//             buildQuery({
//               search,
//               province: value,
//               status,
//               risk
//             });

//           getPublicProjects(query)
//             .then((response) => {
//               setProjects(
//                 response?.projects || []
//               );
//             })
//             .catch((error) => {
//               console.error(
//                 "Province filter error:",
//                 error
//               );
//             });
//         },
//         0
//       );
//     };

//   const handleStatusChange =
//     (event) => {
//       const value =
//         event.target.value;

//       setStatus(value);

//       setTimeout(
//         () => {
//           const query =
//             buildQuery({
//               search,
//               province,
//               status: value,
//               risk
//             });

//           getPublicProjects(query)
//             .then((response) => {
//               setProjects(
//                 response?.projects || []
//               );
//             })
//             .catch((error) => {
//               console.error(
//                 "Status filter error:",
//                 error
//               );
//             });
//         },
//         0
//       );
//     };

//   const handleRiskChange =
//     (event) => {
//       const value =
//         event.target.value;

//       setRisk(value);

//       setTimeout(
//         () => {
//           const query =
//             buildQuery({
//               search,
//               province,
//               status,
//               risk: value
//             });

//           getPublicProjects(query)
//             .then((response) => {
//               setProjects(
//                 response?.projects || []
//               );
//             })
//             .catch((error) => {
//               console.error(
//                 "Risk filter error:",
//                 error
//               );
//             });
//         },
//         0
//       );
//     };

//   /* ===================================
//      PROJECTS WITH MAP LOCATION
//   =================================== */

//   const mappedProjects =
//     filteredProjects.filter(
//       (project) =>
//         project.latitude !==
//           undefined &&
//         project.latitude !==
//           null &&
//         project.longitude !==
//           undefined &&
//         project.longitude !==
//           null
//     );

//   /* ===================================
//      MAP URL
//   =================================== */

//   const mapUrl =
//     "https://www.openstreetmap.org/export/embed.html?bbox=80.0%2C26.0%2C88.5%2C30.5&layer=mapnik";

//   /* ===================================
//      RENDER
//   =================================== */

//   return h(
//     "div",
//     {
//       className:
//         "public-portal"
//     },

//     /* ===================================
//        HEADER / NAVBAR
//     =================================== */

//     h(
//       "header",
//       {
//         className:
//           "public-header"
//       },

//       h(
//         "div",
//         {
//           className:
//             "public-header-brand"
//         },

//         h(
//           "div",
//           {
//             className:
//               "public-header-logo"
//           },
//           "PW"
//         ),

//         h(
//           "strong",
//           null,
//           "ProjectWatch Nepal"
//         )
//       ),

//       h(
//         "nav",
//         {
//           className:
//             "public-nav"
//         },

//         h(
//           "a",
//           {
//             href:
//               "#home"
//           },
//           "Home"
//         ),

//         h(
//           "a",
//           {
//             href:
//               "#projects"
//           },
//           "Projects"
//         ),

//         h(
//           "a",
//           {
//             href:
//               "#map"
//           },
//           "Live Map"
//         ),

//         h(
//           "a",
//           {
//             href:
//               "/public/report"
//           },
//           "Complaints"
//         ),

//         h(
//           "a",
//           {
//             href:
//               "#about"
//           },
//           "About"
//         )
//       ),

//       h(
//         "div",
//         {
//           className:
//             "public-header-actions"
//         },

//         h(
//           "button",
//           {
//             className:
//               "public-header-report",

//             onClick:
//               () =>
//                 navigate(
//                   "/public/report"
//                 )
//           },
//           "⚠ Report an Issue"
//         )
//       )
//     ),

//     /* ===================================
//        HERO
//     =================================== */

//     h(
//       "section",
//       {
//         id:
//           "home",

//         className:
//           "public-hero"
//       },

//       h(
//         "span",
//         {
//           className:
//             "eyebrow"
//         },
//         "OPEN GOVERNMENT"
//       ),

//       h(
//         "h1",
//         null,
//         "Track Nepal's Public Projects"
//       ),

//       h(
//         "p",
//         null,
//         "Explore government development projects, progress and budget information. See something wrong on the ground? Report it directly."
//       ),

//       h(
//         "form",
//         {
//           className:
//             "public-search",

//           onSubmit:
//             handleSearch
//         },

//         h(
//           "input",
//           {
//             value:
//               search,

//             onChange:
//               (e) =>
//                 setSearch(
//                   e.target.value
//                 ),

//             placeholder:
//               "Search by project name, code or district..."
//           }
//         ),

//         h(
//           "button",
//           {
//             type:
//               "submit"
//           },
//           "Search"
//         )
//       )
//     ),

//     /* ===================================
//        STATS
//     =================================== */

//     h(
//       "section",
//       {
//         id:
//           "reports",

//         className:
//           "public-stats"
//       },

//       [
//         [
//           "Projects",
//           summary.totalProjects
//         ],

//         [
//           "Active",
//           summary.activeProjects
//         ],

//         [
//           "Delayed",
//           summary.delayedProjects
//         ],

//         [
//           "Completed",
//           summary.completedProjects
//         ],

//         [
//           "Critical",
//           summary.criticalProjects
//         ]
//       ].map(
//         ([label, value]) =>
//           h(
//             "div",
//             {
//               key:
//                 label
//             },

//             h(
//               "strong",
//               null,
//               value || 0
//             ),

//             h(
//               "span",
//               null,
//               label
//             )
//           )
//       )
//     ),

//     /* ===================================
//        SEARCH SECTION
//     =================================== */

//     h(
//       "div",
//       {
//         className:
//           "public-search-section"
//       },

//       h(
//         "div",
//         {
//           className:
//             "public-search-box"
//         },

//         h(
//           "span",
//           null,
//           "🔎"
//         ),

//         h(
//           "input",
//           {
//             value:
//               search,

//             onChange:
//               (e) =>
//                 setSearch(
//                   e.target.value
//                 ),

//             placeholder:
//               "Search projects by name, code or district..."
//           }
//         )
//       )
//     ),

//     /* ===================================
//        FILTERS
//     =================================== */

//     h(
//       "section",
//       {
//         className:
//           "public-filters"
//       },

//       h(
//         "select",
//         {
//           value:
//             province,

//           onChange:
//             handleProvinceChange
//         },

//         PROVINCES.map(
//           (item) =>
//             h(
//               "option",
//               {
//                 key:
//                   item,

//                 value:
//                   item
//               },
//               item
//             )
//         )
//       ),

//       h(
//         "select",
//         {
//           value:
//             status,

//           onChange:
//             handleStatusChange
//         },

//         STATUSES.map(
//           (item) =>
//             h(
//               "option",
//               {
//                 key:
//                   item,

//                 value:
//                   item
//               },
//               item
//             )
//         )
//       ),

//       h(
//         "select",
//         {
//           value:
//             risk,

//           onChange:
//             handleRiskChange
//         },

//         RISKS.map(
//           (item) =>
//             h(
//               "option",
//               {
//                 key:
//                   item,

//                 value:
//                   item
//               },
//               item
//             )
//         )
//       ),

//       h(
//         "button",
//         {
//           type:
//             "button",

//           className:
//             "public-filters-clear",

//           onClick:
//             clearFilters
//         },
//         "Clear Filters"
//       )
//     ),

//     /* ===================================
//        LIVE MAP
//     =================================== */

//     h(
//       "section",
//       {
//         id:
//           "map",

//         className:
//           "public-live-map"
//       },

//       h(
//         "div",
//         {
//           className:
//             "public-live-map-header"
//         },

//         h(
//           "div",
//           null,

//           h(
//             "span",
//             {
//               className:
//                 "eyebrow"
//             },
//             "LIVE MONITORING"
//           ),

//           h(
//             "h2",
//             null,
//             "Government Project Live Map"
//           ),

//           h(
//             "p",
//             null,
//             "View project locations across Nepal."
//           )
//         ),

//         h(
//           "span",
//           {
//             className:
//               "public-map-count"
//           },
//           `${mappedProjects.length} mapped projects`
//         )
//       ),

//       h(
//         "div",
//         {
//           className:
//             "public-live-map-content"
//         },

//         h(
//           "div",
//           {
//             className:
//               "public-map-frame"
//           },

//           h(
//             "iframe",
//             {
//               title:
//                 "ProjectWatch Nepal Live Map",

//               src:
//                 mapUrl,

//               loading:
//                 "lazy",

//               style: {
//                 width:
//                   "100%",

//                 height:
//                   "100%",

//                 minHeight:
//                   "480px",

//                 border:
//                   "0"
//               }
//             }
//           )
//         )
//       )
//     ),

//     /* ===================================
//        REPORT ISSUE CTA
//     =================================== */

//     h(
//       "div",
//       {
//         className:
//           "public-portal-cta"
//       },

//       h(
//         "div",
//         null,

//         h(
//           "span",
//           null,
//           "📢"
//         ),

//         h(
//           "h2",
//           null,
//           "Have an issue with a government project?"
//         ),

//         h(
//           "p",
//           null,
//           "Report project delays, quality issues or other concerns directly through ProjectWatch Nepal."
//         )
//       ),

//       h(
//         "a",
//         {
//           href:
//             "/public/report",

//           className:
//             "public-portal-cta-button"
//         },
//         "Report an Issue →"
//       )
//     ),

//     /* ===================================
//        PROJECT GRID
//     =================================== */

//     loading

//       ? h(
//           "div",
//           {
//             className:
//               "public-loading"
//           },
//           "Loading projects..."
//         )

//       : filteredProjects.length === 0

//       ? h(
//           "div",
//           {
//             className:
//               "public-empty"
//           },

//           h(
//             "h3",
//             null,
//             "No projects found"
//           ),

//           h(
//             "p",
//             null,
//             "Try adjusting your search or filters."
//           )
//         )

//       : h(
//           "main",
//           {
//             id:
//               "projects",

//             className:
//               "public-project-grid"
//           },

//           h(
//             "div",
//             {
//               className:
//                 "public-projects-heading"
//             },

//             h(
//               "div",
//               null,

//               h(
//                 "span",
//                 {
//                   className:
//                     "eyebrow"
//                 },
//                 "PROJECTS"
//               ),

//               h(
//                 "h2",
//                 null,
//                 "Government Projects"
//               ),

//               h(
//                 "p",
//                 null,
//                 `${filteredProjects.length} project${
//                   filteredProjects.length !== 1
//                     ? "s"
//                     : ""
//                 } found`
//               )
//             )
//           ),

//           h(
//             "div",
//             {
//               className:
//                 "public-project-grid-items"
//             },

//             filteredProjects.map(
//               (project) =>
//                 h(
//                   "article",
//                   {
//                     key:
//                       project._id,

//                     className:
//                       "public-project-card",

//                     onClick:
//                       () =>
//                         navigate(
//                           `/public/projects/${project._id}`
//                         )
//                   },

//                   h(
//                     "span",
//                     {
//                       className:
//                         "public-project-code"
//                     },
//                     project.projectCode ||
//                       "PROJECT"
//                   ),

//                   h(
//                     "h3",
//                     null,
//                     project.name ||
//                       project.projectName ||
//                       "Untitled Project"
//                   ),

//                   h(
//                     "p",
//                     null,
//                     `${project.district || ""}${
//                       project.district &&
//                       project.province
//                         ? ", "
//                         : ""
//                     }${
//                       project.province || ""
//                     }`
//                   ),

//                   h(
//                     "div",
//                     {
//                       className:
//                         "progress-track"
//                     },

//                     h(
//                       "div",
//                       {
//                         className:
//                           "progress-fill",

//                         style: {
//                           width:
//                             `${project.progress || 0}%`
//                         }
//                       }
//                     )
//                   ),

//                   h(
//                     "div",
//                     {
//                       className:
//                         "public-project-card-footer"
//                     },

//                     h(
//                       "strong",
//                       null,
//                       `${project.progress || 0}%`
//                     ),

//                     h(
//                       "span",
//                       {
//                         className:
//                           `status-pill status-${(
//                             project.status ||
//                             "active"
//                           ).toLowerCase()}`
//                       },
//                       project.status ||
//                         "Active"
//                     )
//                   ),

//                   h(
//                     "span",
//                     {
//                       className:
//                         "public-project-card-link"
//                     },
//                     "View details →"
//                   )
//                 )
//             )
//           )
//         ),

//     /* ===================================
//        FOOTER
//     =================================== */

//     h(
//       "footer",
//       {
//         id:
//           "about",

//         className:
//           "public-footer"
//       },

//       h(
//         "div",
//         {
//           className:
//             "public-footer-col"
//         },

//         h(
//           "strong",
//           null,
//           "ProjectWatch Nepal"
//         ),

//         h(
//           "p",
//           null,
//           "An open-government platform for tracking public development projects, budgets and progress across all seven provinces of Nepal."
//         )
//       ),

//       h(
//         "div",
//         {
//           className:
//             "public-footer-col"
//         },

//         h(
//           "strong",
//           null,
//           "For Citizens"
//         ),

//         h(
//           "button",
//           {
//             className:
//               "public-footer-link",

//             onClick:
//               () =>
//                 navigate(
//                   "/public/report"
//                 )
//           },
//           "Report a Project Issue"
//         )
//       ),

//       h(
//         "div",
//         {
//           className:
//             "public-footer-bottom"
//         },

//         `© ${new Date().getFullYear()} ProjectWatch Nepal. Government project monitoring, made transparent.`
//       )
//     )
//   );
// };

// export default PublicPortal;


import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getPublicProjects,
  getPublicSummary
} from "../services/api";

import PublicProjectExplorer from "../components/PublicProjectExplorer";
import PublicMap from "../components/PublicMap";
import PublicUpdates from "../components/PublicUpdates";
import PublicContact from "../components/PublicContact";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

const h = React.createElement;

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
   DEFAULT LOCATION COORDINATES
=================================== */

const LOCATION_COORDINATES = {
  kathmandu: [27.7172, 85.3240],
  lalitpur: [27.6588, 85.3247],
  bhaktapur: [27.6710, 85.4298],

  pokhara: [28.2096, 83.9856],
  biratnagar: [26.4525, 87.2718],
  bharatpur: [27.6833, 84.4333],

  hetauda: [27.4284, 85.0322],
  butwal: [27.7006, 83.4483],
  nepalgunj: [28.0500, 81.6167],

  janakpur: [26.7288, 85.9263],
  dhangadhi: [28.6833, 80.6000],
  dharan: [26.8125, 87.2833],

  bagmati: [27.7172, 85.3240],
  gandaki: [28.2096, 83.9856],
  koshi: [26.4525, 87.2718],
  lumbini: [27.7006, 83.4483],
  madhesh: [26.7288, 85.9263],
  karnali: [29.0000, 82.0000],
  sudurpashchim: [28.6833, 80.6000]
};


/* ===================================
   SEARCH NEPAL LOCATION
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

    if (
      !response.ok
    ) {
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
            Number(item?.lat);

          const lon =
            Number(item?.lon);

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
        Number(result.lat),

      lng:
        Number(result.lon),

      displayName:
        result.display_name ||
        cleanQuery
    };

  } catch (error) {

    console.error(
      "Nepal location search error:",
      error
    );

    return null;
  }
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
   PROJECT COORDINATES
=================================== */

const getProjectCoordinates = (
  project
) => {

  const lat =
    Number(
      project?.latitude ??
      project?.lat
    );

  const lng =
    Number(
      project?.longitude ??
      project?.lng
    );

  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat !== 0 &&
    lng !== 0
  ) {
    return [
      lat,
      lng
    ];
  }

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

      return LOCATION_COORDINATES[
        key
      ];
    }
  }

  return null;
};


/* ===================================
   PROJECT NAME
=================================== */

const getProjectName = (
  project
) => {

  return (
    project?.name ||
    project?.projectName ||
    project?.title ||
    "Untitled Project"
  );
};


/* ===================================
   PROJECT STATUS
=================================== */

const getProjectStatus = (
  project
) => {

  return (
    project?.status ||
    "Active"
  );
};


/* ===================================
   PROJECT RISK
=================================== */

const getProjectRisk = (
  project
) => {

  return (
    project?.riskLevel ||
    project?.risk ||
    "Low"
  );
};


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
     MAP REFS
  =================================== */

  const mapContainerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const markerLayerRef =
    useRef(null);

  const searchedLocationLayerRef =
    useRef(null);


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
     LOCATION SEARCH STATE
  =================================== */

  const [
    searchedLocation,
    setSearchedLocation
  ] = useState(null);

  const [
    locationSearching,
    setLocationSearching
  ] = useState(false);

  const [
    locationSearchMessage,
    setLocationSearchMessage
  ] = useState("");


  /* ===================================
     LOCAL PROJECT FILTER
  =================================== */

  const filteredProjects =
    projects.filter((project) => {

      const q =
        search
          .trim()
          .toLowerCase();

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

      const location =
        String(
          project.location ||
          ""
        ).toLowerCase();

      const municipality =
        String(
          project.municipality ||
          ""
        ).toLowerCase();

      const projectProvince =
        String(
          project.province ||
          ""
        ).toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        code.includes(q) ||
        district.includes(q) ||
        location.includes(q) ||
        municipality.includes(q) ||
        projectProvince.includes(q);

      const matchesProvince =
        province === "All Provinces" ||
        String(
          project.province ||
          ""
        ).toLowerCase() ===
          province.toLowerCase();

      const matchesStatus =
        status === "All Status" ||
        String(
          project.status ||
          ""
        ).toLowerCase() ===
          status.toLowerCase();

      const matchesRisk =
        risk === "All Risk" ||
        String(
          project.riskLevel ||
          ""
        ).toLowerCase() ===
          risk.toLowerCase();

      return (
        matchesSearch &&
        matchesProvince &&
        matchesStatus &&
        matchesRisk
      );
    });


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
          p?.projects || []
        );

        setSummary(
          s?.summary || {}
        );
      } catch (error) {
        console.error(
          "Failed to load public projects:",
          error
        );

        setProjects([]);
        setSummary({});
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
     CREATE MAP
  =================================== */

  useEffect(() => {

    if (
      !mapContainerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map =
      L.map(
        mapContainerRef.current,
        {
          center: [
            28.3949,
            84.1240
          ],

          zoom: 7,

          zoomControl: true
        }
      );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors",

        maxZoom: 19
      }
    ).addTo(map);

    markerLayerRef.current =
      L.layerGroup()
        .addTo(map);

    searchedLocationLayerRef.current =
      L.layerGroup()
        .addTo(map);

    mapRef.current =
      map;

    setTimeout(() => {

      map.invalidateSize();

    }, 300);

    return () => {

      map.remove();

      mapRef.current =
        null;

      markerLayerRef.current =
        null;

      searchedLocationLayerRef.current =
        null;
    };

  }, []);


  /* ===================================
     UPDATE PROJECT MARKERS
  =================================== */

  useEffect(() => {

    const map =
      mapRef.current;

    const layer =
      markerLayerRef.current;

    if (
      !map ||
      !layer
    ) {
      return;
    }

    layer.clearLayers();

    const markerProjects =
      filteredProjects
        .map(
          (project) => ({
            project,

            coordinates:
              getProjectCoordinates(
                project
              )
          })
        )
        .filter(
          (item) =>
            Array.isArray(
              item.coordinates
            )
        );

    markerProjects.forEach(
      ({
        project,
        coordinates
      }) => {

        const marker =
          L.marker(
            coordinates
          );

        const name =
          getProjectName(
            project
          );

        const projectStatus =
          getProjectStatus(
            project
          );

        const projectRisk =
          getProjectRisk(
            project
          );

        const progress =
          Number(
            project?.progress ??
            project?.progressPercentage ??
            0
          );

        const popup =
          document.createElement(
            "div"
          );

        popup.className =
          "project-map-popup";

        const title =
          document.createElement(
            "div"
          );

        title.className =
          "project-map-popup-title";

        title.textContent =
          name;

        const code =
          document.createElement(
            "div"
          );

        code.className =
          "project-map-popup-code";

        code.textContent =
          project?.projectCode
            ? `Code: ${project.projectCode}`
            : "";

        const statusText =
          document.createElement(
            "div"
          );

        statusText.className =
          "project-map-popup-row";

        statusText.textContent =
          `Status: ${projectStatus}`;

        const riskText =
          document.createElement(
            "div"
          );

        riskText.className =
          "project-map-popup-row";

        riskText.textContent =
          `Risk: ${projectRisk}`;

        const progressText =
          document.createElement(
            "div"
          );

        progressText.className =
          "project-map-popup-row";

        progressText.textContent =
          `Progress: ${progress}%`;

        const detailsButton =
          document.createElement(
            "button"
          );

        detailsButton.type =
          "button";

        detailsButton.className =
          "project-map-popup-button";

        detailsButton.textContent =
          "View Project";

        detailsButton.addEventListener(
          "click",
          () => {

            const id =
              project?._id ||
              project?.id;

            if (id) {

              navigate(
                `/public/projects/${id}`
              );
            }
          }
        );

        popup.appendChild(
          title
        );

        if (
          project?.projectCode
        ) {

          popup.appendChild(
            code
          );
        }

        popup.appendChild(
          statusText
        );

        popup.appendChild(
          riskText
        );

        popup.appendChild(
          progressText
        );

        popup.appendChild(
          detailsButton
        );

        marker
          .bindPopup(
            popup
          )
          .addTo(layer);

      }
    );


    /* ===================================
       FIT PROJECT MARKERS
    =================================== */

    if (
      markerProjects.length > 0 &&
      (
        search.trim() ||
        province !==
          "All Provinces" ||
        status !==
          "All Status" ||
        risk !==
          "All Risk"
      )
    ) {

      const bounds =
        L.latLngBounds(
          markerProjects.map(
            (item) =>
              item.coordinates
          )
        );

      map.fitBounds(
        bounds,
        {
          padding: [
            50,
            50
          ],

          maxZoom: 13,

          animate: true
        }
      );
    }

  }, [
    filteredProjects,
    search,
    province,
    status,
    risk,
    navigate
  ]);


  /* ===================================
     SHOW SEARCHED LOCATION
  =================================== */

  useEffect(() => {

    const map =
      mapRef.current;

    const layer =
      searchedLocationLayerRef.current;

    if (
      !map ||
      !layer
    ) {
      return;
    }

    layer.clearLayers();

    if (
      !searchedLocation
    ) {
      return;
    }

    const lat =
      Number(
        searchedLocation.lat
      );

    const lng =
      Number(
        searchedLocation.lng
      );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    const locationMarker =
      L.circleMarker(
        [
          lat,
          lng
        ],
        {
          radius: 10,

          weight: 3,

          fillOpacity: 0.75
        }
      );

    const popup =
      document.createElement(
        "div"
      );

    const title =
      document.createElement(
        "strong"
      );

    title.textContent =
      "Searched Location";

    const locationText =
      document.createElement(
        "div"
      );

    locationText.style.marginTop =
      "6px";

    locationText.textContent =
      searchedLocation.displayName ||
      "Location found in Nepal";

    popup.appendChild(
      title
    );

    popup.appendChild(
      locationText
    );

    locationMarker
      .bindPopup(
        popup
      )
      .addTo(layer);

    if (
      filteredProjects.length === 0
    ) {

      map.flyTo(
        [
          lat,
          lng
        ],
        14,
        {
          animate: true,

          duration: 1.2
        }
      );

      locationMarker.openPopup();
    }

  }, [
    searchedLocation,
    filteredProjects.length
  ]);


  /* ===================================
     SEARCH
  =================================== */

  const handleSearch =
    async (event) => {

      if (event) {
        event.preventDefault();
      }

      const query =
        search.trim();

      if (!query) {

        setSearchedLocation(
          null
        );

        setLocationSearchMessage(
          ""
        );

        return;
      }

      setLocationSearching(
        true
      );

      setLocationSearchMessage(
        ""
      );

      setSearchedLocation(
        null
      );


      /* =================================
         SEARCH PROJECT
      ================================= */

      const projectMatches =
        projects.filter(
          (project) => {

            const name =
              String(
                project.name ||
                project.projectName ||
                ""
              )
                .toLowerCase();

            const code =
              String(
                project.projectCode ||
                ""
              )
                .toLowerCase();

            const location =
              String(
                project.location ||
                ""
              )
                .toLowerCase();

            const municipality =
              String(
                project.municipality ||
                ""
              )
                .toLowerCase();

            const district =
              String(
                project.district ||
                ""
              )
                .toLowerCase();

            const projectProvince =
              String(
                project.province ||
                ""
              )
                .toLowerCase();

            const q =
              query.toLowerCase();

            return (
              name.includes(q) ||
              code.includes(q) ||
              location.includes(q) ||
              municipality.includes(q) ||
              district.includes(q) ||
              projectProvince.includes(q)
            );
          }
        );


      /* =================================
         SEARCH REAL NEPAL LOCATION
      ================================= */

      let location =
        await searchNepalLocation(
          query
        );


      /* =================================
         FALLBACK LOCATION
      ================================= */

      if (!location) {

        location =
          searchFallbackLocation(
            query
          );
      }


      setLocationSearching(
        false
      );


      /* =================================
         LOCATION FOUND
      ================================= */

      if (location) {

        setSearchedLocation(
          location
        );

        if (
          projectMatches.length === 0
        ) {

          setLocationSearchMessage(
            `No project found for "${query}", but this location was found on the map.`
          );

        } else {

          setLocationSearchMessage(
            `${projectMatches.length} project(s) found for "${query}".`
          );
        }


        /* ===============================
           IF PROJECT HAS COORDINATES
        =============================== */

        const firstProject =
          projectMatches[0];

        const projectCoordinates =
          firstProject
            ? getProjectCoordinates(
                firstProject
              )
            : null;


        if (
          projectCoordinates &&
          mapRef.current
        ) {

          mapRef.current.flyTo(
            projectCoordinates,
            14,
            {
              animate: true,

              duration: 1.2
            }
          );

        } else if (
          mapRef.current
        ) {

          mapRef.current.flyTo(
            [
              location.lat,
              location.lng
            ],
            14,
            {
              animate: true,

              duration: 1.2
            }
          );
        }


      } else {

        /* =================================
           NOTHING FOUND
        ================================= */

        setSearchedLocation(
          null
        );

        setLocationSearchMessage(
          `Location "${query}" was not found in Nepal and no matching project was found.`
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
              animate: true,

              duration: 1
            }
          );
        }
      }


      /*
       * Keep the original API search/filter
       * behaviour also.
       */
      load();
    };


  /* ===================================
     SEARCH INPUT CHANGE
  =================================== */

  const handleSearchChange =
    (event) => {

      setSearch(
        event.target.value
      );

      setSearchedLocation(
        null
      );

      setLocationSearchMessage(
        ""
      );
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

      setSearchedLocation(
        null
      );

      setLocationSearchMessage(
        ""
      );

      setTimeout(
        load,
        0
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
            animate: true,

            duration: 1
          }
        );
      }
    };


  /* ===================================
     FILTER CHANGE
  =================================== */

  const handleProvinceChange =
    (event) => {

      const value =
        event.target.value;

      setProvince(value);

      setTimeout(
        () => {
          const query =
            buildQuery({
              search,
              province: value,
              status,
              risk
            });

          getPublicProjects(query)
            .then((response) => {
              setProjects(
                response?.projects || []
              );
            })
            .catch((error) => {
              console.error(
                "Province filter error:",
                error
              );
            });
        },
        0
      );
    };


  const handleStatusChange =
    (event) => {

      const value =
        event.target.value;

      setStatus(value);

      setTimeout(
        () => {
          const query =
            buildQuery({
              search,
              province,
              status: value,
              risk
            });

          getPublicProjects(query)
            .then((response) => {
              setProjects(
                response?.projects || []
              );
            })
            .catch((error) => {
              console.error(
                "Status filter error:",
                error
              );
            });
        },
        0
      );
    };


  const handleRiskChange =
    (event) => {

      const value =
        event.target.value;

      setRisk(value);

      setTimeout(
        () => {
          const query =
            buildQuery({
              search,
              province,
              status,
              risk: value
            });

          getPublicProjects(query)
            .then((response) => {
              setProjects(
                response?.projects || []
              );
            })
            .catch((error) => {
              console.error(
                "Risk filter error:",
                error
              );
            });
        },
        0
      );
    };


  /* ===================================
     PROJECTS WITH MAP LOCATION
  =================================== */

  const mappedProjects =
    filteredProjects.filter(
      (project) =>
        Boolean(
          getProjectCoordinates(
            project
          )
        )
    );


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
              handleSearchChange,

            placeholder:
              "Search by project name, code or district..."
          }
        ),

        h(
          "button",
          {
            type:
              "submit",

            disabled:
              locationSearching
          },
          locationSearching
            ? "Searching..."
            : "Search"
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
       SEARCH SECTION
    =================================== */

    h(
      "div",
      {
        className:
          "public-search-section"
      },

      h(
        "div",
        {
          className:
            "public-search-box"
        },

        h(
          "span",
          null,
          "🔎"
        ),

        h(
          "input",
          {
            value:
              search,

            onChange:
              handleSearchChange,

            onKeyDown:
              (event) => {

                if (
                  event.key ===
                  "Enter"
                ) {

                  event.preventDefault();

                  handleSearch();
                }
              },

            placeholder:
              "Search projects by name, code or district..."
          }
        )
      )
    ),


    /* ===================================
       FILTERS
    =================================== */

    h(
      "section",
      {
        className:
          "public-filters"
      },

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
       SEARCH MESSAGE
    =================================== */

    locationSearchMessage &&
      h(
        "div",
        {
          className:
            "public-search-message"
        },
        locationSearchMessage
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
            search.trim()
              ? (
                  filteredProjects.length > 0
                    ? `Showing ${filteredProjects.length} matching project(s) on the map.`
                    : searchedLocation
                      ? "Project not found at this location, but the searched location is shown on the map."
                      : "No matching project or location found."
                )
              : "View project locations across Nepal."
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
            "div",
            {
              ref:
                mapContainerRef,

              className:
                "public-leaflet-map",

              style: {
                width:
                  "100%",

                height:
                  "100%",

                minHeight:
                  "480px"
              }
            }
          )
        )
      )
    ),


    /* ===================================
       REPORT ISSUE CTA
    =================================== */

    h(
      "div",
      {
        className:
          "public-portal-cta"
      },

      h(
        "div",
        null,

        h(
          "span",
          null,
          "📢"
        ),

        h(
          "h2",
          null,
          "Have an issue with a government project?"
        ),

        h(
          "p",
          null,
          "Report project delays, quality issues or other concerns directly through ProjectWatch Nepal."
        )
      ),

      h(
        "a",
        {
          href:
            "/public/report",

          className:
            "public-portal-cta-button"
        },
        "Report an Issue →"
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

      : filteredProjects.length === 0

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
                `${filteredProjects.length} project${
                  filteredProjects.length !== 1
                    ? "s"
                    : ""
                } found`
              )
            )
          ),

          h(
            "div",
            {
              className:
                "public-project-grid-items"
            },

            filteredProjects.map(
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

                  h(
                    "span",
                    {
                      className:
                        "public-project-code"
                    },
                    project.projectCode ||
                      "PROJECT"
                  ),

                  h(
                    "h3",
                    null,
                    project.name ||
                      project.projectName ||
                      "Untitled Project"
                  ),

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