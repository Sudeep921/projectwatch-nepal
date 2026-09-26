const Project =
  require("../models/Project");

const getProjectTimeline =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      const timeline = [];

      if (project.startDate) {
        timeline.push({
          title: "Project Started",
          date: project.startDate,
          status: "completed"
        });
      }

      timeline.push({
        title: "Current Progress",
        date: new Date(),
        progress:
          Number(project.progress || 0),
        status:
          project.status || "Active"
      });

      if (project.endDate) {
        timeline.push({
          title: "Expected Completion",
          date: project.endDate,
          status:
            project.status ===
            "Completed"
              ? "completed"
              : "upcoming"
        });
      }

      res.json({
        success: true,
        project: {
          id: project._id,
          name: project.name,
          status: project.status,
          progress: project.progress
        },
        timeline
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to load project timeline",
        error: error.message
      });
    }
  };

module.exports = {
  getProjectTimeline
};