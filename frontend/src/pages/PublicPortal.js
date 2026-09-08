import React, { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================
   DEFAULT PROJECT TIMELINE
========================================= */

const DEFAULT_TIMELINE = [
  {
    date: "15 Jan 2025",
    title: "Project Started",
    description:
      "Official project implementation started."
  },
  {
    date: "20 Aug 2025",
    title: "Construction Update",
    description:
      "Project construction activity was updated."
  },
  {
    date: "7 Sep 2026",
    title: "Latest Field Verification",
    description:
      "Latest project evidence was submitted for review."
  }
];

/* =========================================
   DEFAULT FIELD EVIDENCE
========================================= */

const DEFAULT_EVIDENCE = {
  type: "Photo",
  submittedBy: "Field Officer",
  date: "7 Sep 2026",
  location: "Project Site",
  status: "Verified"
};

/* =========================================
   DEFAULT AI REVIEW
========================================= */

const DEFAULT_AI_REVIEW = {
  status: "No major discrepancy detected",
  message:
    "Available project information is currently consistent with the latest submitted evidence."
};

/* =========================================
   PROJECT DATA
========================================= */

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
    startDate: "15 Jan 2025",
    endDate: "14 Jan 2028",
    location: "Kathmandu, Bagmati Province",
    description:
      "Major road infrastructure development project focused on expanding and upgrading the Kathmandu Ring Road.",
    verification: "Human Review Required"
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
    startDate: "20 Feb 2025",
    endDate: "20 Dec 2027",
    location: "Pokhara, Gandaki Province",
    description:
      "Regional bridge development project improving transportation connectivity around Pokhara.",
    verification: "Verified"
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
    startDate: "10 Apr 2025",
    endDate: "30 Mar 2027",
    location: "Morang, Koshi Province",
    description:
      "Upgrade and expansion of district hospital infrastructure and essential healthcare facilities.",
    verification: "Verified"
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
    startDate: "5 Jan 2024",
    endDate: "30 Dec 2026",
    location: "Rupandehi, Lumbini Province",
    description:
      "Road improvement project connecting Butwal and Bhairahawa through upgraded transport infrastructure.",
    verification: "Verified"
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
    startDate: "12 Jun 2025",
    endDate: "15 May 2028",
    location: "Dhanusha, Madhesh Province",
    description:
      "Large-scale irrigation infrastructure project designed to improve agricultural water access.",
    verification: "Pending"
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
    startDate: "1 Feb 2023",
    endDate: "30 Jan 2026",
    location: "Surkhet, Karnali Province",
    description:
      "District-level hospital infrastructure development project serving communities in Karnali.",
    verification: "Verified"
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
    startDate: "18 Aug 2025",
    endDate: "20 Jul 2027",
    location: "Kanchanpur, Sudurpashchim Province",
    description:
      "Drinking water infrastructure project intended to improve reliable water access for local communities.",
    verification: "Verified"
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
    startDate: "10 Mar 2025",
    endDate: "15 Feb 2027",
    location: "Lalitpur, Bagmati Province",
    description:
      "Reconstruction and improvement of community school facilities for safer learning environments.",
    verification: "Verified"
  }
];

/* =========================================
   PUBLIC MAP PROJECTS
========================================= */

const PUBLIC_MAP_PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    province: "Bagmati",
    status: "Critical",
    progress: 42,
    lat: 27.7172,
    lng: 85.324,
    icon: "🛣️"
  },
  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    province: "Gandaki",
    status: "Delayed",
    progress: 38,
    lat: 28.2096,
    lng: 83.9856,
    icon: "🌉"
  },
  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    province: "Koshi",
    status: "Active",
    progress: 56,
    lat: 26.4525,
    lng: 87.2718,
    icon: "🏥"
  },
  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    province: "Lumbini",
    status: "Active",
    progress: 74,
    lat: 27.7006,
    lng: 83.4484,
    icon: "🛣️"
  },
  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    province: "Madhesh",
    status: "Delayed",
    progress: 29,
    lat: 26.7288,
    lng: 85.9263,
    icon: "💧"
  },
  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    province: "Karnali",
    status: "Completed",
    progress: 91,
    lat: 28.6,
    lng: 81.6333,
    icon: "🏥"
  },
  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    province: "Sudurpashchim",
    status: "Active",
    progress: 63,
    lat: 28.8372,
    lng: 80.3213,
    icon: "🚰"
  },
  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    province: "Bagmati",
    status: "Active",
    progress: 81,
    lat: 27.6588,
    lng: 85.3247,
    icon: "🏫"
  }
];

/* =========================================
   MAP ICON
========================================= */

function createProjectIcon(status) {
  let background = "#2563eb";

  if (status === "Critical") {
    background = "#dc2626";
  }

  if (status === "Delayed") {
    background = "#d97706";
  }

  if (status === "Completed") {
    background = "#16a34a";
  }

  return L.divIcon({
    className: "public-map-marker-wrapper",
    html:
      '<div style="' +
      "width:42px;" +
      "height:42px;" +
      "border-radius:50%;" +
      "background:" +
      background +
      ";" +
      "border:4px solid white;" +
      "box-shadow:0 4px 14px rgba(0,0,0,.25);" +
      "display:flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "font-size:19px;" +
      "color:white;" +
      '">' +
      "📍" +
      "</div>",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });
}

/* =========================================
   MAP CONTROLLER
========================================= */

function PublicMapController({ project }) {
  const map = useMap();

  React.useEffect(
    function () {
      if (project) {
        map.flyTo(
          [project.lat, project.lng],
          12,
          {
            duration: 1.2
          }
        );
      }
    },
    [project, map]
  );

  return null;
}

/* =========================================
   PUBLIC PROJECT MAP
========================================= */

