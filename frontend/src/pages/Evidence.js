import React, { useMemo, useState } from "react";

const EVIDENCE_DATA = [
  {
    id: "EV-2026-00481",
    project: "Kathmandu Ring Road Expansion",
    projectId: "PW-BAG-00124",
    type: "Photo",
    officer: "Rajesh Thapa",
    date: "08 Sep 2026, 10:42 AM",
    location: "Kalanki, Kathmandu",
    gps: "27.6939, 85.2815",
    progress: 42,
    verification: "Flagged",
    aiMessage: "Potential discrepancy detected",
    files: 4
  },
  {
    id: "EV-2026-00480",
    project: "Pokhara Regional Bridge",
    projectId: "PW-GAN-00087",
    type: "Video",
    officer: "Suman Gurung",
    date: "08 Sep 2026, 09:18 AM",
    location: "Pokhara, Kaski",
    gps: "28.2096, 83.9856",
    progress: 38,
    verification: "Verified",
    aiMessage: "Evidence appears consistent",
    files: 2
  },
  {
    id: "EV-2026-00479",
    project: "District Hospital Upgrade",
    projectId: "PW-KOS-00191",
    type: "Photo",
    officer: "Anil Rai",
    date: "07 Sep 2026, 03:35 PM",
    location: "Morang, Koshi",
    gps: "26.4525, 87.2718",
    progress: 56,
    verification: "Verified",
    aiMessage: "Evidence appears consistent",
    files: 6
  },
  {
    id: "EV-2026-00478",
    project: "Terai Irrigation Network",
    projectId: "PW-MAD-00214",
    type: "Photo",
    officer: "Bikash Yadav",
    date: "07 Sep 2026, 11:06 AM",
    location: "Dhanusha, Madhesh",
    gps: "26.7288, 85.9263",
    progress: 29,
    verification: "Pending",
    aiMessage: "AI verification in progress",
    files: 3
  },
  {
    id: "EV-2026-00477",
    project: "Community School Reconstruction",
    projectId: "PW-BAG-00203",
    type: "Video",
    officer: "Mina Shrestha",
    date: "06 Sep 2026, 01:22 PM",
    location: "Lalitpur, Bagmati",
    gps: "27.6588, 85.3247",
    progress: 81,
    verification: "Verified",
    aiMessage: "Evidence appears consistent",
    files: 1
  },
  {
    id: "EV-2026-00476",
    project: "Mahakali Drinking Water Project",
    projectId: "PW-SUD-00111",
    type: "Photo",
    officer: "Deepak Joshi",
    date: "06 Sep 2026, 09:47 AM",
    location: "Kanchanpur, Sudurpashchim",
    gps: "28.8372, 80.3213",
    progress: 63,
    verification: "Flagged",
    aiMessage: "Location verification recommended",
    files: 5
  }
];

