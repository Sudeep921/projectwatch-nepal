import React, {
  useState
} from "react";

const PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    district: "Kathmandu",
    province: "Bagmati",
    progress: 42,
    status: "Critical"
  },
  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    district: "Kaski",
    province: "Gandaki",
    progress: 38,
    status: "Delayed"
  },
  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    district: "Morang",
    province: "Koshi",
    progress: 56,
    status: "Active"
  },
  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    district: "Rupandehi",
    province: "Lumbini",
    progress: 74,
    status: "Active"
  },
  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    district: "Dhanusha",
    province: "Madhesh",
    progress: 29,
    status: "Delayed"
  },
  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    district: "Surkhet",
    province: "Karnali",
    progress: 91,
    status: "Completed"
  },
  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    district: "Kanchanpur",
    province: "Sudurpashchim",
    progress: 63,
    status: "Active"
  },
  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    district: "Lalitpur",
    province: "Bagmati",
    progress: 81,
    status: "Active"
  }
];

function FieldReports() {
  const [
    selectedProject,
    setSelectedProject
  ] = useState("");

  const [
    progress,
    setProgress
  ] = useState("");

  const [
    condition,
    setCondition
  ] = useState("Good");

  const [
    remarks,
    setRemarks
  ] = useState("");

  const [
    evidence,
    setEvidence
  ] = useState([]);

  const [
    latitude,
    setLatitude
  ] = useState("");

  const [
    longitude,
    setLongitude
  ] = useState("");

  const [
    locationLoading,
    setLocationLoading
  ] = useState(false);

  const [
    submitted,
    setSubmitted
  ] = useState(false);


  function captureLocation() {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLatitude(
          position.coords.latitude.toFixed(6)
        );

        setLongitude(
          position.coords.longitude.toFixed(6)
        );

        setLocationLoading(false);
      },

      function () {
        alert(
          "Unable to get location. Please allow location access."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  function handleEvidenceChange(event) {
    const files = Array.from(
      event.target.files || []
    );

    setEvidence(files);
  }


  function submitReport(event) {
    event.preventDefault();

    if (!selectedProject) {
      alert(
        "Please select a project."
      );

      return;
    }

    if (!progress) {
      alert(
        "Please enter actual progress."
      );

      return;
    }

    if (!latitude || !longitude) {
      alert(
        "Please capture GPS location."
      );

      return;
    }

    setSubmitted(true);

    setTimeout(
      function () {
        setSubmitted(false);
      },
      4000
    );
  }


  return React.createElement(
    "main",
    {
      className:
        "page-content field-reports-page"
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

          " Field Reports"
        ),

        React.createElement(
          "h1",
          null,
          "Field Reports"
        ),

        React.createElement(
          "p",
          null,
          "Submit real-time project progress and field verification reports."
        )
      )
    ),


    /* SUCCESS */

    submitted
      ? React.createElement(
          "div",
          {
            className:
              "field-report-success"
          },

          React.createElement(
            "span",
            null,
            "✓"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              "Field report submitted successfully"
            ),

            React.createElement(
              "small",
              null,
              "The report has been recorded for verification."
            )
          )
        )
      : null,


    /* FORM */

    React.createElement(
      "form",
      {
        className:
          "field-report-form",
        onSubmit:
          submitReport
      },

      /* PROJECT */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "01"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Select Project"
            ),

            React.createElement(
              "p",
              null,
              "Choose the government project you inspected."
            )
          )
        ),

        React.createElement(
          "select",
          {
            className:
              "field-select",
            value:
              selectedProject,
            onChange:
              function (event) {
                setSelectedProject(
                  event.target.value
                );
              }
          },

          React.createElement(
            "option",
            {
              value: ""
            },
            "Select a project..."
          ),

          PROJECTS.map(
            function (project) {
              return React.createElement(
                "option",
                {
                  key:
                    project.id,
                  value:
                    project.id
                },

                project.id +
                  " — " +
                  project.name
              );
            }
          )
        ),

        selectedProject
          ? React.createElement(
              "div",
              {
                className:
                  "selected-project-preview"
              },

              React.createElement(
                "strong",
                null,

                PROJECTS.find(
                  function (project) {
                    return (
                      project.id ===
                      selectedProject
                    );
                  }
                )?.name
              ),

              React.createElement(
                "span",
                null,

                PROJECTS.find(
                  function (project) {
                    return (
                      project.id ===
                      selectedProject
                    );
                  }
                )?.district +

                  ", " +

                  PROJECTS.find(
                    function (project) {
                      return (
                        project.id ===
                        selectedProject
                      );
                    }
                  )?.province
              )
            )
          : null
      ),


      /* PROGRESS */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "02"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Actual Field Progress"
            ),

            React.createElement(
              "p",
              null,
              "Enter the progress observed at the site."
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "field-progress-input"
          },

          React.createElement(
            "input",
            {
              type: "number",
              min: "0",
              max: "100",
              placeholder: "0",
              value:
                progress,
              onChange:
                function (event) {
                  setProgress(
                    event.target.value
                  );
                }
            }
          ),

          React.createElement(
            "span",
            null,
            "%"
          )
        )
      ),


      /* CONDITION */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "03"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Site Condition"
            ),

            React.createElement(
              "p",
              null,
              "Record the current physical condition."
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "condition-options"
          },

          ["Good", "Fair", "Poor", "Critical"].map(
            function (item) {
              return React.createElement(
                "button",
                {
                  type: "button",

                  key: item,

                  className:
                    condition === item
                      ? "condition-option active"
                      : "condition-option",

                  onClick:
                    function () {
                      setCondition(item);
                    }
                },

                item
              );
            }
          )
        )
      ),


      /* GPS */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "04"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "GPS Location"
            ),

            React.createElement(
              "p",
              null,
              "Capture the exact location where the inspection happened."
            )
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "gps-section"
          },

          React.createElement(
            "button",
            {
              type: "button",
              className:
                "capture-location-btn",
              onClick:
                captureLocation
            },

            locationLoading
              ? "Getting Location..."
              : "📍 Capture My Location"
          ),

          React.createElement(
            "div",
            {
              className:
                "gps-values"
            },

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

                latitude ||
                  "Not captured"
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

                longitude ||
                  "Not captured"
              )
            )
          )
        )
      ),


      /* EVIDENCE */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "05"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Evidence"
            ),

            React.createElement(
              "p",
              null,
              "Upload photos or videos from the project site."
            )
          )
        ),

        React.createElement(
          "label",
          {
            className:
              "evidence-upload"
          },

          React.createElement(
            "input",
            {
              type: "file",
              accept:
                "image/*,video/*",
              multiple: true,
              onChange:
                handleEvidenceChange
            }
          ),

          React.createElement(
            "div",
            {
              className:
                "upload-icon"
            },
            "📸"
          ),

          React.createElement(
            "strong",
            null,
            "Upload Site Evidence"
          ),

          React.createElement(
            "span",
            null,
            "Photos and videos from the field"
          )
        ),

        evidence.length > 0
          ? React.createElement(
              "div",
              {
                className:
                  "evidence-file-list"
              },

              evidence.map(
                function (file, index) {
                  return React.createElement(
                    "div",
                    {
                      key:
                        index,
                      className:
                        "evidence-file"
                    },

                    React.createElement(
                      "span",
                      null,
                      file.type.startsWith(
                        "video/"
                      )
                        ? "🎥"
                        : "📷"
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
                  );
                }
              )
            )
          : null
      ),


      /* REMARKS */

      React.createElement(
        "section",
        {
          className:
            "field-report-card"
        },

        React.createElement(
          "div",
          {
            className:
              "field-card-header"
          },

          React.createElement(
            "div",
            {
              className:
                "field-card-number"
            },
            "06"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Field Remarks"
            ),

            React.createElement(
              "p",
              null,
              "Describe what you observed at the project site."
            )
          )
        ),

        React.createElement(
          "textarea",
          {
            className:
              "field-textarea",
            rows: 6,
            placeholder:
              "Example: Construction work is progressing normally. Materials were available at the site...",
            value:
              remarks,
            onChange:
              function (event) {
                setRemarks(
                  event.target.value
                );
              }
          }
        )
      ),


      /* SUBMIT */

      React.createElement(
        "div",
        {
          className:
            "field-report-submit"
        },

        React.createElement(
          "button",
          {
            type: "submit",
            className:
              "submit-field-report"
          },

          "Submit Field Report →"
        )
      )
    )
  );
}

export default FieldReports;