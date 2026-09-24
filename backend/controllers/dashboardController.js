const Project = require("../models/Project");

const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find();

    const totalProjects =
      projects.length;

    const activeProjects =
      projects.filter(
        (project) =>
          project.status === "Active"
      ).length;

    const delayedProjects =
      projects.filter(
        (project) =>
          project.status === "Delayed"
      ).length;

    const completedProjects =
      projects.filter(
        (project) =>
          project.status === "Completed"
      ).length;

    const criticalProjects =
      projects.filter(
        (project) =>
          project.status === "Critical" ||
          project.riskLevel === "Critical"
      ).length;

    const totalBudget =
      projects.reduce(
        (sum, project) =>
          sum + Number(project.budget || 0),
        0
      );

    const averageProgress =
      totalProjects > 0
        ? projects.reduce(
            (sum, project) =>
              sum +
              Number(project.progress || 0),
            0
          ) / totalProjects
        : 0;

    const highRiskProjects =
      projects.filter(
        (project) =>
          project.riskLevel === "High"
      ).length;

    res.json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        delayedProjects,
        completedProjects,
        criticalProjects,
        highRiskProjects,
        totalBudget,
        averageProgress:
          Number(
            averageProgress.toFixed(2)
          )
      }
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

const getProjectStatusSummary = async (
  req,
  res
) => {
  try {
    const projects =
      await Project.find().select(
        "status progress"
      );

    const summary = {
      Active: 0,
      Delayed: 0,
      Completed: 0,
      Critical: 0
    };

    projects.forEach((project) => {
      if (summary[project.status] !== undefined) {
        summary[project.status] += 1;
      }
    });

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error(
      "Project status summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch project status summary"
    });
  }
};

const getProvinceSummary = async (
  req,
  res
) => {
  try {
    const projects =
      await Project.find().select(
        "province budget progress status riskLevel"
      );

    const provinceMap = {};

    projects.forEach((project) => {
      const province =
        project.province || "Unknown";

      if (!provinceMap[province]) {
        provinceMap[province] = {
          province,
          projects: 0,
          budget: 0,
          progress: 0,
          active: 0,
          delayed: 0,
          completed: 0,
          critical: 0
        };
      }

      const item =
        provinceMap[province];

      item.projects += 1;

      item.budget +=
        Number(project.budget || 0);

      item.progress +=
        Number(project.progress || 0);

      if (project.status === "Active") {
        item.active += 1;
      }

      if (project.status === "Delayed") {
        item.delayed += 1;
      }

      if (project.status === "Completed") {
        item.completed += 1;
      }

      if (
        project.status === "Critical" ||
        project.riskLevel === "Critical"
      ) {
        item.critical += 1;
      }
    });

    const provinces =
      Object.values(provinceMap).map(
        (item) => ({
          ...item,
          averageProgress:
            item.projects > 0
              ? Number(
                  (
                    item.progress /
                    item.projects
                  ).toFixed(2)
                )
              : 0
        })
      );

    provinces.sort(
      (a, b) =>
        b.projects - a.projects
    );

    res.json({
      success: true,
      provinces
    });
  } catch (error) {
    console.error(
      "Province summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch province summary"
    });
  }
};

module.exports = {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
};