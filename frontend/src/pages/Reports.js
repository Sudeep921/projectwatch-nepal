import React, {
  useEffect,
  useState
} from "react";

import {
  getProjectReport
} from "../services/api";

const h = React.createElement;

const Reports = () => {
  const [
    report,
    setReport
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const load =
    async () => {
      try {
        setLoading(true);

        const data =
          await getProjectReport();

        setReport(
          data.report ||
            data.data ||
            data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return h(
      "div",
      {
        className:
          "page-loading"
      },
      "Generating report..."
    );
  }

  const r =
    report || {};

  return h(
    "div",
    {
      className:
        "page reports-page"
    },

    h(
      "div",
      {
        className:
          "page-heading"
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
          "ANALYTICS & REPORTING"
        ),

        h(
          "h1",
          null,
          "Project Reports"
        ),

        h(
          "p",
          null,
          "Government project performance and monitoring summary."
        )
      ),

      h(
        "button",
        {
          className:
            "secondary-button",
          onClick: load
        },
        "↻ Refresh Report"
      )
    ),

    h(
      "div",
      {
        className:
          "report-stat-grid"
      },

      [
        [
          "Total Projects",
          r.totalProjects
        ],
        [
          "Active Projects",
          r.activeProjects
        ],
        [
          "Delayed Projects",
          r.delayedProjects
        ],
        [
          "Completed Projects",
          r.completedProjects
        ],
        [
          "Critical Projects",
          r.criticalProjects
        ],
        [
          "Total Budget",
          `NPR ${Number(
            r.totalBudget || 0
          ).toLocaleString()}`
        ]
      ].map(
        ([label, value]) =>
          h(
            "div",
            {
              key: label,
              className:
                "report-stat-card"
            },

            h(
              "span",
              null,
              label
            ),

            h(
              "strong",
              null,
              value || 0
            )
          )
      )
    ),

    h(
      "div",
      {
        className:
          "report-overview"
      },

      h(
        "span",
        {
          className:
            "eyebrow"
        },
        "SYSTEM SUMMARY"
      ),

      h(
        "h2",
        null,
        "Project Monitoring Overview"
      ),

      h(
        "p",
        null,
        "This report summarizes the current government project monitoring data available in ProjectWatch Nepal."
      ),

      h(
        "small",
        null,
        `Report generated ${new Date().toLocaleString()}`
      )
    )
  );
};

export default Reports;