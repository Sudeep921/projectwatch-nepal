import React, { useMemo, useState } from "react";

const PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    district: "Kathmandu",
    province: "Bagmati"
  },
  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    district: "Kaski",
    province: "Gandaki"
  },
  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    district: "Morang",
    province: "Koshi"
  },
  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    district: "Rupandehi",
    province: "Lumbini"
  },
  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    district: "Dhanusha",
    province: "Madhesh"
  },
  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    district: "Surkhet",
    province: "Karnali"
  },
  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    district: "Kanchanpur",
    province: "Sudurpashchim"
  },
  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    district: "Lalitpur",
    province: "Bagmati"
  }
];

const INITIAL_COMPLAINTS = [
  {
    id: "CP-2026-00981",
    project: "Kathmandu Ring Road Expansion",
    projectId: "PW-BAG-00124",
    citizen: "Anonymous Citizen",
    phone: "Not provided",
    date: "07 Sep 2026",
    time: "10:42 AM",
    category: "Progress",
    priority: "High",
    status: "Under Review",
    location: "Kalanki, Kathmandu",
    latitude: 27.6937,
    longitude: 85.2817,
    evidence: 3,
    description:
      "Construction progress at the reported section appears significantly lower than the publicly reported project progress.",
    aiFlag: true,
    aiMessage:
      "Potential discrepancy detected between reported progress and available field evidence.",
    assignedTo: "Infrastructure Monitoring Unit"
  },
  {
    id: "CP-2026-00980",
    project: "Pokhara Regional Bridge",
    projectId: "PW-GAN-00087",
    citizen: "Ramesh K.",
    phone: "98XXXXXXXX",
    date: "06 Sep 2026",
    time: "04:18 PM",
    category: "Construction Quality",
    priority: "Critical",
    status: "New",
    location: "Pokhara, Kaski",
    latitude: 28.2096,
    longitude: 83.9856,
    evidence: 2,
    description:
      "Visible cracks were noticed around a newly constructed section of the bridge approach.",
    aiFlag: true,
    aiMessage:
      "Visual evidence requires technical inspection. Human review is recommended.",
    assignedTo: "Not Assigned"
  },
  {
    id: "CP-2026-00979",
    project: "District Hospital Upgrade",
    projectId: "PW-KOS-00191",
    citizen: "Anonymous Citizen",
    phone: "Not provided",
    date: "05 Sep 2026",
    time: "12:27 PM",
    category: "Delay",
    priority: "Medium",
    status: "Resolved",
    location: "Morang, Koshi",
    latitude: 26.4525,
    longitude: 87.2718,
    evidence: 1,
    description:
      "Work at the hospital construction site appeared inactive for several days.",
    aiFlag: false,
    aiMessage: "",
    assignedTo: "District Monitoring Team"
  },
  {
    id: "CP-2026-00978",
    project: "Terai Irrigation Network",
    projectId: "PW-MAD-00214",
    citizen: "Sita Devi",
    phone: "97XXXXXXXX",
    date: "04 Sep 2026",
    time: "09:15 AM",
    category: "Site Condition",
    priority: "High",
    status: "Under Review",
    location: "Dhanusha, Madhesh",
    latitude: 26.7288,
    longitude: 85.925,
    evidence: 4,
    description:
      "Irrigation canal construction appears incomplete despite the project showing active progress.",
    aiFlag: true,
    aiMessage:
      "Potential progress discrepancy detected. Additional field verification recommended.",
    assignedTo: "Madhesh Field Verification Team"
  },
  {
    id: "CP-2026-00977",
    project: "Community School Reconstruction",
    projectId: "PW-BAG-00203",
    citizen: "Anonymous Citizen",
    phone: "Not provided",
    date: "03 Sep 2026",
    time: "02:51 PM",
    category: "Safety",
    priority: "Low",
    status: "New",
    location: "Lalitpur, Bagmati",
    latitude: 27.6588,
    longitude: 85.3247,
    evidence: 1,
    description:
      "Construction materials are being stored close to the public walking area.",
    aiFlag: false,
    aiMessage: "",
    assignedTo: "Not Assigned"
  },
  {
    id: "CP-2026-00976",
    project: "Mahakali Drinking Water Project",
    projectId: "PW-SUD-00111",
    citizen: "Anonymous Citizen",
    phone: "Not provided",
    date: "02 Sep 2026",
    time: "11:06 AM",
    category: "Service",
    priority: "Medium",
    status: "Resolved",
    location: "Kanchanpur, Sudurpashchim",
    latitude: 28.8372,
    longitude: 80.3213,
    evidence: 2,
    description:
      "Residents reported that the expected water connection has not yet reached the reported area.",
    aiFlag: false,
    aiMessage: "",
    assignedTo: "Water Supply Monitoring Team"
  }
];