function PublicProjectMap({
  projects,
  onViewProject
}) {
  const [selectedMapProject, setSelectedMapProject] =
    useState(null);

  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "620px",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #e5e7eb",
        boxShadow:
          "0 18px 50px rgba(15,23,42,.12)"
      }
    },

    React.createElement(
      MapContainer,
      {
        center: [28.3949, 84.124],
        zoom: 7,
        scrollWheelZoom: true,
        style: {
          width: "100%",
          height: "100%"
        }
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

      selectedMapProject &&
        React.createElement(
          PublicMapController,
          {
            project: selectedMapProject
          }
        ),

      projects.map(function (project) {
        return React.createElement(
          Marker,
          {
            key: project.id,
            position: [
              project.lat,
              project.lng
            ],
            icon: createProjectIcon(
              project.status
            ),
            eventHandlers: {
              click: function () {
                setSelectedMapProject(project);
              }
            }
          },

          React.createElement(
            Popup,
            null,

            React.createElement(
              "div",
              {
                style: {
                  minWidth: "230px",
                  fontFamily:
                    "Inter, Arial, sans-serif"
                }
              },

              React.createElement(
                "div",
                {
                  style: {
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "5px"
                  }
                },
                project.id
              ),

              React.createElement(
                "div",
                {
                  style: {
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "8px"
                  }
                },
                project.icon +
                  " " +
                  project.name
              ),

              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "10px",
                    marginBottom: "10px"
                  }
                },

                React.createElement(
                  "span",
                  {
                    style: {
                      fontSize: "12px",
                      fontWeight: "700"
                    }
                  },
                  project.province
                ),

                React.createElement(
                  "span",
                  {
                    style: {
                      fontSize: "12px",
                      fontWeight: "700"
                    }
                  },
                  project.status
                )
              ),

              React.createElement(
                "div",
                {
                  style: {
                    background: "#e5e7eb",
                    height: "7px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "6px"
                  }
                },

                React.createElement(
                  "div",
                  {
                    style: {
                      width:
                        project.progress +
                        "%",
                      height: "100%",
                      background:
                        project.status ===
                        "Critical"
                          ? "#dc2626"
                          : project.status ===
                            "Delayed"
                          ? "#d97706"
                          : project.status ===
                            "Completed"
                          ? "#16a34a"
                          : "#2563eb"
                    }
                  }
                )
              ),

              React.createElement(
                "div",
                {
                  style: {
                    fontSize: "12px",
                    color: "#475569",
                    marginBottom: "12px"
                  }
                },
                "Progress: " +
                  project.progress +
                  "%"
              ),

              React.createElement(
                "button",
                {
                  style: {
                    width: "100%",
                    border: "none",
                    borderRadius: "9px",
                    padding: "9px 12px",
                    background: "#0f172a",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer"
                  },
                  onClick: function () {
                    const fullProject =
                      PROJECTS.find(
                        function (item) {
                          return (
                            item.id ===
                            project.id
                          );
                        }
                      );

                    if (fullProject) {
                      onViewProject(
                        fullProject
                      );
                    }
                  }
                },
                "View Project →"
              )
            )
          )
        );
      })
    ),

    React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          background:
            "rgba(255,255,255,.96)",
          borderRadius: "14px",
          padding: "14px 16px",
          boxShadow:
            "0 8px 25px rgba(15,23,42,.16)",
          backdropFilter: "blur(10px)"
        }
      },

      React.createElement(
        "strong",
        {
          style: {
            display: "block",
            marginBottom: "9px",
            fontSize: "13px"
          }
        },
        "PROJECT STATUS"
      ),

      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gap: "6px",
            fontSize: "12px"
          }
        },

        React.createElement(
          "span",
          null,
          "🔴 Critical"
        ),

        React.createElement(
          "span",
          null,
          "🟠 Delayed"
        ),

        React.createElement(
          "span",
          null,
          "🔵 Active"
        ),

        React.createElement(
          "span",
          null,
          "🟢 Completed"
        )
      )
    ),

    React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background:
            "rgba(15,23,42,.94)",
          color: "white",
          borderRadius: "14px",
          padding: "12px 17px",
          boxShadow:
            "0 8px 25px rgba(15,23,42,.2)"
        }
      },

      React.createElement(
        "strong",
        {
          style: {
            display: "block",
            fontSize: "18px"
          }
        },
        projects.length
      ),

      React.createElement(
        "span",
        {
          style: {
            fontSize: "11px",
            opacity: ".75"
          }
        },
        "Mapped Projects"
      )
    )
  );
}

/* =========================================
   PUBLIC PORTAL
========================================= */

