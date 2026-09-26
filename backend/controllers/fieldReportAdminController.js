const FieldReport =
  require("../models/FieldReport");

const createFieldReport =
  async (req, res) => {
    try {
      const {
        project,
        title,
        description,
        reportedProgress,
        location,
        observations
      } = req.body;

      if (!project) {
        return res.status(400).json({
          success: false,
          message: "Project is required"
        });
      }

      const report =
        await FieldReport.create({
          project,
          title,
          description,
          reportedProgress,
          location,
          observations,
          submittedBy:
            req.user._id
        });

      res.status(201).json({
        success: true,
        message:
          "Field report created successfully",
        report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to create field report",
        error: error.message
      });
    }
  };

const updateFieldReport =
  async (req, res) => {
    try {
      const report =
        await FieldReport.findById(
          req.params.id
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            "Field report not found"
        });
      }

      const fields = [
        "title",
        "description",
        "reportedProgress",
        "location",
        "observations",
        "status"
      ];

      fields.forEach(field => {
        if (
          req.body[field] !== undefined
        ) {
          report[field] =
            req.body[field];
        }
      });

      await report.save();

      res.json({
        success: true,
        message:
          "Field report updated successfully",
        report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update field report",
        error: error.message
      });
    }
  };

module.exports = {
  createFieldReport,
  updateFieldReport
};