function Complaints() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);

  const [form, setForm] = useState({
    projectId: "",
    category: "",
    priority: "Medium",
    citizen: "",
    phone: "",
    location: "",
    description: "",
    latitude: "",
    longitude: ""
  });

  const [evidence, setEvidence] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const selectedProject = useMemo(function () {
    return PROJECTS.find(function (project) {
      return project.id === form.projectId;
    });
  }, [form.projectId]);

  const summary = useMemo(function () {
    return {
      total: complaints.length,
      newCount: complaints.filter(function (item) {
        return item.status === "New";
      }).length,
      review: complaints.filter(function (item) {
        return item.status === "Under Review";
      }).length,
      resolved: complaints.filter(function (item) {
        return item.status === "Resolved";
      }).length,
      critical: complaints.filter(function (item) {
        return item.priority === "Critical";
      }).length,
      aiFlags: complaints.filter(function (item) {
        return item.aiFlag;
      }).length
    };
  }, [complaints]);

  const filteredComplaints = useMemo(function () {
    return complaints.filter(function (item) {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(searchText) ||
        item.project.toLowerCase().includes(searchText) ||
        item.location.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  function updateForm(field, value) {
    setForm(function (previous) {
      return {
        ...previous,
        [field]: value
      };
    });
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        setForm(function (previous) {
          return {
            ...previous,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          };
        });

        setLocationLoading(false);
      },
      function () {
        setLocationLoading(false);
        alert(
          "Unable to get your location. Please allow location permission and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  function handleEvidence(event) {
    const files = Array.from(event.target.files || []);

    setEvidence(function (previous) {
      return [...previous, ...files];
    });
  }

  function removeEvidence(index) {
    setEvidence(function (previous) {
      return previous.filter(function (_, fileIndex) {
        return fileIndex !== index;
      });
    });
  }

  function resetForm() {
    setForm({
      projectId: "",
      category: "",
      priority: "Medium",
      citizen: "",
      phone: "",
      location: "",
      description: "",
      latitude: "",
      longitude: ""
    });

    setEvidence([]);
  }

  function submitComplaint(event) {
    event.preventDefault();

    if (!form.projectId) {
      alert("Please select a project.");
      return;
    }

    if (!form.category) {
      alert("Please select a complaint category.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please describe the complaint.");
      return;
    }

    if (!form.location.trim()) {
      alert("Please enter the complaint location.");
      return;
    }

    const project = PROJECTS.find(function (item) {
      return item.id === form.projectId;
    });

    const newComplaint = {
      id:
        "CP-2026-" +
        String(982 + complaints.length).padStart(5, "0"),
      project: project ? project.name : "Unknown Project",
      projectId: form.projectId,
      citizen: form.citizen.trim() || "Anonymous Citizen",
      phone: form.phone.trim() || "Not provided",
      date: "07 Sep 2026",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      category: form.category,
      priority: form.priority,
      status: "New",
      location: form.location.trim(),
      latitude: form.latitude || "Not captured",
      longitude: form.longitude || "Not captured",
      evidence: evidence.length,
      description: form.description.trim(),
      aiFlag: false,
      aiMessage: "",
      assignedTo: "Not Assigned"
    };

    setComplaints(function (previous) {
      return [newComplaint, ...previous];
    });

    resetForm();
    setSubmitted(true);

    setTimeout(function () {
      setSubmitted(false);
    }, 3500);
  }

  function updateComplaintStatus(id, newStatus) {
    setComplaints(function (previous) {
      return previous.map(function (item) {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          status: newStatus
        };
      });
    });

    setSelectedComplaint(function (previous) {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        status: newStatus
      };
    });
  }

  function openMap(complaint) {
    if (
      complaint.latitude === "Not captured" ||
      complaint.longitude === "Not captured"
    ) {
      alert("GPS location is not available for this complaint.");
      return;
    }

    const url =
      "https://www.google.com/maps?q=" +
      complaint.latitude +
      "," +
      complaint.longitude;

    window.open(url, "_blank");
  }

  function getStatusClass(status) {
    if (status === "New") return "new";
    if (status === "Under Review") return "review";
    if (status === "Resolved") return "resolved";

    return "";
  }

  function getPriorityClass(priority) {
    if (priority === "Low") return "low";
    if (priority === "Medium") return "medium";
    if (priority === "High") return "high";
    if (priority === "Critical") return "critical";

    return "";
  }

  return React.createElement(
    "main",
    { className: "complaints-page" },

    React.createElement(
      "div",
      { className: "page-header complaints-page-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "div",
          { className: "breadcrumb" },
          "ProjectWatch Nepal",
          React.createElement("span", null, "/"),
          " Citizen Complaints"
        ),

        React.createElement(
          "h1",
          null,
          "Citizen Complaints"
        ),

        React.createElement(
          "p",
          null,
          "Receive, verify and monitor public complaints related to government projects."
        )
      )
    ),

    submitted &&
      React.createElement(
        "div",
        { className: "complaint-success" },

        React.createElement(
          "div",
          { className: "complaint-success-icon" },
          "✓"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            "Complaint submitted successfully"
          ),

          React.createElement(
            "span",
            null,
            "The complaint has been added to the monitoring queue."
          )
        )
      ),

    React.createElement(
      "section",
      { className: "complaint-summary-grid" },

      React.createElement(
        "div",
        { className: "complaint-summary-card" },
        React.createElement("span", null, "Total Complaints"),
        React.createElement("strong", null, summary.total),
        React.createElement("small", null, "All submitted complaints")
      ),

      React.createElement(
        "div",
        { className: "complaint-summary-card new-card" },
        React.createElement("span", null, "New"),
        React.createElement("strong", null, summary.newCount),
        React.createElement("small", null, "Awaiting review")
      ),

      React.createElement(
        "div",
        { className: "complaint-summary-card review-card" },
        React.createElement("span", null, "Under Review"),
        React.createElement("strong", null, summary.review),
        React.createElement("small", null, "Currently being verified")
      ),

      React.createElement(
        "div",
        { className: "complaint-summary-card resolved-card" },
        React.createElement("span", null, "Resolved"),
        React.createElement("strong", null, summary.resolved),
        React.createElement("small", null, "Closed complaints")
      ),

      React.createElement(
        "div",
        { className: "complaint-summary-card critical-card" },
        React.createElement("span", null, "Critical"),
        React.createElement("strong", null, summary.critical),
        React.createElement("small", null, "Requires attention")
      ),

      React.createElement(
        "div",
        { className: "complaint-summary-card ai-card" },
        React.createElement("span", null, "AI Flags"),
        React.createElement("strong", null, summary.aiFlags),
        React.createElement("small", null, "Potential discrepancies")
      )
    ),

    React.createElement(
      "section",
      { className: "complaint-form-card" },

      React.createElement(
        "div",
        { className: "complaint-section-header" },

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            { className: "section-eyebrow" },
            "PUBLIC REPORTING"
          ),

          React.createElement(
            "h2",
            null,
            "Submit Citizen Complaint"
          ),

          React.createElement(
            "p",
            null,
            "Report a suspected issue, delay, quality concern or other project-related problem."
          )
        ),

        React.createElement(
          "span",
          { className: "complaint-form-badge" },
          "Citizen Portal"
        )
      ),

      React.createElement(
        "form",
        {
          className: "complaint-form",
          onSubmit: submitComplaint
        },

        React.createElement(
          "div",
          { className: "complaint-form-grid" },

          React.createElement(
            "div",
            { className: "complaint-field full-field" },

            React.createElement(
              "label",
              null,
              "Government Project ",
              React.createElement("b", null, "*")
            ),

            React.createElement(
              "select",
              {
                value: form.projectId,
                onChange: function (event) {
                  updateForm("projectId", event.target.value);
                }
              },

              React.createElement(
                "option",
                { value: "" },
                "Select project"
              ),

              PROJECTS.map(function (project) {
                return React.createElement(
                  "option",
                  {
                    key: project.id,
                    value: project.id
                  },
                  project.name +
                    " — " +
                    project.district +
                    ", " +
                    project.province
                );
              })
            ),

            selectedProject &&
              React.createElement(
                "small",
                { className: "field-helper" },
                selectedProject.id +
                  " • " +
                  selectedProject.district +
                  ", " +
                  selectedProject.province
              )
          ),

          React.createElement(
            "div",
            { className: "complaint-field" },

            React.createElement(
              "label",
              null,
              "Complaint Category ",
              React.createElement("b", null, "*")
            ),

            React.createElement(
              "select",
              {
                value: form.category,
                onChange: function (event) {
                  updateForm("category", event.target.value);
                }
              },

              React.createElement(
                "option",
                { value: "" },
                "Select category"
              ),

              React.createElement(
                "option",
                { value: "Progress" },
                "Progress / Work Status"
              ),

              React.createElement(
                "option",
                { value: "Delay" },
                "Project Delay"
              ),

              React.createElement(
                "option",
                { value: "Construction Quality" },
                "Construction Quality"
              ),

              React.createElement(
                "option",
                { value: "Site Condition" },
                "Site Condition"
              ),

              React.createElement(
                "option",
                { value: "Safety" },
                "Public Safety"
              ),

              React.createElement(
                "option",
                { value: "Service" },
                "Service / Access"
              ),

              React.createElement(
                "option",
                { value: "Other" },
                "Other"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "complaint-field" },

            React.createElement(
              "label",
              null,
              "Priority"
            ),

            React.createElement(
              "div",
              { className: "complaint-priority-options" },

              ["Low", "Medium", "High", "Critical"].map(
                function (priority) {
                  return React.createElement(
                    "button",
                    {
                      key: priority,
                      type: "button",
                      className:
                        "complaint-priority-option " +
                        getPriorityClass(priority) +
                        (form.priority === priority ? " active" : ""),
                      onClick: function () {
                        updateForm("priority", priority);
                      }
                    },
                    priority
                  );
                }
              )
            )
          ),

          React.createElement(
            "div",
            { className: "complaint-field" },

            React.createElement(
              "label",
              null,
              "Citizen Name"
            ),

            React.createElement("input", {
              type: "text",
              placeholder: "Optional / Anonymous",
              value: form.citizen,
              onChange: function (event) {
                updateForm("citizen", event.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "complaint-field" },

            React.createElement(
              "label",
              null,
              "Phone Number"
            ),

            React.createElement("input", {
              type: "text",
              placeholder: "Optional",
              value: form.phone,
              onChange: function (event) {
                updateForm("phone", event.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "complaint-field full-field" },

            React.createElement(
              "label",
              null,
              "Complaint Location ",
              React.createElement("b", null, "*")
            ),

            React.createElement("input", {
              type: "text",
              placeholder: "e.g. Kalanki, Kathmandu",
              value: form.location,
              onChange: function (event) {
                updateForm("location", event.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "complaint-gps-section full-field" },

            React.createElement(
              "div",
              { className: "complaint-gps-header" },

              React.createElement(
                "div",
                null,

                React.createElement(
                  "strong",
                  null,
                  "📍 GPS Location"
                ),

                React.createElement(
                  "span",
                  null,
                  "Capture the exact complaint location for verification."
                )
              ),

              React.createElement(
                "button",
                {
                  type: "button",
                  className: "complaint-gps-button",
                  onClick: captureLocation,
                  disabled: locationLoading
                },
                locationLoading
                  ? "Getting location..."
                  : "Get My Location"
              )
            ),

            React.createElement(
              "div",
              { className: "complaint-gps-values" },

              React.createElement(
                "div",
                null,
                React.createElement("span", null, "Latitude"),
                React.createElement(
                  "strong",
                  null,
                  form.latitude || "Not captured"
                )
              ),

              React.createElement(
                "div",
                null,
                React.createElement("span", null, "Longitude"),
                React.createElement(
                  "strong",
                  null,
                  form.longitude || "Not captured"
                )
              )
            )
          ),

          React.createElement(
            "div",
            { className: "complaint-field full-field" },

            React.createElement(
              "label",
              null,
              "Complaint Description ",
              React.createElement("b", null, "*")
            ),

            React.createElement("textarea", {
              rows: 6,
              placeholder:
                "Describe what you observed, where it happened and why you believe it should be reviewed...",
              value: form.description,
              onChange: function (event) {
                updateForm("description", event.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            {
              className:
                "complaint-evidence-upload full-field"
            },

            React.createElement(
              "label",
              null,
              "Photo / Video Evidence"
            ),

            React.createElement(
              "label",
              { className: "complaint-upload-box" },

              React.createElement(
                "div",
                { className: "complaint-upload-icon" },
                "📷"
              ),

              React.createElement(
                "strong",
                null,
                "Upload supporting evidence"
              ),

              React.createElement(
                "span",
                null,
                "JPG, PNG, MP4 or other supported media"
              ),

              React.createElement("input", {
                type: "file",
                accept: "image/*,video/*",
                multiple: true,
                onChange: handleEvidence
              })
            ),

            evidence.length > 0 &&
              React.createElement(
                "div",
                { className: "complaint-evidence-list" },

                evidence.map(function (file, index) {
                  return React.createElement(
                    "div",
                    {
                      className: "complaint-evidence-item",
                      key:
                        file.name +
                        "-" +
                        index
                    },

                    React.createElement(
                      "div",
                      null,

                      React.createElement(
                        "span",
                        { className: "complaint-file-icon" },
                        file.type.startsWith("video")
                          ? "🎥"
                          : "🖼️"
                      ),

                      React.createElement(
                        "div",
                        null,

                        React.createElement(
                          "strong",
                          null,
                          file.name
                        ),

                        React.createElement(
                          "small",
                          null,
                          (
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2) +
                            " MB"
                        )
                      )
                    ),

                    React.createElement(
                      "button",
                      {
                        type: "button",
                        onClick: function () {
                          removeEvidence(index);
                        }
                      },
                      "×"
                    )
                  );
                })
              )
          )
        ),

        React.createElement(
          "div",
          { className: "complaint-form-footer" },

          React.createElement(
            "span",
            null,
            "Your complaint will be reviewed before any official action is taken."
          ),

          React.createElement(
            "button",
            {
              type: "submit",
              className: "complaint-submit-button"
            },
            "Submit Complaint"
          )
        )
      )
    ),

    React.createElement(
      "section",
      { className: "complaint-history-section" },

      React.createElement(
        "div",
        { className: "complaint-history-header" },

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            { className: "section-eyebrow" },
            "MONITORING QUEUE"
          ),

          React.createElement(
            "h2",
            null,
            "Complaint Management"
          ),

          React.createElement(
            "p",
            null,
            "Review, verify and track citizen complaints."
          )
        ),

        React.createElement(
          "div",
          { className: "complaint-filters" },

          React.createElement("input", {
            type: "text",
            placeholder: "Search complaints...",
            value: search,
            onChange: function (event) {
              setSearch(event.target.value);
            }
          }),

          React.createElement(
            "select",
            {
              value: statusFilter,
              onChange: function (event) {
                setStatusFilter(event.target.value);
              }
            },

            React.createElement(
              "option",
              { value: "All" },
              "All Status"
            ),

            React.createElement(
              "option",
              { value: "New" },
              "New"
            ),

            React.createElement(
              "option",
              { value: "Under Review" },
              "Under Review"
            ),

            React.createElement(
              "option",
              { value: "Resolved" },
              "Resolved"
            )
          ),

          React.createElement(
            "select",
            {
              value: priorityFilter,
              onChange: function (event) {
                setPriorityFilter(event.target.value);
              }
            },

            React.createElement(
              "option",
              { value: "All" },
              "All Priority"
            ),

            React.createElement(
              "option",
              { value: "Low" },
              "Low"
            ),

            React.createElement(
              "option",
              { value: "Medium" },
              "Medium"
            ),

            React.createElement(
              "option",
              { value: "High" },
              "High"
            ),

            React.createElement(
              "option",
              { value: "Critical" },
              "Critical"
            )
          )
        )
      ),

      React.createElement(
        "div",
        { className: "complaint-table-wrap" },

        React.createElement(
          "table",
          { className: "complaint-table" },

          React.createElement(
            "thead",
            null,

            React.createElement(
              "tr",
              null,

              React.createElement("th", null, "COMPLAINT"),

              React.createElement("th", null, "PROJECT"),

              React.createElement("th", null, "CATEGORY"),

              React.createElement("th", null, "PRIORITY"),

              React.createElement("th", null, "STATUS"),

              React.createElement("th", null, "EVIDENCE"),

              React.createElement("th", null, "AI CHECK"),

              React.createElement("th", null, "SUBMITTED"),

              React.createElement("th", null, "ACTION")
            )
          ),

          React.createElement(
            "tbody",
            null,

            filteredComplaints.length === 0
              ? React.createElement(
                  "tr",
                  null,

                  React.createElement(
                    "td",
                    {
                      colSpan: 9,
                      className: "complaint-empty"
                    },

                    React.createElement(
                      "div",
                      null,
                      "⌕"
                    ),

                    React.createElement(
                      "strong",
                      null,
                      "No complaints found"
                    ),

                    React.createElement(
                      "span",
                      null,
                      "Try changing your search or filters."
                    )
                  )
                )
              : filteredComplaints.map(function (complaint) {
                  return React.createElement(
                    "tr",
                    { key: complaint.id },

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "div",
                        { className: "complaint-id-cell" },

                        React.createElement(
                          "strong",
                          null,
                          complaint.id
                        ),

                        React.createElement(
                          "span",
                          null,
                          complaint.location
                        )
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "div",
                        { className: "complaint-project-cell" },

                        React.createElement(
                          "strong",
                          null,
                          complaint.project
                        ),

                        React.createElement(
                          "span",
                          null,
                          complaint.projectId
                        )
                      )
                    ),

                    React.createElement(
                      "td",
                      null,
                      complaint.category
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "span",
                        {
                          className:
                            "complaint-priority " +
                            getPriorityClass(
                              complaint.priority
                            )
                        },
                        complaint.priority
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "span",
                        {
                          className:
                            "complaint-status " +
                            getStatusClass(
                              complaint.status
                            )
                        },

                        React.createElement(
                          "i",
                          null
                        ),

                        complaint.status
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "span",
                        {
                          className:
                            "complaint-evidence-count"
                        },

                        "📎 " +
                          complaint.evidence
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      complaint.aiFlag
                        ? React.createElement(
                            "span",
                            {
                              className:
                                "complaint-ai-flag"
                            },
                            "⚠ AI Flag"
                          )
                        : React.createElement(
                            "span",
                            {
                              className:
                                "complaint-ai-clear"
                            },
                            "✓ Clear"
                          )
                    ),

                    React.createElement(
                      "td",
                      {
                        className:
                          "complaint-submitted-cell"
                      },

                      complaint.date,

                      React.createElement(
                        "small",
                        null,
                        complaint.time
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "button",
                        {
                          className:
                            "complaint-view-button",
                          onClick: function () {
                            setSelectedComplaint(
                              complaint
                            );
                          }
                        },
                        "View"
                      )
                    )
                  );
                })
          )
        )
      )
    ),

    selectedComplaint &&
      React.createElement(
        "div",
        {
          className:
            "complaint-modal-overlay",
          onClick: function () {
            setSelectedComplaint(null);
          }
        },

        React.createElement(
          "div",
          {
            className: "complaint-modal",
            onClick: function (event) {
              event.stopPropagation();
            }
          },

          React.createElement(
            "div",
            { className: "complaint-modal-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "span",
                null,
                selectedComplaint.id
              ),

              React.createElement(
                "h2",
                null,
                selectedComplaint.project
              )
            ),

            React.createElement(
              "button",
              {
                onClick: function () {
                  setSelectedComplaint(null);
                }
              },
              "×"
            )
          ),

          React.createElement(
            "div",
            { className: "complaint-modal-body" },

            React.createElement(
              "div",
              { className: "complaint-modal-status-row" },

              React.createElement(
                "span",
                {
                  className:
                    "complaint-status " +
                    getStatusClass(
                      selectedComplaint.status
                    )
                },

                React.createElement("i", null),

                selectedComplaint.status
              ),

              React.createElement(
                "span",
                {
                  className:
                    "complaint-priority " +
                    getPriorityClass(
                      selectedComplaint.priority
                    )
                },
                selectedComplaint.priority
              )
            ),

            React.createElement(
              "div",
              { className: "complaint-detail-grid" },

              React.createElement(
                "div",
                null,
                React.createElement(
                  "span",
                  null,
                  "Category"
                ),
                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.category
                )
              ),

              React.createElement(
                "div",
                null,
                React.createElement(
                  "span",
                  null,
                  "Citizen"
                ),
                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.citizen
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
                  selectedComplaint.location
                )
              ),

              React.createElement(
                "div",
                null,
                React.createElement(
                  "span",
                  null,
                  "Evidence"
                ),
                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.evidence +
                    " file(s)"
                )
              ),

              React.createElement(
                "div",
                null,
                React.createElement(
                  "span",
                  null,
                  "Assigned To"
                ),
                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.assignedTo
                )
              ),

              React.createElement(
                "div",
                null,
                React.createElement(
                  "span",
                  null,
                  "Submitted"
                ),
                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.date +
                    " • " +
                    selectedComplaint.time
                )
              )
            ),

            React.createElement(
              "div",
              { className: "complaint-description-box" },

              React.createElement(
                "span",
                null,
                "Citizen Description"
              ),

              React.createElement(
                "p",
                null,
                selectedComplaint.description
              )
            ),

            selectedComplaint.aiFlag &&
              React.createElement(
                "div",
                { className: "complaint-ai-warning" },

                React.createElement(
                  "div",
                  { className: "complaint-ai-warning-icon" },
                  "⚠"
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "strong",
                    null,
                    "Potential discrepancy detected"
                  ),

                  React.createElement(
                    "p",
                    null,
                    selectedComplaint.aiMessage
                  ),

                  React.createElement(
                    "small",
                    null,
                    "AI output is an indicator only. Human verification is required."
                  )
                )
              ),

            !selectedComplaint.aiFlag &&
              React.createElement(
                "div",
                { className: "complaint-ai-success" },

                React.createElement(
                  "div",
                  null,
                  "✓"
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "strong",
                    null,
                    "No significant AI discrepancy detected"
                  ),

                  React.createElement(
                    "p",
                    null,
                    "Available complaint information does not currently indicate a significant discrepancy."
                  )
                )
              ),

            React.createElement(
              "div",
              { className: "complaint-coordinates" },

              React.createElement(
                "div",
                null,

                React.createElement(
                  "span",
                  null,
                  "Latitude"
                ),

                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.latitude
                )
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "span",
                  null,
                  "Longitude"
                ),

                React.createElement(
                  "strong",
                  null,
                  selectedComplaint.longitude
                )
              )
            )
          ),

          React.createElement(
            "div",
            { className: "complaint-modal-actions" },

            React.createElement(
              "button",
              {
                className:
                  "complaint-modal-secondary",
                onClick: function () {
                  openMap(selectedComplaint);
                }
              },
              "📍 View Location"
            ),

            selectedComplaint.status !==
              "Under Review" &&
              React.createElement(
                "button",
                {
                  className:
                    "complaint-modal-primary",
                  onClick: function () {
                    updateComplaintStatus(
                      selectedComplaint.id,
                      "Under Review"
                    );
                  }
                },
                "Start Review"
              ),

            selectedComplaint.status !==
              "Resolved" &&
              React.createElement(
                "button",
                {
                  className:
                    "complaint-modal-success",
                  onClick: function () {
                    updateComplaintStatus(
                      selectedComplaint.id,
                      "Resolved"
                    );
                  }
                },
                "Mark Resolved"
              )
          )
        )
      )
  );
}

export default Complaints;