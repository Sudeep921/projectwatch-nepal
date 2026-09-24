const Project = require("../models/Project");

const getPublicProjects = async (req, res) => {
  try {
    const {
      search,
      province,
      status,
      riskLevel
    } = req.query;

    const filter = {
      isPublic: {
        $ne: false
      }
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          projectCode: {
            $regex: search,
            $options: "i"
          }
        },
        {
          district: {
            $regex: search,
            $options: "i"
          }
        },
        {
          municipality: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (province && province !== "All Provinces") {
      filter.province = province;
    }

    if (status && status !== "All Status") {
      filter.status = status;
    }

    if (riskLevel && riskLevel !== "All Risk") {
      filter.riskLevel = riskLevel;
    }

    const projects = await Project.find(filter)
      .select(
        "name projectCode province district municipality budget progress status riskLevel description startDate expectedEndDate contractor location latitude longitude updatedAt"
      )
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Public projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch public projects"
    });
  }
};

const getPublicProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      isPublic: {
        $ne: false
      }
    }).select("-__v");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Public project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Public project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch public project"
    });
  }
};

const getPublicSummary = async (req, res) => {
  try {
    const projects = await Project.find({
      isPublic: {
        $ne: false
      }
    }).select(
      "status riskLevel budget progress province"
    );

    const totalProjects = projects.length;

    const activeProjects = projects.filter(
      (project) =>
        project.status === "Active"
    ).length;

    const delayedProjects = projects.filter(
      (project) =>
        project.status === "Delayed"
    ).length;

    const completedProjects = projects.filter(
      (project) =>
        project.status === "Completed"
    ).length;

    const criticalProjects = projects.filter(
      (project) =>
        project.status === "Critical" ||
        project.riskLevel === "Critical"
    ).length;

    const totalBudget = projects.reduce(
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

    const provinceMap = {};

    projects.forEach((project) => {
      const province =
        project.province || "Unknown";

      if (!provinceMap[province]) {
        provinceMap[province] = {
          province,
          projects: 0,
          budget: 0,
          progress: 0
        };
      }

      provinceMap[province].projects += 1;

      provinceMap[province].budget +=
        Number(project.budget || 0);

      provinceMap[province].progress +=
        Number(project.progress || 0);
    });

    const provinces = Object.values(
      provinceMap
    ).map((item) => ({
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
    }));

    res.json({
      success: true,
      summary: {
        totalProjects,
        activeProjects,
        delayedProjects,
        completedProjects,
        criticalProjects,
        totalBudget,
        averageProgress:
          Number(averageProgress.toFixed(2)),
        provinces
      }
    });
  } catch (error) {
    console.error("Public summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate public summary"
    });
  }
};

module.exports = {
  getPublicProjects,
  getPublicProject,
  getPublicSummary
};