function PublicPortal({ setPage }) {
  const [search, setSearch] = useState("");
  const [province, setProvince] =
    useState("All Provinces");
  const [status, setStatus] =
    useState("All Status");

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [showReport, setShowReport] =
    useState(false);

  const [showTracking, setShowTracking] =
    useState(false);

  const [trackingId, setTrackingId] =
    useState("");

  const [trackedReport, setTrackedReport] =
    useState(null);

  const [citizenReports, setCitizenReports] =
    useState([]);

  const [citizenReport, setCitizenReport] =
    useState({
      anonymous: false,
      name: "",
      phone: "",
      project: "",
      category: "Progress Issue",
      priority: "Medium",
      location: "",
      description: "",
      latitude: "",
      longitude: "",
      evidence: null,
      evidencePreview: null,
      evidenceType: null
    });

  const [reportSubmitted, setReportSubmitted] =
    useState(null);

  const [gettingLocation, setGettingLocation] =
    useState(false);

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
    "Critical",
    "Completed"
  ];

  /* =========================================
     FILTER PROJECTS
  ========================================= */

  const filteredProjects = useMemo(
    function () {
      const keyword =
        search.toLowerCase().trim();

      return PROJECTS.filter(
        function (project) {
          const matchesSearch =
            !keyword ||
            project.name
              .toLowerCase()
              .includes(keyword) ||
            project.id
              .toLowerCase()
              .includes(keyword) ||
            project.district
              .toLowerCase()
              .includes(keyword) ||
            project.province
              .toLowerCase()
              .includes(keyword);

          const matchesProvince =
            province === "All Provinces" ||
            project.province === province;

          const matchesStatus =
            status === "All Status" ||
            project.status === status;

          return (
            matchesSearch &&
            matchesProvince &&
            matchesStatus
          );
        }
      );
    },
    [search, province, status]
  );

  /* =========================================
     SCROLL
  ========================================= */

  function scrollToSection(id) {
    const element =
      document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /* =========================================
     OPEN PROJECT
  ========================================= */

  function openProject(project) {
    setSelectedProject(
      Object.assign({}, project, {
        timeline:
          project.timeline ||
          DEFAULT_TIMELINE,

        evidence:
          project.evidence ||
          DEFAULT_EVIDENCE,

        aiReview:
          project.aiReview ||
          DEFAULT_AI_REVIEW
      })
    );
  }

  /* =========================================
     OPEN REPORT
  ========================================= */

  function openReport(project) {
    setSelectedProject(null);

    setCitizenReport({
      anonymous: false,
      name: "",
      phone: "",
      project: project
        ? project.name
        : "",
      category: "Progress Issue",
      priority: "Medium",
      location: project
        ? project.location
        : "",
      description: "",
      latitude: "",
      longitude: "",
      evidence: null,
      evidencePreview: null,
      evidenceType: null
    });

    setShowReport(true);
  }

  /* =========================================
     GPS
  ========================================= */

  function getCitizenLocation() {
    if (!navigator.geolocation) {
      alert(
        "Your browser does not support GPS location."
      );
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude =
          position.coords.latitude.toFixed(6);

        const longitude =
          position.coords.longitude.toFixed(6);

        setCitizenReport(function (prev) {
          return Object.assign(
            {},
            prev,
            {
              latitude: latitude,
              longitude: longitude,
              location:
                prev.location ||
                latitude +
                  ", " +
                  longitude
            }
          );
        });

        setGettingLocation(false);
      },
      function () {
        alert(
          "Unable to access your location. Please allow GPS permission."
        );

        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  /* =========================================
     EVIDENCE UPLOAD
  ========================================= */

  function handleEvidenceChange(event) {
    const file =
      event.target.files &&
      event.target.files[0];

    if (!file) {
      return;
    }

    const isVideo =
      file.type.startsWith("video/");

    const previewUrl =
      URL.createObjectURL(file);

    setCitizenReport(function (prev) {
      return Object.assign(
        {},
        prev,
        {
          evidence: file,
          evidencePreview: previewUrl,
          evidenceType: isVideo
            ? "video"
            : "image"
        }
      );
    });
  }

  /* =========================================
     REMOVE EVIDENCE
  ========================================= */

  function removeEvidence() {
    if (
      citizenReport.evidencePreview
    ) {
      URL.revokeObjectURL(
        citizenReport.evidencePreview
      );
    }

    setCitizenReport(function (prev) {
      return Object.assign(
        {},
        prev,
        {
          evidence: null,
          evidencePreview: null,
          evidenceType: null
        }
      );
    });
  }

  /* =========================================
     AI REVIEW
  ========================================= */

  function generateAIReview() {
    const description =
      citizenReport.description
        .toLowerCase();

    const highRiskWords = [
      "fake",
      "not completed",
      "no work",
      "poor quality",
      "delay",
      "delayed",
      "broken",
      "unsafe",
      "missing",
      "stopped",
      "incomplete"
    ];

    const detected =
      highRiskWords.some(
        function (word) {
          return description.includes(word);
        }
      ) ||
      citizenReport.priority ===
        "Critical" ||
      citizenReport.priority ===
        "High";

    if (detected) {
      return {
        aiStatus:
          "Potential discrepancy detected",
        aiMessage:
          "The submitted information contains indicators that may require additional verification.",
        aiFlag: true
      };
    }

    return {
      aiStatus:
        "No immediate discrepancy detected",
      aiMessage:
        "No immediate high-risk indicator was identified from the submitted information.",
      aiFlag: false
    };
  }

  /* =========================================
     SUBMIT CITIZEN REPORT
  ========================================= */

  function submitCitizenReport(event) {
    if (event) {
      event.preventDefault();
    }

    if (!citizenReport.project) {
      alert(
        "Please select a project."
      );
      return;
    }

    if (!citizenReport.location) {
      alert(
        "Please provide the project location."
      );
      return;
    }

    if (
      !citizenReport.description.trim()
    ) {
      alert(
        "Please describe the issue."
      );
      return;
    }

    const year =
      new Date().getFullYear();

    const reportNumber =
      String(
        citizenReports.length + 1
      ).padStart(5, "0");

    const reportId =
      "CIT-" +
      year +
      "-" +
      reportNumber;

    const aiReview =
      generateAIReview();

    const newReport =
      Object.assign(
        {},
        citizenReport,
        {
          id: reportId,
          status: "Submitted",
          aiStatus:
            aiReview.aiStatus,
          aiMessage:
            aiReview.aiMessage,
          aiFlag:
            aiReview.aiFlag,
          submittedAt:
            new Date().toLocaleString()
        }
      );

    setCitizenReports(
      function (prev) {
        return [
          newReport,
          ...prev
        ];
      }
    );

    setReportSubmitted(
      newReport
    );

    setShowReport(false);
  }

  /* =========================================
     TRACK REPORT
  ========================================= */

  function trackCitizenReport(event) {
    if (event) {
      event.preventDefault();
    }

    const id =
      trackingId
        .trim()
        .toUpperCase();

    if (!id) {
      alert(
        "Please enter your report tracking ID."
      );
      return;
    }

    const foundReport =
      citizenReports.find(
        function (report) {
          return (
            report.id.toUpperCase() ===
            id
          );
        }
      );

    if (!foundReport) {
      alert(
        "Report not found. Please check your tracking ID."
      );
      return;
    }

    setTrackedReport(
      foundReport
    );

    setShowTracking(true);
  }

  /* =========================================
     OPEN TRACKING
  ========================================= */

  function openTracking() {
    setTrackingId("");

    setTrackedReport(null);

    setShowTracking(true);
  }

  /* =========================================
     CLOSE SUCCESS
  ========================================= */

  function closeReportSuccess() {
    setReportSubmitted(null);

    setCitizenReport({
      anonymous: false,
      name: "",
      phone: "",
      project: "",
      category: "Progress Issue",
      priority: "Medium",
      location: "",
      description: "",
      latitude: "",
      longitude: "",
      evidence: null,
      evidencePreview: null,
      evidenceType: null
    });
  }

  /* =========================================
     ADMIN
  ========================================= */

  function openAdmin() {
    alert(
      "Admin Login will connect to the secure administrator authentication system."
    );
  }

  /* =========================================
     LIVE MAP
  ========================================= */

  function openLiveMap() {
    const mapElement =
      document.getElementById(
        "public-map-section"
      );

    if (mapElement) {
      mapElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /* =========================================
     CLEAR FILTER
  ========================================= */

  function clearFilters() {
    setSearch("");
    setProvince("All Provinces");
    setStatus("All Status");
  }

  return React.createElement(
    "div",
    {
      className: "public-portal"
    },

    /* =========================================
       NAVBAR
    ========================================= */

    React.createElement(
      "nav",
      {
        className: "public-navbar"
      },

      React.createElement(
        "div",
        {
          className: "public-brand",
          onClick: function () {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        },

        React.createElement(
          "div",
          {
            className:
              "public-brand-logo"
          },
          "PW"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            "ProjectWatch"
          ),

          React.createElement(
            "span",
            null,
            "NEPAL"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "public-nav-right"
        },

        React.createElement(
          "button",
          {
            className:
              "public-nav-link",
            onClick: function () {
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }
          },
          "Home"
        ),

        React.createElement(
          "button",
          {
            className:
              "public-nav-link",
            onClick: function () {
              scrollToSection(
                "public-projects"
              );
            }
          },
          "Projects"
        ),

        React.createElement(
          "button",
          {
            className:
              "public-nav-link",
            onClick: openLiveMap
          },
          "Live Map"
        ),

        React.createElement(
          "button",
          {
            className:
              "public-nav-link",
            onClick: function () {
              scrollToSection(
                "public-reports"
              );
            }
          },
          "Reports"
        ),

        React.createElement(
          "button",
          {
            className:
              "public-nav-link",
            onClick: openTracking
          },
          "Track Report"
        ),

        React.createElement(
          "span",
          {
            className:
              "public-live-status"
          },

          React.createElement(
            "span",
            {
              className:
                "public-live-dot"
            }
          ),

          "Live"
        ),

        React.createElement(
          "button",
          {
            className:
              "public-admin-button",
            onClick: openAdmin
          },
          "🔐 Admin Login"
        )
      )
    ),

    /* =========================================
       HERO
    ========================================= */

    React.createElement(
      "section",
      {
        className:
          "public-hero"
      },

      React.createElement(
        "div",
        {
          className:
            "public-hero-content"
        },

        React.createElement(
          "div",
          {
            className:
              "public-hero-badge"
          },
          "🇳🇵 GOVERNMENT PROJECT TRANSPARENCY"
        ),

        React.createElement(
          "h1",
          null,
          "Track Public Projects.",
          React.createElement("br"),
          React.createElement(
            "span",
            null,
            "See Where Your Money Goes."
          )
        ),

        React.createElement(
          "p",
          null,
          "Explore government projects across Nepal, monitor progress, view verification status, and report issues directly."
        ),

        React.createElement(
          "div",
          {
            className:
              "public-hero-search"
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
              placeholder:
                "Search project, district, province or project ID...",
              value: search,
              onChange:
                function (event) {
                  setSearch(
                    event.target.value
                  );
                }
            }
          ),

          React.createElement(
            "button",
            {
              onClick:
                function () {
                  scrollToSection(
                    "public-projects"
                  );
                }
            },
            "Search"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "public-hero-stat-strip"
        },

        React.createElement(
          "div",
          null,
          React.createElement(
            "strong",
            null,
            "1,284"
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
            "NPR 48.2B"
          ),
          React.createElement(
            "span",
            null,
            "Total Budget"
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement(
            "strong",
            null,
            "67%"
          ),
          React.createElement(
            "span",
            null,
            "Overall Progress"
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement(
            "strong",
            null,
            "7"
          ),
          React.createElement(
            "span",
            null,
            "Provinces Covered"
          )
        )
      )
    ),

    /* =========================================
       MAIN
    ========================================= */

    React.createElement(
      "main",
      {
        className:
          "public-main"
      },

      /* PROJECTS */

      React.createElement(
        "section",
        {
          className:
            "public-project-section",
          id: "public-projects"
        },

        React.createElement(
          "div",
          {
            className:
              "public-section-heading"
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "span",
              null,
              "PROJECT DIRECTORY"
            ),

            React.createElement(
              "h2",
              null,
              "Government Projects"
            ),

            React.createElement(
              "p",
              null,
              "Search and explore publicly available project information."
            )
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }
            },

            React.createElement(
              "button",
              {
                className:
                  "public-report-main-button",
                onClick:
                  function () {
                    openReport(null);
                  }
              },
              "⚑ Report an Issue"
            ),

            React.createElement(
              "button",
              {
                className:
                  "public-report-main-button",
                onClick:
                  openTracking
              },
              "🔎 Track Report"
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "public-filters"
          },

          React.createElement(
            "div",
            {
              className:
                "public-filter-search"
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
                placeholder:
                  "Search projects...",
                value: search,
                onChange:
                  function (event) {
                    setSearch(
                      event.target.value
                    );
                  }
              }
            )
          ),

          React.createElement(
            "select",
            {
              value: province,
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
                  item
                );
              }
            )
          ),

          React.createElement(
            "select",
            {
              value: status,
              onChange:
                function (event) {
                  setStatus(
                    event.target.value
                  );
                }
            },

            statuses.map(
              function (item) {
                return React.createElement(
                  "option",
                  {
                    key: item,
                    value: item
                  },
                  item
                );
              }
            )
          ),

          React.createElement(
            "button",
            {
              className:
                "public-clear-button",
              onClick: clearFilters
            },
            "Clear"
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "public-result-count"
          },

          "Showing ",

          React.createElement(
            "strong",
            null,
            filteredProjects.length
          ),

          " projects"
        ),

        React.createElement(
          "div",
          {
            className:
              "public-project-grid"
          },

          filteredProjects.length === 0
            ? React.createElement(
                "div",
                {
                  className:
                    "public-empty-state"
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
                function (project) {
                  return React.createElement(
                    "article",
                    {
                      className:
                        "public-project-card",
                      key: project.id
                    },

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-card-top"
                      },

                      React.createElement(
                        "div",
                        {
                          className:
                            "public-project-icon"
                        },
                        project.icon
                      ),

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "small",
                          {
                            className:
                              "public-project-id"
                          },
                          project.id
                        ),

                        React.createElement(
                          "h3",
                          null,
                          project.name
                        ),

                        React.createElement(
                          "div",
                          {
                            className:
                              "public-location"
                          },
                          "⌖ ",
                          project.location
                        )
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-card-status-row"
                      },

                      React.createElement(
                        "span",
                        {
                          className:
                            "public-status public-status-" +
                            project.status.toLowerCase()
                        },
                        project.status
                      ),

                      React.createElement(
                        "span",
                        {
                          className:
                            "public-risk public-risk-" +
                            project.risk.toLowerCase()
                        },
                        project.risk +
                          " Risk"
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-progress-box"
                      },

                      React.createElement(
                        "div",
                        {
                          className:
                            "public-progress-header"
                        },

                        React.createElement(
                          "span",
                          null,
                          "Project Progress"
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
                            "public-progress-track"
                        },

                        React.createElement(
                          "div",
                          {
                            className:
                              "public-progress-fill",
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
                          "public-card-info"
                      },

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "span",
                          null,
                          "Budget"
                        ),

                        React.createElement(
                          "strong",
                          null,
                          project.budget
                        )
                      ),

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "span",
                          null,
                          "Updated"
                        ),

                        React.createElement(
                          "strong",
                          null,
                          project.updated
                        )
                      )
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-card-bottom"
                      },

                      React.createElement(
                        "span",
                        {
                          className:
                            "public-verification " +
                            (
                              project.verification ===
                              "Verified"
                                ? "verified"
                                : project.verification ===
                                  "Pending"
                                ? "pending"
                                : "review"
                            )
                        },
                        project.verification
                      ),

                      React.createElement(
                        "button",
                        {
                          className:
                            "public-view-button",
                          onClick:
                            function () {
                              openProject(
                                project
                              );
                            }
                        },
                        "View Project →"
                      )
                    )
                  );
                }
              )
        )
      ),

      /* MAP */

      React.createElement(
        "section",
        {
          className:
            "public-live-map-section",
          id: "public-map-section"
        },

        React.createElement(
          "div",
          {
            className:
              "public-section-heading"
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "span",
              null,
              "LIVE PROJECT MAP"
            ),

            React.createElement(
              "h2",
              null,
              "Government Projects Across Nepal"
            ),

            React.createElement(
              "p",
              null,
              "Explore project locations, progress and verification status directly on the map."
            )
          )
        ),

        React.createElement(
          PublicProjectMap,
          {
            projects:
              PUBLIC_MAP_PROJECTS,
            onViewProject:
              openProject
          }
        )
      ),

      /* REPORTS */

      React.createElement(
        "section",
        {
          className:
            "public-reports-section",
          id: "public-reports"
        },

        React.createElement(
          "div",
          {
            className:
              "public-section-heading"
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "span",
              null,
              "PUBLIC REPORTING"
            ),

            React.createElement(
              "h2",
              null,
              "Project Transparency Reports"
            ),

            React.createElement(
              "p",
              null,
              "Review project progress and public monitoring information."
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "public-report-cards"
          },

          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "67%"
            ),
            React.createElement(
              "span",
              null,
              "Overall Project Progress"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "151"
            ),
            React.createElement(
              "span",
              null,
              "Delayed Projects"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "37"
            ),
            React.createElement(
              "span",
              null,
              "Critical Projects"
            )
          ),

          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "1,284"
            ),
            React.createElement(
              "span",
              null,
              "Tracked Projects"
            )
          )
        )
      ),

      /* =========================================
         TRANSPARENCY
      ========================================= */

      React.createElement(
        "section",
        {
          className:
            "public-transparency-section"
        },

        React.createElement(
          "div",
          {
            className:
              "public-transparency-content"
          },

          React.createElement(
            "span",
            null,
            "WHY PROJECTWATCH?"
          ),

          React.createElement(
            "h2",
            null,
            "Building Trust Through Transparency"
          ),

          React.createElement(
            "p",
            null,
            "ProjectWatch Nepal brings project information, field evidence, progress monitoring, citizen feedback, and verification workflows together in one transparent platform."
          ),

          React.createElement(
            "div",
            {
              className:
                "public-trust-grid"
            },

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "📍"
              ),

              React.createElement(
                "strong",
                null,
                "GPS Verified"
              ),

              React.createElement(
                "p",
                null,
                "Project locations can be verified using geographic evidence."
              )
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "📸"
              ),

              React.createElement(
                "strong",
                null,
                "Field Evidence"
              ),

              React.createElement(
                "p",
                null,
                "Photos and videos support project progress monitoring."
              )
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "🤖"
              ),

              React.createElement(
                "strong",
                null,
                "AI Assistance"
              ),

              React.createElement(
                "p",
                null,
                "Potential discrepancies are flagged for human review."
              )
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "👥"
              ),

              React.createElement(
                "strong",
                null,
                "Citizen Voice"
              ),

              React.createElement(
                "p",
                null,
                "Citizens can report project-related issues."
              )
            )
          )
        )
      )
    ),

    /* =========================================
       FOOTER
    ========================================= */

    React.createElement(
      "footer",
      {
        className:
          "public-footer"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "strong",
          null,
          "ProjectWatch Nepal"
        ),

        React.createElement(
          "p",
          null,
          "Public infrastructure transparency platform"
        )
      ),

      React.createElement(
        "span",
        null,
        "© 2026 ProjectWatch Nepal"
      )
    ),

    /* =====================================================
       PROJECT DETAILS MODAL
    ===================================================== */

    selectedProject &&
      React.createElement(
        "div",
        {
          className:
            "public-modal-overlay",

          onClick:
            function (event) {
              if (
                event.target ===
                event.currentTarget
              ) {
                setSelectedProject(null);
              }
            }
        },

        React.createElement(
          "div",
          {
            className:
              "public-project-modal"
          },

          React.createElement(
            "button",
            {
              className:
                "public-modal-close",

              onClick:
                function () {
                  setSelectedProject(
                    null
                  );
                }
            },
            "×"
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-heading"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-modal-icon"
              },
              selectedProject.icon
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "small",
                null,
                selectedProject.id
              ),

              React.createElement(
                "h2",
                null,
                selectedProject.name
              ),

              React.createElement(
                "span",
                {
                  className:
                    "public-modal-status public-status-" +
                    selectedProject.status.toLowerCase()
                },
                selectedProject.status
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-progress"
            },

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "Current Progress"
              ),

              React.createElement(
                "strong",
                null,
                selectedProject.progress +
                  "%"
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-progress-track"
              },

              React.createElement(
                "div",
                {
                  className:
                    "public-progress-fill",

                  style: {
                    width:
                      selectedProject.progress +
                      "%"
                  }
                }
              )
            )
          ),

          React.createElement(
            "p",
            {
              className:
                "public-project-description"
            },
            selectedProject.description
          ),

          React.createElement(
            "div",
            {
              className:
                "public-detail-grid"
            },

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Budget"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.budget
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Province"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.province
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "District"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.district
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Risk Level"
              ),
              React.createElement(
                "strong",
                {
                  className:
                    "public-modal-risk-" +
                    selectedProject.risk.toLowerCase()
                },
                selectedProject.risk
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Contractor"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.contractor
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Department"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.department
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "Start Date"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.startDate
              )
            ),

            React.createElement(
              "div",
              null,
              React.createElement(
                "span",
                null,
                "End Date"
              ),
              React.createElement(
                "strong",
                null,
                selectedProject.endDate
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-info-card public-location-card"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-modal-info-icon"
              },
              "📍"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "PROJECT LOCATION"
              ),

              React.createElement(
                "strong",
                null,
                selectedProject.location
              ),

              React.createElement(
                "small",
                null,
                "Location information is linked with project monitoring data."
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-section"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-modal-section-title"
              },

              React.createElement(
                "div",
                null,
                "📸"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "h3",
                  null,
                  "Latest Field Evidence"
                ),

                React.createElement(
                  "p",
                  null,
                  "Most recent evidence submitted from the project site."
                )
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-evidence-card"
              },

              React.createElement(
                "div",
                {
                  className:
                    "public-evidence-preview"
                },

                selectedProject.evidence
                  .type === "Video"
                  ? "▶"
                  : "📷"
              ),

              React.createElement(
                "div",
                {
                  className:
                    "public-evidence-details"
                },

                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "span",
                    null,
                    "Evidence Type"
                  ),
                  React.createElement(
                    "strong",
                    null,
                    selectedProject.evidence.type
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "span",
                    null,
                    "Submitted By"
                  ),
                  React.createElement(
                    "strong",
                    null,
                    selectedProject.evidence
                      .submittedBy
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "span",
                    null,
                    "Date"
                  ),
                  React.createElement(
                    "strong",
                    null,
                    selectedProject.evidence.date
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "span",
                    null,
                    "Location"
                  ),
                  React.createElement(
                    "strong",
                    null,
                    selectedProject.evidence
                      .location
                  )
                )
              ),

              React.createElement(
                "span",
                {
                  className:
                    "public-evidence-status"
                },
                "✓ " +
                  selectedProject.evidence.status
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-section"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-modal-section-title"
              },

              React.createElement(
                "div",
                null,
                "📈"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "h3",
                  null,
                  "Progress Timeline"
                ),

                React.createElement(
                  "p",
                  null,
                  "Key project monitoring events."
                )
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-project-timeline"
              },

              selectedProject.timeline.map(
                function (
                  item,
                  index
                ) {
                  return React.createElement(
                    "div",
                    {
                      className:
                        "public-timeline-item",
                      key:
                        item.date +
                        item.title
                    },

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-timeline-dot"
                      },
                      index ===
                        selectedProject
                          .timeline
                          .length -
                          1
                        ? "✓"
                        : ""
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "public-timeline-content"
                      },

                      React.createElement(
                        "span",
                        null,
                        item.date
                      ),

                      React.createElement(
                        "strong",
                        null,
                        item.title
                      ),

                      React.createElement(
                        "p",
                        null,
                        item.description
                      )
                    )
                  );
                }
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-ai-review-card"
            },

            React.createElement(
              "div",
              {
                className:
                  "public-ai-review-header"
              },

              React.createElement(
                "div",
                {
                  className:
                    "public-ai-icon"
                },
                "🤖"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "span",
                  null,
                  "AI VERIFICATION"
                ),

                React.createElement(
                  "h3",
                  null,
                  "Project Evidence Review"
                )
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-ai-review-status"
              },

              React.createElement(
                "strong",
                null,
                selectedProject.aiReview.status
              )
            ),

            React.createElement(
              "p",
              null,
              selectedProject.aiReview.message
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-ai-review-note"
              },

              "ℹ️ AI assistance does not make a final allegation or corruption determination. Final decisions require authorized human review."
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-verification-panel"
            },

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                "VERIFICATION STATUS"
              ),

              React.createElement(
                "strong",
                null,
                selectedProject.verification
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "public-verification-check"
              },

              selectedProject.verification ===
              "Verified"
                ? "✓"
                : "!"
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "public-modal-actions"
            },

            React.createElement(
              "button",
              {
                className:
                  "public-modal-map-button",

                onClick:
                  function () {
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=" +
                        encodeURIComponent(
                          selectedProject.location
                        ),
                      "_blank"
                    );
                  }
              },
              "🗺️ Open Map"
            ),

            React.createElement(
              "button",
              {
                className:
                  "public-modal-report-button",

                onClick:
                  function () {
                    openReport(
                      selectedProject
                    );
                  }
              },
              "⚑ Report Issue"
            )
          )
        )
      ),

    /* =====================================================
       CITIZEN REPORT MODAL
    ===================================================== */

    showReport &&
      React.createElement(
        "div",
        {
          className:
            "public-modal-overlay",

          onClick:
            function (event) {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowReport(false);
              }
            }
        },

        React.createElement(
          "div",
          {
            className:
              "citizen-report-modal"
          },

          React.createElement(
            "div",
            {
              className:
                "citizen-report-header"
            },

            React.createElement(
              "div",
              {
                className:
                  "citizen-report-title"
              },

              React.createElement(
                "div",
                {
                  className:
                    "citizen-report-icon"
                },
                "⚑"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "span",
                  null,
                  "CITIZEN REPORT"
                ),

                React.createElement(
                  "h2",
                  null,
                  "Report a Project Issue"
                ),

                React.createElement(
                  "p",
                  null,
                  "Help improve transparency by reporting issues you observe."
                )
              )
            ),

            React.createElement(
              "button",
              {
                type: "button",
                className:
                  "citizen-report-close",

                onClick:
                  function () {
                    setShowReport(false);
                  }
              },
              "×"
            )
          ),

          /* IMPORTANT:
             FORM NOW WRAPS BODY + FOOTER
          */

          React.createElement(
            "form",
            {
              onSubmit:
                submitCitizenReport
            },

            React.createElement(
              "div",
              {
                className:
                  "citizen-report-body"
              },

              React.createElement(
                "div",
                {
                  className:
                    "citizen-report-notice"
                },

                React.createElement(
                  "strong",
                  null,
                  "🔒 Your report is protected"
                ),

                React.createElement(
                  "p",
                  null,
                  "Reports are reviewed by authorized officials. AI assistance may flag potential discrepancies for human review."
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-report-grid"
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-field"
                  },

                  React.createElement(
                    "label",
                    null,
                    "Project *"
                  ),

                  React.createElement(
                    "select",
                    {
                      value:
                        citizenReport.project,

                      onChange:
                        function (event) {
                          const project =
                            PROJECTS.find(
                              function (
                                item
                              ) {
                                return (
                                  item.name ===
                                  event
                                    .target
                                    .value
                                );
                              }
                            );

                          setCitizenReport(
                            function (
                              prev
                            ) {
                              return Object.assign(
                                {},
                                prev,
                                {
                                  project:
                                    event
                                      .target
                                      .value,
                                  location:
                                    project
                                      ? project.location
                                      : prev.location
                                }
                              );
                            }
                          );
                        }
                    },

                    React.createElement(
                      "option",
                      {
                        value: ""
                      },
                      "Select Project"
                    ),

                    PROJECTS.map(
                      function (
                        project
                      ) {
                        return React.createElement(
                          "option",
                          {
                            key:
                              project.id,
                            value:
                              project.name
                          },
                          project.name
                        );
                      }
                    )
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-field"
                  },

                  React.createElement(
                    "label",
                    null,
                    "Issue Category *"
                  ),

                  React.createElement(
                    "select",
                    {
                      value:
                        citizenReport.category,

                      onChange:
                        function (event) {
                          setCitizenReport(
                            function (
                              prev
                            ) {
                              return Object.assign(
                                {},
                                prev,
                                {
                                  category:
                                    event
                                      .target
                                      .value
                                }
                              );
                            }
                          );
                        }
                    },

                    React.createElement(
                      "option",
                      {
                        value:
                          "Progress Issue"
                      },
                      "Progress Issue"
                    ),

                    React.createElement(
                      "option",
                      {
                        value:
                          "Construction Quality"
                      },
                      "Construction Quality"
                    ),

                    React.createElement(
                      "option",
                      {
                        value:
                          "Project Delay"
                      },
                      "Project Delay"
                    ),

                    React.createElement(
                      "option",
                      {
                        value:
                          "Site Condition"
                      },
                      "Site Condition"
                    ),

                    React.createElement(
                      "option",
                      {
                        value:
                          "Safety Issue"
                      },
                      "Safety Issue"
                    ),

                    React.createElement(
                      "option",
                      {
                        value: "Other"
                      },
                      "Other"
                    )
                  )
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-field"
                },

                React.createElement(
                  "label",
                  null,
                  "Priority"
                ),

                React.createElement(
                  "select",
                  {
                    value:
                      citizenReport.priority,

                    onChange:
                      function (event) {
                        setCitizenReport(
                          function (
                            prev
                          ) {
                            return Object.assign(
                              {},
                              prev,
                              {
                                priority:
                                  event
                                    .target
                                    .value
                              }
                            );
                          }
                        );
                      }
                  },

                  React.createElement(
                    "option",
                    {
                      value: "Low"
                    },
                    "Low"
                  ),

                  React.createElement(
                    "option",
                    {
                      value: "Medium"
                    },
                    "Medium"
                  ),

                  React.createElement(
                    "option",
                    {
                      value: "High"
                    },
                    "High"
                  ),

                  React.createElement(
                    "option",
                    {
                      value: "Critical"
                    },
                    "Critical"
                  )
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-field"
                },

                React.createElement(
                  "label",
                  null,
                  "Project / Location *"
                ),

                React.createElement(
                  "input",
                  {
                    type: "text",
                    placeholder:
                      "Enter project name or location",
                    value:
                      citizenReport.location,

                    onChange:
                      function (event) {
                        setCitizenReport(
                          function (
                            prev
                          ) {
                            return Object.assign(
                              {},
                              prev,
                              {
                                location:
                                  event
                                    .target
                                    .value
                              }
                            );
                          }
                        );
                      }
                  }
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-gps-row"
                },

                React.createElement(
                  "button",
                  {
                    type: "button",
                    className:
                      "citizen-gps-button",
                    onClick:
                      getCitizenLocation
                  },

                  gettingLocation
                    ? "📍 Getting Location..."
                    : "📍 Use My Current Location"
                ),

                citizenReport.latitude &&
                  React.createElement(
                    "span",
                    {
                      className:
                        "citizen-gps-success"
                    },
                    "✓ GPS captured"
                  )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-report-grid"
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-field"
                  },

                  React.createElement(
                    "label",
                    null,
                    "Name"
                  ),

                  React.createElement(
                    "input",
                    {
                      type: "text",
                      disabled:
                        citizenReport.anonymous,
                      placeholder:
                        citizenReport.anonymous
                          ? "Anonymous"
                          : "Your name",
                      value:
                        citizenReport.name,

                      onChange:
                        function (
                          event
                        ) {
                          setCitizenReport(
                            function (
                              prev
                            ) {
                              return Object.assign(
                                {},
                                prev,
                                {
                                  name:
                                    event
                                      .target
                                      .value
                                }
                              );
                            }
                          );
                        }
                    }
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-field"
                  },

                  React.createElement(
                    "label",
                    null,
                    "Phone (Optional)"
                  ),

                  React.createElement(
                    "input",
                    {
                      type: "tel",
                      disabled:
                        citizenReport.anonymous,
                      placeholder:
                        "98XXXXXXXX",
                      value:
                        citizenReport.phone,

                      onChange:
                        function (
                          event
                        ) {
                          setCitizenReport(
                            function (
                              prev
                            ) {
                              return Object.assign(
                                {},
                                prev,
                                {
                                  phone:
                                    event
                                      .target
                                      .value
                                }
                              );
                            }
                          );
                        }
                    }
                  )
                )
              ),

              React.createElement(
                "label",
                {
                  className:
                    "citizen-anonymous"
                },

                React.createElement(
                  "input",
                  {
                    type: "checkbox",
                    checked:
                      citizenReport.anonymous,

                    onChange:
                      function (event) {
                        setCitizenReport(
                          function (
                            prev
                          ) {
                            return Object.assign(
                              {},
                              prev,
                              {
                                anonymous:
                                  event
                                    .target
                                    .checked,
                                name:
                                  event
                                    .target
                                    .checked
                                    ? ""
                                    : prev.name,
                                phone:
                                  event
                                    .target
                                    .checked
                                    ? ""
                                    : prev.phone
                              }
                            );
                          }
                        );
                      }
                  }
                ),

                React.createElement(
                  "span",
                  null,
                  "Submit this report anonymously"
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-field"
                },

                React.createElement(
                  "label",
                  null,
                  "Describe the Issue *"
                ),

                React.createElement(
                  "textarea",
                  {
                    rows: 5,
                    placeholder:
                      "Describe what you observed at the project site...",

                    value:
                      citizenReport.description,

                    onChange:
                      function (
                        event
                      ) {
                        setCitizenReport(
                          function (
                            prev
                          ) {
                            return Object.assign(
                              {},
                              prev,
                              {
                                description:
                                  event
                                    .target
                                    .value
                              }
                            );
                          }
                        );
                      }
                  }
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-field"
                },

                React.createElement(
                  "label",
                  null,
                  "Photo / Video Evidence"
                ),

                React.createElement(
                  "label",
                  {
                    className:
                      "citizen-upload-box"
                  },

                  React.createElement(
                    "div",
                    {
                      className:
                        "citizen-upload-icon"
                    },
                    "📷"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    "Upload evidence"
                  ),

                  React.createElement(
                    "span",
                    null,
                    "Photo or video from the project site"
                  ),

                  React.createElement(
                    "input",
                    {
                      type: "file",
                      accept:
                        "image/*,video/*",

                      onChange:
                        handleEvidenceChange
                    }
                  )
                ),

                citizenReport.evidence &&
                  React.createElement(
                    "div",
                    {
                      className:
                        "citizen-evidence-preview"
                    },

                    citizenReport.evidenceType ===
                    "video"
                      ? React.createElement(
                          "video",
                          {
                            src:
                              citizenReport.evidencePreview,
                            controls: true
                          }
                        )
                      : React.createElement(
                          "img",
                          {
                            src:
                              citizenReport.evidencePreview,
                            alt:
                              "Evidence preview"
                          }
                        ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "citizen-evidence-preview-info"
                      },

                      React.createElement(
                        "span",
                        null,
                        citizenReport
                          .evidence
                          .name
                      ),

                      React.createElement(
                        "button",
                        {
                          type: "button",
                          onClick:
                            removeEvidence
                        },
                        "Remove"
                      )
                    )
                  )
              ),

              citizenReport.latitude &&
                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-location-preview"
                  },

                  React.createElement(
                    "strong",
                    null,
                    "📍 GPS Location Captured"
                  ),

                  React.createElement(
                    "span",
                    null,
                    citizenReport.latitude +
                      ", " +
                      citizenReport.longitude
                  )
                )
            ),

            /* =====================================
               FOOTER INSIDE FORM
            ===================================== */

            React.createElement(
              "div",
              {
                className:
                  "citizen-report-footer"
              },

              React.createElement(
                "button",
                {
                  type: "button",
                  className:
                    "citizen-cancel-button",

                  onClick:
                    function () {
                      setShowReport(false);
                    }
                },
                "Cancel"
              ),

              React.createElement(
                "button",
                {
                  type: "submit",
                  className:
                    "citizen-submit-button"
                },
                "Submit Report →"
              )
            )
          )
        )
      ),

    /* =====================================================
       SUCCESS MODAL
    ===================================================== */

    reportSubmitted &&
      React.createElement(
        "div",
        {
          className:
            "public-modal-overlay"
        },

        React.createElement(
          "div",
          {
            className:
              "citizen-success-modal"
          },

          React.createElement(
            "div",
            {
              className:
                "citizen-success-icon"
            },
            "✓"
          ),

          React.createElement(
            "span",
            {
              className:
                "citizen-success-label"
            },
            "REPORT SUBMITTED"
          ),

          React.createElement(
            "h2",
            null,
            "Thank You for Helping Nepal"
          ),

          React.createElement(
            "p",
            null,
            "Your report has been successfully submitted and will be reviewed by the responsible authority."
          ),

          React.createElement(
            "div",
            {
              className:
                "citizen-report-id-box"
            },

            React.createElement(
              "span",
              null,
              "YOUR REPORT ID"
            ),

            React.createElement(
              "strong",
              null,
              reportSubmitted.id
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "citizen-status-flow"
            },

            React.createElement(
              "div",
              {
                className:
                  "citizen-status-step active"
              },

              React.createElement(
                "div",
                null,
                "✓"
              ),

              React.createElement(
                "span",
                null,
                "Submitted"
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "citizen-status-line"
              }
            ),

            React.createElement(
              "div",
              {
                className:
                  "citizen-status-step"
              },

              React.createElement(
                "div",
                null,
                "2"
              ),

              React.createElement(
                "span",
                null,
                "Under Review"
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "citizen-status-line"
              }
            ),

            React.createElement(
              "div",
              {
                className:
                  "citizen-status-step"
              },

              React.createElement(
                "div",
                null,
                "3"
              ),

              React.createElement(
                "span",
                null,
                "Resolved"
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "citizen-ai-pending"
            },

            React.createElement(
              "span",
              null,
              "🤖"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                reportSubmitted.aiStatus
              ),

              React.createElement(
                "p",
                null,
                reportSubmitted.aiMessage
              ),

              React.createElement(
                "p",
                null,
                "AI results are advisory and require human review."
              )
            )
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: "9px"
              }
            },

            React.createElement(
              "button",
              {
                className:
                  "citizen-cancel-button",
                style: {
                  flex: 1
                },

                onClick:
                  function () {
                    setReportSubmitted(
                      null
                    );

                    setTrackingId(
                      reportSubmitted.id
                    );

                    setTrackedReport(
                      reportSubmitted
                    );

                    setShowTracking(
                      true
                    );
                  }
              },
              "🔎 Track Report"
            ),

            React.createElement(
              "button",
              {
                className:
                  "citizen-submit-button",
                style: {
                  flex: 1
                },

                onClick:
                  closeReportSuccess
              },
              "Done"
            )
          )
        )
      ),

    /* =====================================================
       TRACKING MODAL
    ===================================================== */

    showTracking &&
      React.createElement(
        "div",
        {
          className:
            "public-modal-overlay",

          onClick:
            function (event) {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowTracking(false);
              }
            }
        },

        React.createElement(
          "div",
          {
            className:
              "citizen-tracking-modal"
          },

          React.createElement(
            "button",
            {
              className:
                "citizen-tracking-close",
              onClick:
                function () {
                  setShowTracking(false);
                }
            },
            "×"
          ),

          React.createElement(
            "div",
            {
              className:
                "citizen-tracking-icon"
            },
            "🔎"
          ),

          React.createElement(
            "span",
            {
              className:
                "citizen-success-label"
            },
            "REPORT TRACKING"
          ),

          React.createElement(
            "h2",
            null,
            "Track Your Report"
          ),

          React.createElement(
            "p",
            null,
            "Enter your citizen report tracking ID."
          ),

          React.createElement(
            "form",
            {
              className:
                "public-track-form",
              onSubmit:
                trackCitizenReport,
              style: {
                marginBottom: "22px"
              }
            },

            React.createElement(
              "input",
              {
                type: "text",
                placeholder:
                  "CIT-2026-00001",
                value:
                  trackingId,
                onChange:
                  function (event) {
                    setTrackingId(
                      event.target.value
                    );
                  }
              }
            ),

            React.createElement(
              "button",
              {
                type: "submit"
              },
              "Track →"
            )
          ),

          trackedReport &&
            React.createElement(
              React.Fragment,
              null,

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-id"
                },

                React.createElement(
                  "span",
                  null,
                  "TRACKING ID"
                ),

                React.createElement(
                  "strong",
                  null,
                  trackedReport.id
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-project"
                },

                React.createElement(
                  "span",
                  null,
                  "PROJECT"
                ),

                React.createElement(
                  "strong",
                  null,
                  trackedReport.project
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-status"
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "tracking-status-item active"
                  },

                  React.createElement(
                    "div",
                    null,
                    "✓"
                  ),

                  React.createElement(
                    "span",
                    null,
                    "Submitted"
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "tracking-status-line active"
                  }
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "tracking-status-item " +
                      (
                        trackedReport.status ===
                          "Under Review" ||
                        trackedReport.status ===
                          "Resolved"
                          ? "active"
                          : ""
                      )
                  },

                  React.createElement(
                    "div",
                    null,
                    "2"
                  ),

                  React.createElement(
                    "span",
                    null,
                    "Under Review"
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "tracking-status-line " +
                      (
                        trackedReport.status ===
                        "Resolved"
                          ? "active"
                          : ""
                      )
                  }
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "tracking-status-item " +
                      (
                        trackedReport.status ===
                        "Resolved"
                          ? "active"
                          : ""
                      )
                  },

                  React.createElement(
                    "div",
                    null,
                    "3"
                  ),

                  React.createElement(
                    "span",
                    null,
                    "Resolved"
                  )
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-details"
                },

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "span",
                    null,
                    "Issue Type"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    trackedReport.category
                  )
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "span",
                    null,
                    "Priority"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    trackedReport.priority
                  )
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "span",
                    null,
                    "Status"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    trackedReport.status
                  )
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-project"
                },

                React.createElement(
                  "span",
                  null,
                  "LOCATION"
                ),

                React.createElement(
                  "strong",
                  null,
                  trackedReport.location
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "citizen-tracking-ai"
                },

                React.createElement(
                  "span",
                  null,
                  "🤖"
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "strong",
                    null,
                    "AI-Assisted Review"
                  ),

                  React.createElement(
                    "p",
                    null,
                    trackedReport.aiStatus
                  ),

                  React.createElement(
                    "small",
                    null,
                    trackedReport.aiMessage
                  ),

                  React.createElement(
                    "small",
                    null,
                    "AI results are advisory and require human review."
                  )
                )
              ),

              trackedReport.evidencePreview &&
                React.createElement(
                  "div",
                  {
                    className:
                      "citizen-tracking-evidence"
                  },

                  React.createElement(
                    "strong",
                    null,
                    "📎 Submitted Evidence"
                  ),

                  trackedReport.evidenceType ===
                    "video"
                    ? React.createElement(
                        "video",
                        {
                          src:
                            trackedReport.evidencePreview,
                          controls: true
                        }
                      )
                    : React.createElement(
                        "img",
                        {
                          src:
                            trackedReport.evidencePreview,
                          alt:
                            "Submitted evidence"
                        }
                      )
                )
            ),

          !trackedReport &&
            React.createElement(
              "div",
              {
                className:
                  "citizen-tracking-empty"
              },

              React.createElement(
                "div",
                null,
                "🔎"
              ),

              React.createElement(
                "strong",
                null,
                "Enter your tracking ID"
              ),

              React.createElement(
                "p",
                null,
                "Your report ID is shown after a successful submission."
              )
            )
        )
      )
  );
}

export default PublicPortal;