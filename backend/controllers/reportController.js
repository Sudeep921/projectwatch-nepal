const Project =
  require("../models/Project");

const getProjectReport =
  async (req, res) => {
    try {
      const projects =
        await Project.find();

      const totalProjects =
        projects.length;

      const activeProjects =
        projects.filter(
          (project) =>
            project.status ===
            "Active"
        ).length;

      const delayedProjects =
        projects.filter(
          (project) =>
            project.status ===
            "Delayed"
        ).length;

      const completedProjects =
        projects.filter(
          (project) =>
            project.status ===
            "Completed"
        ).length;

      const criticalProjects =
        projects.filter(
          (project) =>
            project.status ===
              "Critical" ||
            project.riskLevel ===
              "Critical"
        ).length;

      const totalBudget =
        projects.reduce(
          (total, project) =>
            total +
            Number(
              project.budget || 0
            ),
          0
        );

      const averageProgress =
        totalProjects > 0
          ? Math.round(
              projects.reduce(
                (
                  total,
                  project
                ) =>
                  total +
                  Number(
                    project.progress ||
                      0
                  ),
                0
              ) /
                totalProjects
            )
          : 0;

      const provinceSummary = {};

      projects.forEach(
        (project) => {
          const province =
            project.province ||
            "Unknown";

          if (
            !provinceSummary[
              province
            ]
          ) {
            provinceSummary[
              province
            ] = {
              province,
              total: 0,
              budget: 0,
              progress: 0
            };
          }

          provinceSummary[
            province
          ].total += 1;

          provinceSummary[
            province
          ].budget += Number(
            project.budget || 0
          );

          provinceSummary[
            province
          ].progress += Number(
            project.progress || 0
          );
        }
      );

      const provinces =
        Object.values(
          provinceSummary
        ).map(
          (item) => ({
            ...item,
            averageProgress:
              item.total > 0
                ? Math.round(
                    item.progress /
                      item.total
                  )
                : 0
          })
        );

      res.json({
        success: true,

        report: {
          totalProjects,
          activeProjects,
          delayedProjects,
          completedProjects,
          criticalProjects,
          totalBudget,
          averageProgress,
          provinces
        }
      });
    } catch (error) {
      console.error(
        "Project report error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to generate project report"
      });
    }
  };

module.exports = {
  getProjectReport
};