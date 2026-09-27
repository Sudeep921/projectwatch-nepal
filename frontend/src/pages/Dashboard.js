import React, {
  useEffect,
  useState
} from "react";

import {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary,
  getProjects,
  getFieldReports,
  getComplaints,
  getAlerts,
  getNotifications
} from "../services/api";

import {
  useNavigate
} from "react-router-dom";

const h = React.createElement;

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] =
    useState(null);

  const [statusData, setStatusData] =
    useState([]);

  const [provinceData, setProvinceData] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [fieldReports, setFieldReports] =
    useState([]);

  const [complaints, setComplaints] =
    useState([]);

  const [alerts, setAlerts] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  /* =========================
     LOAD DASHBOARD
  ========================= */

  const loadDashboard = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const results =
        await Promise.allSettled([
          getDashboardStats(),
          getProjectStatusSummary(),
          getProvinceSummary(),
          getProjects(),
          getFieldReports(),
          getComplaints(),
          getAlerts(),
          getNotifications()
        ]);

      const [
        statsResult,
        statusResult,
        provinceResult,
        projectsResult,
        reportsResult,
        complaintsResult,
        alertsResult,
        notificationsResult
      ] = results;


      /* =========================
         DASHBOARD STATS
      ========================= */

      if (
        statsResult.status ===
        "fulfilled"
      ) {
        const response =
          statsResult.value;

        const data =
          response?.data ||
          response?.stats ||
          response ||
          {};

        setStats(data);
      } else {
        console.warn(
          "Dashboard stats failed:",
          statsResult.reason
        );

        setStats({});
      }


      /* =========================
         STATUS SUMMARY
      ========================= */

      if (
        statusResult.status ===
        "fulfilled"
      ) {
        const response =
          statusResult.value;

        const rawData =
          response?.summary ||
          response?.data ||
          response ||
          [];

        let normalizedStatus = [];

        if (
          Array.isArray(rawData)
        ) {
          normalizedStatus =
            rawData.map(
              (item) => ({
                status:
                  item?.status ||
                  item?._id ||
                  item?.name ||
                  "Unknown",

                count:
                  Number(
                    item?.count ??
                    item?.projects ??
                    item?.total ??
                    0
                  )
              })
            );
        } else if (
          rawData &&
          typeof rawData ===
            "object"
        ) {
          normalizedStatus =
            Object.entries(
              rawData
            ).map(
              ([status, count]) => ({
                status,

                count:
                  Number(
                    typeof count ===
                      "object"
                      ? (
                          count?.count ??
                          count?.projects ??
                          count?.total ??
                          0
                        )
                      : count
                  ) || 0
              })
            );
        }

        setStatusData(
          normalizedStatus
        );
      } else {
        console.warn(
          "Project status summary failed:",
          statusResult.reason
        );

        setStatusData([]);
      }


      /* =========================
         PROVINCE SUMMARY
      ========================= */

      if (
        provinceResult.status ===
        "fulfilled"
      ) {
        const response =
          provinceResult.value;

        const rawData =
          response?.summary ||
          response?.provinces ||
          response?.data ||
          response ||
          [];

        let normalizedProvince = [];

        if (
          Array.isArray(rawData)
        ) {
          normalizedProvince =
            rawData.map(
              (item) => ({
                province:
                  item?.province ||
                  item?._id ||
                  item?.name ||
                  "Unknown",

                count:
                  Number(
                    item?.count ??
                    item?.projects ??
                    item?.total ??
                    0
                  )
              })
            );
        } else if (
          rawData &&
          typeof rawData ===
            "object"
        ) {
          normalizedProvince =
            Object.entries(
              rawData
            ).map(
              ([province, value]) => ({
                province,

                count:
                  Number(
                    typeof value ===
                      "object"
                      ? (
                          value?.count ??
                          value?.projects ??
                          value?.total ??
                          0
                        )
                      : value
                  ) || 0
              })
            );
        }

        setProvinceData(
          normalizedProvince
        );
      } else {
        console.warn(
          "Province summary failed:",
          provinceResult.reason
        );

        setProvinceData([]);
      }


      /* =========================
         PROJECTS
      ========================= */

      if (
        projectsResult.status ===
        "fulfilled"
      ) {
        const response =
          projectsResult.value;

        const rawProjects =
          response?.projects ||
          response?.data ||
          (
            Array.isArray(response)
              ? response
              : []
          );

        setProjects(
          Array.isArray(
            rawProjects
          )
            ? rawProjects.slice(
                0,
                5
              )
            : []
        );
      } else {
        console.warn(
          "Projects loading failed:",
          projectsResult.reason
        );

        setProjects([]);
      }


      /* =========================
         FIELD REPORTS
      ========================= */

      if (
        reportsResult.status ===
        "fulfilled"
      ) {
        const response =
          reportsResult.value;

        const rawReports =
          response?.reports ||
          response?.fieldReports ||
          response?.data ||
          (
            Array.isArray(response)
              ? response
              : []
          );

        setFieldReports(
          Array.isArray(
            rawReports
          )
            ? rawReports.slice(
                0,
                5
              )
            : []
        );
      } else {
        console.warn(
          "Field reports loading failed:",
          reportsResult.reason
        );

        setFieldReports([]);
      }


      /* =========================
         COMPLAINTS
      ========================= */

      if (
        complaintsResult.status ===
        "fulfilled"
      ) {
        const response =
          complaintsResult.value;

        const rawComplaints =
          response?.complaints ||
          response?.data ||
          (
            Array.isArray(response)
              ? response
              : []
          );

        setComplaints(
          Array.isArray(
            rawComplaints
          )
            ? rawComplaints.slice(
                0,
                5
              )
            : []
        );
      } else {
        console.warn(
          "Complaints loading failed:",
          complaintsResult.reason
        );

        setComplaints([]);
      }


      /* =========================
         ALERTS
      ========================= */

      if (
        alertsResult.status ===
        "fulfilled"
      ) {
        const response =
          alertsResult.value;

        const rawAlerts =
          response?.alerts ||
          response?.data ||
          (
            Array.isArray(response)
              ? response
              : []
          );

        setAlerts(
          Array.isArray(
            rawAlerts
          )
            ? rawAlerts.slice(
                0,
                5
              )
            : []
        );
      } else {
        console.warn(
          "Alerts loading failed:",
          alertsResult.reason
        );

        setAlerts([]);
      }


      /* =========================
         NOTIFICATIONS
      ========================= */

      if (
        notificationsResult.status ===
        "fulfilled"
      ) {
        const response =
          notificationsResult.value;

        const rawNotifications =
          response?.notifications ||
          response?.data ||
          (
            Array.isArray(response)
              ? response
              : []
          );

        setNotifications(
          Array.isArray(
            rawNotifications
          )
            ? rawNotifications.slice(
                0,
                5
              )
            : []
        );
      } else {
        console.warn(
          "Notifications loading failed:",
          notificationsResult.reason
        );

        setNotifications([]);
      }


      /* =========================
         PARTIAL ERROR CHECK
      ========================= */

      const failedApis =
        results.filter(
          (item) =>
            item.status ===
            "rejected"
        );

      if (
        failedApis.length > 0
      ) {
        setError(
          `${failedApis.length} dashboard API(s) could not be loaded.`
        );
      } else {
        setError("");
      }


      /* =========================
         LAST UPDATED
      ========================= */

      setLastUpdated(
        new Date()
      );

    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadDashboard();
  }, []);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return h(
      "div",
      {
        className:
          "page-loading"
      },

      h(
        "div",
        {
          className:
            "loading-spinner"
        }
      ),

      h(
        "p",
        null,

        "Loading dashboard..."
      )
    );
  }


  /* =========================
     SAFE STATS
  ========================= */

  const totalProjects =
    Number(
      stats?.totalProjects ??
      stats?.total ??
      0
    );

  const activeProjects =
    Number(
      stats?.activeProjects ??
      stats?.active ??
      0
    );

  const completedProjects =
    Number(
      stats?.completedProjects ??
      stats?.completed ??
      0
    );

  const delayedProjects =
    Number(
      stats?.delayedProjects ??
      stats?.delayed ??
      0
    );

  const criticalProjects =
    Number(
      stats?.criticalProjects ??
      stats?.critical ??
      0
    );

  const totalBudget =
    Number(
      stats?.totalBudget ??
      stats?.budget ??
      0
    );

  const averageProgress =
    Number(
      stats?.averageProgress ??
      stats?.avgProgress ??
      stats?.progress ??
      0
    );

  const totalFieldReports =
    Number(
      stats?.fieldReports ??
      stats?.totalFieldReports ??
      fieldReports.length
    );

  const totalComplaints =
    Number(
      stats?.complaints ??
      stats?.totalComplaints ??
      complaints.length
    );

  const totalNotifications =
    Number(
      stats?.notifications ??
      stats?.totalNotifications ??
      notifications.length
    );


  /* =========================
     LAST UPDATED TEXT
  ========================= */

  const lastUpdatedText =
    lastUpdated
      ? lastUpdated.toLocaleString(
          "en-NP",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short"
          }
        )
      : "Not updated yet";


  /* =========================
     STAT CARD
  ========================= */

  const createStatCard = (
    icon,
    label,
    value
  ) => {
    return h(
      "div",
      {
        className:
          "stat-card"
      },

      h(
        "div",
        {
          className:
            "stat-card-top"
        },

        h(
          "div",
          {
            className:
              "stat-icon"
          },

          icon
        )
      ),

      h(
        "div",
        {
          className:
            "stat-label"
        },

        label
      ),

      h(
        "div",
        {
          className:
            "stat-value"
        },

        value
      )
    );
  };


  /* =========================
     HEADER
  ========================= */

  const pageHeader =
    h(
      "div",
      {
        className:
          "page-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,

          "Government Project Dashboard"
        ),

        h(
          "p",
          null,

          "Monitor Nepal's public projects in real time."
        ),

        h(
          "small",
          {
            className:
              "dashboard-last-updated"
          },

          "Last updated: " +
            lastUpdatedText
        )
      ),

      h(
        "button",
        {
          className:
            "refresh-button",

          type:
            "button",

          onClick: () =>
            loadDashboard(true),

          disabled:
            refreshing
        },

        refreshing
          ? "↻ Refreshing..."
          : "↻ Refresh"
      )
    );


  /* =========================
     STATS GRID
  ========================= */

  const statsGrid =
    h(
      "div",
      {
        className:
          "stats-grid"
      },

      createStatCard(
        "▦",
        "Total Projects",
        totalProjects
      ),

      createStatCard(
        "◉",
        "Active Projects",
        activeProjects
      ),

      createStatCard(
        "✓",
        "Completed Projects",
        completedProjects
      ),

      createStatCard(
        "⚠",
        "Delayed Projects",
        delayedProjects
      ),

      createStatCard(
        "!",
        "Critical Projects",
        criticalProjects
      ),

      createStatCard(
        "NPR",
        "Total Budget",

        "NPR " +
          totalBudget.toLocaleString(
            "en-IN"
          )
      ),

      createStatCard(
        "%",
        "Average Progress",

        averageProgress +
          "%"
      ),

      createStatCard(
        "◉",
        "Field Reports",
        totalFieldReports
      ),

      createStatCard(
        "🔔",
        "Notifications",
        totalNotifications
      )
    );


  /* =========================
     STATUS
  ========================= */

  const statusTotal =
    statusData.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item?.count || 0
        ),
      0
    );

  const statusRows =
    statusData.length === 0

      ? h(
          "div",
          {
            className:
              "empty-state"
          },

          h(
            "div",
            {
              className:
                "empty-state-icon"
            },

            "▦"
          ),

          h(
            "p",
            null,

            "No project status data available."
          )
        )

      : statusData.map(
          (
            item,
            index
          ) => {

            const count =
              Number(
                item?.count || 0
              );

            const percentage =
              statusTotal > 0
                ? Math.round(
                    (
                      count /
                      statusTotal
                    ) *
                    100
                  )
                : 0;

            return h(
              "div",
              {
                className:
                  "status-row",

                key:
                  item?.status ||
                  item?._id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "status-row-header"
                },

                h(
                  "span",
                  null,

                  item?.status ||
                    item?._id ||
                    "Unknown"
                ),

                h(
                  "strong",
                  null,

                  count
                )
              ),

              h(
                "div",
                {
                  className:
                    "status-progress-track"
                },

                h(
                  "div",
                  {
                    className:
                      "status-progress-fill",

                    style: {
                      width:
                        percentage +
                        "%"
                    }
                  }
                )
              ),

              h(
                "small",
                null,

                percentage +
                  "% of projects"
              )
            );
          }
        );


  const statusPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Project Status"
          ),

          h(
            "p",
            null,

            "Current project distribution"
          )
        ),

        h(
          "span",
          {
            className:
              "panel-count"
          },

          totalProjects +
            " Projects"
        )
      ),

      h(
        "div",
        {
          className:
            "status-list"
        },

        statusRows
      )
    );


  /* =========================
     PROVINCES
  ========================= */

  const maxProvinceCount =
    provinceData.length > 0
      ? Math.max(
          ...provinceData.map(
            (item) =>
              Number(
                item?.count || 0
              )
          )
        )
      : 0;

  const provinceRows =
    provinceData.length === 0

      ? h(
          "div",
          {
            className:
              "empty-state"
          },

          h(
            "div",
            {
              className:
                "empty-state-icon"
            },

            "⌖"
          ),

          h(
            "p",
            null,

            "No province data available."
          )
        )

      : provinceData.map(
          (
            item,
            index
          ) => {

            const count =
              Number(
                item?.count || 0
              );

            const percentage =
              maxProvinceCount > 0
                ? Math.round(
                    (
                      count /
                      maxProvinceCount
                    ) *
                    100
                  )
                : 0;

            return h(
              "div",
              {
                className:
                  "province-row",

                key:
                  item?.province ||
                  item?._id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "province-row-header"
                },

                h(
                  "span",
                  null,

                  item?.province ||
                    item?._id ||
                    "Unknown"
                ),

                h(
                  "strong",
                  null,

                  count
                )
              ),

              h(
                "div",
                {
                  className:
                    "province-progress-track"
                },

                h(
                  "div",
                  {
                    className:
                      "province-progress-fill",

                    style: {
                      width:
                        percentage +
                        "%"
                    }
                  }
                )
              )
            );
          }
        );


  const provincePanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Projects by Province"
          ),

          h(
            "p",
            null,

            "Geographic distribution"
          )
        ),

        h(
          "span",
          {
            className:
              "panel-count"
          },

          provinceData.length +
            " Provinces"
        )
      ),

      h(
        "div",
        {
          className:
            "province-list"
        },

        provinceRows
      )
    );


  /* =========================
     PROJECT NAME
  ========================= */

  const getProjectName =
    (project) =>
      project?.name ||
      project?.projectName ||
      project?.title ||
      "Unnamed Project";


  /* =========================
     RECENT PROJECTS
  ========================= */

  const recentProjects =
    projects.length === 0

      ? h(
          "div",
          {
            className:
              "dashboard-empty-list"
          },

          "No projects available."
        )

      : projects.map(
          (
            project,
            index
          ) => {

            const projectId =
              project?._id ||
              project?.id;

            const projectProgress =
              Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    project?.progress ??
                    project?.completionPercentage ??
                    project?.reportedProgress ??
                    0
                  )
                )
              );

            return h(
              "div",
              {
                className:
                  "recent-item",

                key:
                  projectId ||
                  index,

                onClick: () => {
                  if (
                    projectId
                  ) {
                    navigate(
                      "/admin/projects/" +
                      projectId
                    );
                  }
                },

                style: {
                  cursor:
                    projectId
                      ? "pointer"
                      : "default"
                }
              },

              h(
                "div",
                {
                  className:
                    "recent-item-main"
                },

                h(
                  "strong",
                  null,

                  getProjectName(
                    project
                  )
                ),

                h(
                  "span",
                  null,

                  project?.projectCode ||
                    project?.code ||
                    "No project code"
                ),

                h(
                  "div",
                  {
                    className:
                      "dashboard-project-progress"
                  },

                  h(
                    "div",
                    {
                      className:
                        "dashboard-project-progress-top"
                    },

                    h(
                      "span",
                      null,

                      "Progress"
                    ),

                    h(
                      "strong",
                      null,

                      `${projectProgress}%`
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "dashboard-project-progress-bar"
                    },

                    h(
                      "div",
                      {
                        className:
                          "dashboard-project-progress-fill",

                        style: {
                          width:
                            projectProgress +
                            "%"
                        }
                      }
                    )
                  )
                )
              ),

              h(
                "div",
                {
                  className:
                    "recent-item-side"
                },

                h(
                  "span",
                  {
                    className:
                      "mini-status"
                  },

                  project?.status ||
                    "Unknown"
                )
              )
            );
          }
        );


  const projectsPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Recent Projects"
          ),

          h(
            "p",
            null,

            "Latest project records"
          )
        ),

        h(
          "button",
          {
            className:
              "panel-link",

            type:
              "button",

            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },

          "View All →"
        )
      ),

      h(
        "div",
        {
          className:
            "recent-list"
        },

        recentProjects
      )
    );


  /* =========================
     FIELD REPORTS
  ========================= */

  const recentReports =
    fieldReports.length === 0

      ? h(
          "div",
          {
            className:
              "dashboard-empty-list"
          },

          "No field reports available."
        )

      : fieldReports.map(
          (
            report,
            index
          ) => {

            const projectName =
              report?.project?.name ||
              report?.project?.projectName ||
              report?.projectName ||
              "Project";

            const progress =
              Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    report?.reportedProgress ??
                    report?.progress ??
                    0
                  )
                )
              );

            return h(
              "div",
              {
                className:
                  "recent-item",

                key:
                  report?._id ||
                  report?.id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "recent-item-main"
                },

                h(
                  "strong",
                  null,

                  projectName
                ),

                h(
                  "span",
                  null,

                  report?.reportNumber ||
                    "Field Report"
                ),

                h(
                  "div",
                  {
                    className:
                      "dashboard-field-progress"
                  },

                  `${progress}%`
                ),

                h(
                  "p",
                  {
                    className:
                      "dashboard-field-observation"
                  },

                  report?.observation ||
                    "No observation provided."
                )
              )
            );
          }
        );


  const reportsPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Recent Field Reports"
          ),

          h(
            "p",
            null,

            "Latest field updates"
          )
        ),

        h(
          "button",
          {
            className:
              "panel-link",

            type:
              "button",

            onClick: () =>
              navigate(
                "/admin/field-reports"
              )
          },

          "View All →"
        )
      ),

      h(
        "div",
        {
          className:
            "recent-list"
        },

        recentReports
      )
    );


  /* =========================
     COMPLAINTS
  ========================= */

  const recentComplaints =
    complaints.length === 0

      ? h(
          "div",
          {
            className:
              "dashboard-empty-list"
          },

          "No complaints available."
        )

      : complaints.map(
          (
            complaint,
            index
          ) => {

            const projectName =
              complaint?.project?.name ||
              complaint?.project?.projectName ||
              complaint?.projectName ||
              "Project";

            return h(
              "div",
              {
                className:
                  "recent-item",

                key:
                  complaint?._id ||
                  complaint?.id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "recent-item-main"
                },

                h(
                  "strong",
                  null,

                  complaint?.subject ||
                    complaint?.title ||
                    "Complaint"
                ),

                h(
                  "span",
                  null,

                  projectName
                )
              ),

              h(
                "div",
                {
                  className:
                    "recent-item-side"
                },

                h(
                  "span",
                  {
                    className:
                      "complaint-status"
                  },

                  complaint?.status ||
                    "Open"
                )
              )
            );
          }
        );


  const complaintsPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Recent Complaints"
          ),

          h(
            "p",
            null,

            "Latest public complaints"
          )
        ),

        h(
          "button",
          {
            className:
              "panel-link",

            type:
              "button",

            onClick: () =>
              navigate(
                "/admin/complaints"
              )
          },

          "View All →"
        )
      ),

      h(
        "div",
        {
          className:
            "recent-list"
        },

        recentComplaints
      )
    );


  /* =========================
     ALERTS
  ========================= */

  const recentAlerts =
    alerts.length === 0

      ? h(
          "div",
          {
            className:
              "dashboard-empty-list"
          },

          "No alerts available."
        )

      : alerts.map(
          (
            alert,
            index
          ) =>
            h(
              "div",
              {
                className:
                  "recent-item alert-item",

                key:
                  alert?._id ||
                  alert?.id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "alert-icon"
                },

                "⚠"
              ),

              h(
                "div",
                {
                  className:
                    "recent-item-main"
                },

                h(
                  "strong",
                  null,

                  alert?.title ||
                    alert?.name ||
                    "Project Alert"
                ),

                h(
                  "span",
                  null,

                  alert?.message ||
                    alert?.description ||
                    "Alert generated"
                )
              )
            )
        );


  const alertsPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Recent Alerts"
          ),

          h(
            "p",
            null,

            "Important project alerts"
          )
        ),

        h(
          "button",
          {
            className:
              "panel-link",

            type:
              "button",

            onClick: () =>
              navigate(
                "/admin/alerts"
              )
          },

          "View All →"
        )
      ),

      h(
        "div",
        {
          className:
            "recent-list"
        },

        recentAlerts
      )
    );


  /* =========================
     NOTIFICATIONS
  ========================= */

  const recentNotifications =
    notifications.length === 0

      ? h(
          "div",
          {
            className:
              "dashboard-empty-list"
          },

          "No notifications available."
        )

      : notifications.map(
          (
            notification,
            index
          ) => {

            const title =
              notification?.title ||
              notification?.subject ||
              "Notification";

            const message =
              notification?.message ||
              notification?.description ||
              notification?.body ||
              "New ProjectWatch notification";

            const date =
              notification?.createdAt ||
              notification?.date ||
              notification?.timestamp;

            const isRead =
              notification?.read === true ||
              notification?.isRead === true ||
              notification?.status ===
                "read";

            return h(
              "div",
              {
                className:
                  "recent-item dashboard-notification-item " +
                  (
                    !isRead
                      ? "dashboard-notification-unread"
                      : ""
                  ),

                key:
                  notification?._id ||
                  notification?.id ||
                  index
              },

              h(
                "div",
                {
                  className:
                    "dashboard-notification-icon"
                },

                "🔔"
              ),

              h(
                "div",
                {
                  className:
                    "recent-item-main"
                },

                h(
                  "strong",
                  null,

                  title
                ),

                h(
                  "span",
                  null,

                  message
                ),

                date &&
                  h(
                    "small",
                    {
                      className:
                        "dashboard-notification-date"
                    },

                    new Date(
                      date
                    ).toLocaleString()
                  )
              ),

              !isRead &&
                h(
                  "span",
                  {
                    className:
                      "dashboard-notification-new"
                  },

                  "NEW"
                )
            );
          }
        );


  const notificationsPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Recent Notifications"
          ),

          h(
            "p",
            null,

            "Latest system notifications"
          )
        ),

        h(
          "button",
          {
            className:
              "panel-link",

            type:
              "button",

            onClick: () =>
              navigate(
                "/admin/notifications"
              )
          },

          "View All →"
        )
      ),

      h(
        "div",
        {
          className:
            "recent-list"
        },

        recentNotifications
      )
    );


  /* =========================
     OVERVIEW
  ========================= */

  const completionRate =
    totalProjects > 0
      ? Math.round(
          (
            completedProjects /
            totalProjects
          ) *
          100
        )
      : 0;

  const delayedRate =
    totalProjects > 0
      ? Math.round(
          (
            delayedProjects /
            totalProjects
          ) *
          100
        )
      : 0;

  const criticalRate =
    totalProjects > 0
      ? Math.round(
          (
            criticalProjects /
            totalProjects
          ) *
          100
        )
      : 0;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !(
          notification?.read ===
            true ||

          notification?.isRead ===
            true ||

          notification?.status ===
            "read"
        )
    ).length;


  const overviewPanel =
    h(
      "section",
      {
        className:
          "dashboard-panel overview-panel"
      },

      h(
        "div",
        {
          className:
            "panel-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,

            "Project Overview"
          ),

          h(
            "p",
            null,

            "Key monitoring indicators"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "overview-grid"
        },

        h(
          "div",
          {
            className:
              "overview-item"
          },

          h(
            "span",
            null,

            "Completion Rate"
          ),

          h(
            "strong",
            null,

            completionRate +
              "%"
          )
        ),

        h(
          "div",
          {
            className:
              "overview-item"
          },

          h(
            "span",
            null,

            "Delayed Rate"
          ),

          h(
            "strong",
            null,

            delayedRate +
              "%"
          )
        ),

        h(
          "div",
          {
            className:
              "overview-item"
          },

          h(
            "span",
            null,

            "Critical Rate"
          ),

          h(
            "strong",
            null,

            criticalRate +
              "%"
          )
        ),

        h(
          "div",
          {
            className:
              "overview-item"
          },

          h(
            "span",
            null,

            "Complaints"
          ),

          h(
            "strong",
            null,

            totalComplaints
          )
        ),

        h(
          "div",
          {
            className:
              "overview-item"
          },

          h(
            "span",
            null,

            "Unread Notifications"
          ),

          h(
            "strong",
            null,

            unreadNotifications
          )
        )
      )
    );


  /* =========================
     DASHBOARD WARNING
  ========================= */

  const dashboardWarning =
    error
      ? h(
          "div",
          {
            className:
              "dashboard-error"
          },

          h(
            "strong",
            null,

            "Dashboard Warning"
          ),

          h(
            "p",
            null,

            error
          ),

          h(
            "button",
            {
              type:
                "button",

              onClick: () =>
                loadDashboard(true)
            },

            "Try Again"
          )
        )
      : null;


  /* =========================
     FINAL
  ========================= */

  return h(
    "div",
    {
      className:
        "dashboard-page"
    },

    dashboardWarning,

    pageHeader,

    statsGrid,

    h(
      "div",
      {
        className:
          "dashboard-grid"
      },

      statusPanel,

      provincePanel
    ),

    overviewPanel,

    h(
      "div",
      {
        className:
          "dashboard-grid dashboard-recent-grid"
      },

      projectsPanel,

      reportsPanel
    ),

    h(
      "div",
      {
        className:
          "dashboard-grid dashboard-recent-grid"
      },

      complaintsPanel,

      alertsPanel
    ),

    h(
      "div",
      {
        className:
          "dashboard-grid dashboard-recent-grid"
      },

      notificationsPanel
    )
  );
};

export default Dashboard;