function Evidence() {
  const [evidence, setEvidence] = useState(EVIDENCE_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filteredEvidence = useMemo(function () {
    return evidence.filter(function (item) {
      const matchesSearch =
        item.project.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.officer.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.verification === filter;

      return matchesSearch && matchesFilter;
    });
  }, [evidence, search, filter]);

  const total = evidence.length;
  const verified = evidence.filter(
    item => item.verification === "Verified"
  ).length;
  const flagged = evidence.filter(
    item => item.verification === "Flagged"
  ).length;
  const pending = evidence.filter(
    item => item.verification === "Pending"
  ).length;

  function verificationClass(status) {
    return status.toLowerCase().replace(/\s+/g, "-");
  }

  function openMap(item) {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(item.gps),
      "_blank"
    );
  }

  function markVerified(id) {
    setEvidence(function (current) {
      return current.map(function (item) {
        if (item.id !== id) return item;

        return {
          ...item,
          verification: "Verified",
          aiMessage: "Human review completed — evidence verified"
        };
      });
    });

    setSelected(function (current) {
      if (!current || current.id !== id) return current;

      return {
        ...current,
        verification: "Verified",
        aiMessage: "Human review completed — evidence verified"
      };
    });
  }

  return React.createElement(
    "main",
    { className: "evidence-page" },

    React.createElement(
      "div",
      { className: "evidence-page-header" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "breadcrumb" },
          "ProjectWatch Nepal",
          React.createElement("span", null, "/"),
          " Evidence"
        ),
        React.createElement("h1", null, "Project Evidence"),
        React.createElement(
          "p",
          null,
          "Review field photos, videos, GPS records and AI verification results."
        )
      )
    ),

    React.createElement(
      "div",
      { className: "evidence-summary-grid" },

      React.createElement(
        "div",
        { className: "evidence-summary-card" },
        React.createElement("span", null, "📁"),
        React.createElement(
          "div",
          null,
          React.createElement("strong", null, total),
          React.createElement("small", null, "Total Evidence")
        )
      ),

      React.createElement(
        "div",
        { className: "evidence-summary-card verified-card" },
        React.createElement("span", null, "✓"),
        React.createElement(
          "div",
          null,
          React.createElement("strong", null, verified),
          React.createElement("small", null, "Verified")
        )
      ),

      React.createElement(
        "div",
        { className: "evidence-summary-card flagged-card" },
        React.createElement("span", null, "⚠"),
        React.createElement(
          "div",
          null,
          React.createElement("strong", null, flagged),
          React.createElement("small", null, "AI Flagged")
        )
      ),

      React.createElement(
        "div",
        { className: "evidence-summary-card pending-card" },
        React.createElement("span", null, "◷"),
        React.createElement(
          "div",
          null,
          React.createElement("strong", null, pending),
          React.createElement("small", null, "Pending Review")
        )
      )
    ),

    React.createElement(
      "section",
      { className: "evidence-history-section" },

      React.createElement(
        "div",
        { className: "evidence-history-header" },
        React.createElement(
          "div",
          null,
          React.createElement("h2", null, "Evidence Management"),
          React.createElement(
            "p",
            null,
            filteredEvidence.length + " evidence records found"
          )
        ),

        React.createElement(
          "div",
          { className: "evidence-filters" },

          React.createElement("input", {
            type: "text",
            placeholder: "Search project, officer or evidence ID...",
            value: search,
            onChange: function (e) {
              setSearch(e.target.value);
            }
          }),

          React.createElement(
            "select",
            {
              value: filter,
              onChange: function (e) {
                setFilter(e.target.value);
              }
            },
            React.createElement("option", { value: "All" }, "All Status"),
            React.createElement("option", { value: "Verified" }, "Verified"),
            React.createElement("option", { value: "Flagged" }, "Flagged"),
            React.createElement("option", { value: "Pending" }, "Pending")
          )
        )
      ),

      React.createElement(
        "div",
        { className: "evidence-table-wrap" },

        React.createElement(
          "table",
          { className: "evidence-table" },

          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "EVIDENCE"),
              React.createElement("th", null, "PROJECT"),
              React.createElement("th", null, "FIELD OFFICER"),
              React.createElement("th", null, "LOCATION"),
              React.createElement("th", null, "PROGRESS"),
              React.createElement("th", null, "VERIFICATION"),
              React.createElement("th", null, "DATE"),
              React.createElement("th", null, "ACTION")
            )
          ),

          React.createElement(
            "tbody",
            null,

            filteredEvidence.map(function (item) {
              return React.createElement(
                "tr",
                { key: item.id },

                React.createElement(
                  "td",
                  { className: "evidence-id-cell" },
                  React.createElement(
                    "strong",
                    null,
                    item.type === "Video" ? "🎥" : "📸",
                    " ",
                    item.id
                  ),
                  React.createElement(
                    "small",
                    null,
                    item.files + " file" + (item.files > 1 ? "s" : "")
                  )
                ),

                React.createElement(
                  "td",
                  { className: "evidence-project-cell" },
                  React.createElement("strong", null, item.project),
                  React.createElement("small", null, item.projectId)
                ),

                React.createElement("td", null, item.officer),

                React.createElement(
                  "td",
                  null,
                  React.createElement("strong", null, item.location),
                  React.createElement("small", null, item.gps)
                ),

                React.createElement(
                  "td",
                  { className: "evidence-progress-cell" },
                  React.createElement(
                    "div",
                    { className: "evidence-progress-label" },
                    item.progress + "%"
                  ),
                  React.createElement(
                    "div",
                    { className: "evidence-progress-bar" },
                    React.createElement("span", {
                      style: { width: item.progress + "%" }
                    })
                  )
                ),

                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "span",
                    {
                      className:
                        "evidence-verification " +
                        verificationClass(item.verification)
                    },
                    item.verification
                  )
                ),

                React.createElement(
                  "td",
                  { className: "evidence-date-cell" },
                  item.date
                ),

                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "button",
                    {
                      className: "evidence-view-button",
                      onClick: function () {
                        setSelected(item);
                      }
                    },
                    "View"
                  )
                )
              );
            })
          )
        ),

        filteredEvidence.length === 0
          ? React.createElement(
              "div",
              { className: "evidence-empty" },
              React.createElement("div", null, "🔎"),
              React.createElement("strong", null, "No evidence found"),
              React.createElement(
                "p",
                null,
                "Try changing your search or filter."
              )
            )
          : null
      )
    ),

    selected
      ? React.createElement(
          "div",
          {
            className: "evidence-modal-overlay",
            onClick: function () {
              setSelected(null);
            }
          },

          React.createElement(
            "div",
            {
              className: "evidence-modal",
              onClick: function (e) {
                e.stopPropagation();
              }
            },

            React.createElement(
              "div",
              { className: "evidence-modal-header" },
              React.createElement(
                "div",
                null,
                React.createElement("span", null, selected.type === "Video" ? "🎥" : "📸"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("h2", null, selected.id),
                  React.createElement("p", null, selected.project)
                )
              ),
              React.createElement(
                "button",
                {
                  onClick: function () {
                    setSelected(null);
                  }
                },
                "×"
              )
            ),

            React.createElement(
              "div",
              { className: "evidence-modal-body" },

              React.createElement(
                "div",
                { className: "evidence-preview" },
                React.createElement(
                  "div",
                  { className: "evidence-preview-icon" },
                  selected.type === "Video" ? "🎥" : "📸"
                ),
                React.createElement(
                  "strong",
                  null,
                  selected.type + " Evidence"
                ),
                React.createElement(
                  "small",
                  null,
                  selected.files + " uploaded file" +
                    (selected.files > 1 ? "s" : "")
                )
              ),

              React.createElement(
                "div",
                { className: "evidence-detail-grid" },

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Field Officer"),
                  React.createElement("strong", null, selected.officer)
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Submitted"),
                  React.createElement("strong", null, selected.date)
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Location"),
                  React.createElement("strong", null, selected.location)
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "GPS Coordinates"),
                  React.createElement("strong", null, selected.gps)
                )
              ),

              React.createElement(
                "div",
                {
                  className:
                    "evidence-ai-box " +
                    (selected.verification === "Flagged"
                      ? "warning"
                      : selected.verification === "Verified"
                      ? "success"
                      : "pending")
                },
                React.createElement(
                  "div",
                  { className: "evidence-ai-icon" },
                  selected.verification === "Flagged"
                    ? "⚠"
                    : selected.verification === "Verified"
                    ? "✓"
                    : "◷"
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "strong",
                    null,
                    selected.aiMessage
                  ),
                  React.createElement(
                    "p",
                    null,
                    selected.verification === "Flagged"
                      ? "Human review is recommended before taking further action."
                      : selected.verification === "Verified"
                      ? "Evidence has passed human review."
                      : "Automated verification has not been completed yet."
                  )
                )
              ),

              React.createElement(
                "div",
                { className: "evidence-modal-actions" },

                React.createElement(
                  "button",
                  {
                    className: "evidence-modal-secondary",
                    onClick: function () {
                      openMap(selected);
                    }
                  },
                  "📍 Open Map"
                ),

                selected.verification !== "Verified"
                  ? React.createElement(
                      "button",
                      {
                        className: "evidence-modal-primary",
                        onClick: function () {
                          markVerified(selected.id);
                        }
                      },
                      "✓ Mark as Verified"
                    )
                  : null
              )
            )
          )
        )
      : null
  );
}

export default Evidence;