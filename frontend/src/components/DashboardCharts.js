import React, {
  useMemo
} from "react";

const h = React.createElement;

const DashboardCharts = ({
  statusData = [],
  provinceData = [],
  projects = [],
  fieldReports = []
}) => {
  const statusItems = useMemo(() => {
    if (Array.isArray(statusData) && statusData.length) {
      return statusData.map((item) => ({
        label:
          item.status ||
          item.name ||
          "Unknown",
        value:
          Number(
            item.count ??
            item.total ??
            item.value ??
            0
          )
      }));
    }

    const counts = {};

    projects.forEach((project) => {
      const status =
        project.status || "Active";

      counts[status] =
        (counts[status] || 0) + 1;
    });

    return Object.keys(counts).map(
      (key) => ({
        label: key,
        value: counts[key]
      })
    );
  }, [statusData, projects]);

  const provinceItems = useMemo(() => {
    if (
      Array.isArray(provinceData) &&
      provinceData.length
    ) {
      return provinceData.map((item) => ({
        label:
          item.province ||
          item.name ||
          "Unknown",
        value:
          Number(
            item.count ??
            item.total ??
            item.value ??
            0
          )
      }));
    }

    const counts = {};

    projects.forEach((project) => {
      const province =
        project.province ||
        "Unknown";

      counts[province] =
        (counts[province] || 0) + 1;
    });

    return Object.keys(counts).map(
      (key) => ({
        label: key,
        value: counts[key]
      })
    );
  }, [provinceData, projects]);

  const riskItems = useMemo(() => {
    const counts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };

    projects.forEach((project) => {
      const risk =
        project.riskLevel ||
        project.risk ||
        "Low";

      const key =
        Object.keys(counts).find(
          (item) =>
            item.toLowerCase() ===
            String(risk).toLowerCase()
        );

      if (key) {
        counts[key]++;
      }
    });

    return Object.keys(counts).map(
      (key) => ({
        label: key,
        value: counts[key]
      })
    );
  }, [projects]);

  const progressItems = useMemo(() => {
    if (!projects.length) {
      return [];
    }

    const groups = {
      "0-25%": 0,
      "26-50%": 0,
      "51-75%": 0,
      "76-99%": 0,
      "100%": 0
    };

    projects.forEach((project) => {
      const progress = Number(
        project.progress || 0
      );

      if (progress >= 100) {
        groups["100%"]++;
      } else if (progress >= 76) {
        groups["76-99%"]++;
      } else if (progress >= 51) {
        groups["51-75%"]++;
      } else if (progress >= 26) {
        groups["26-50%"]++;
      } else {
        groups["0-25%"]++;
      }
    });

    return Object.keys(groups).map(
      (key) => ({
        label: key,
        value: groups[key]
      })
    );
  }, [projects]);

  const budgetTotal = useMemo(() => {
    return projects.reduce(
      (total, project) =>
        total +
        Number(
          project.budget || 0
        ),
      0
    );
  }, [projects]);

  const completedReports =
    fieldReports.filter(
      (report) => {
        const status =
          String(
            report.status || ""
          ).toLowerCase();

        return (
          status === "completed" ||
          Number(
            report.progress || 0
          ) >= 100
        );
      }
    ).length;

  const maxStatus =
    Math.max(
      ...statusItems.map(
        (item) => item.value
      ),
      1
    );

  const maxProvince =
    Math.max(
      ...provinceItems.map(
        (item) => item.value
      ),
      1
    );

  const maxRisk =
    Math.max(
      ...riskItems.map(
        (item) => item.value
      ),
      1
    );

  const maxProgress =
    Math.max(
      ...progressItems.map(
        (item) => item.value
      ),
      1
    );

  const renderBarChart = (
    items,
    max,
    emptyText
  ) => {
    if (!items.length) {
      return h(
        "div",
        {
          className:
            "dashboard-chart-empty"
        },
        emptyText
      );
    }

    return h(
      "div",
      {
        className:
          "dashboard-bar-chart"
      },

      items.map(
        (item, index) =>
          h(
            "div",
            {
              className:
                "dashboard-bar-row",
              key:
                `${item.label}-${index}`
            },

            h(
              "div",
              {
                className:
                  "dashboard-bar-label"
              },
              h(
                "span",
                null,
                item.label
              ),
              h(
                "strong",
                null,
                item.value
              )
            ),

            h(
              "div",
              {
                className:
                  "dashboard-bar-track"
              },

              h(
                "div",
                {
                  className:
                    "dashboard-bar-fill",
                  style: {
                    width:
                      `${Math.max(
                        (item.value /
                          max) *
                          100,
                        item.value
                          ? 4
                          : 0
                      )}%`
                  }
                }
              )
            )
          )
      )
    );
  };

  return h(
    "div",
    {
      className:
        "dashboard-charts-section"
    },

    h(
      "div",
      {
        className:
          "dashboard-charts-grid"
      },

      // STATUS
      h(
        "div",
        {
          className:
            "dashboard-chart-card"
        },

        h(
          "div",
          {
            className:
              "dashboard-chart-header"
          },

          h(
            "div",
            null,

            h(
              "h3",
              null,
              "Project Status"
            ),

            h(
              "p",
              null,
              "Current project distribution"
            )
          )
        ),

        renderBarChart(
          statusItems,
          maxStatus,
          "No project status data."
        )
      ),

      // PROVINCE
      h(
        "div",
        {
          className:
            "dashboard-chart-card"
        },

        h(
          "div",
          {
            className:
              "dashboard-chart-header"
          },

          h(
            "div",
            null,

            h(
              "h3",
              null,
              "Province-wise Projects"
            ),

            h(
              "p",
              null,
              "Projects by province"
            )
          )
        ),

        renderBarChart(
          provinceItems,
          maxProvince,
          "No province data."
        )
      ),

      // PROGRESS
      h(
        "div",
        {
          className:
            "dashboard-chart-card"
        },

        h(
          "div",
          {
            className:
              "dashboard-chart-header"
          },

          h(
            "div",
            null,

            h(
              "h3",
              null,
              "Progress Distribution"
            ),

            h(
              "p",
              null,
              "Projects grouped by progress"
            )
          )
        ),

        renderBarChart(
          progressItems,
          maxProgress,
          "No progress data."
        )
      ),

      // RISK
      h(
        "div",
        {
          className:
            "dashboard-chart-card"
        },

        h(
          "div",
          {
            className:
              "dashboard-chart-header"
          },

          h(
            "div",
            null,

            h(
              "h3",
              null,
              "Risk Distribution"
            ),

            h(
              "p",
              null,
              "Current project risk levels"
            )
          )
        ),

        renderBarChart(
          riskItems,
          maxRisk,
          "No risk data."
        )
      )
    ),

    // SUMMARY
    h(
      "div",
      {
        className:
          "dashboard-chart-summary"
      },

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Total Budget"
        ),

        h(
          "strong",
          null,
          `NPR ${budgetTotal.toLocaleString()}`
        )
      ),

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Field Reports"
        ),

        h(
          "strong",
          null,
          fieldReports.length
        )
      ),

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Completed Reports"
        ),

        h(
          "strong",
          null,
          completedReports
        )
      ),

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Projects"
        ),

        h(
          "strong",
          null,
          projects.length
        )
      )
    )
  );
};

export default DashboardCharts;