const Alert =
  require("../models/Alert");

const Project =
  require("../models/Project");

const {
  calculateRisk,
  getRiskMessage
} = require("../services/riskService");

const getAlerts =
  async (req, res) => {
    try {
      const alerts =
        await Alert.find()
          .populate(
            "project",
            "name projectCode status progress riskLevel"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        alerts
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to load alerts"
      });
    }
  };

const createAlert =
  async (req, res) => {
    try {
      const {
        project,
        type,
        title,
        message,
        severity
      } = req.body;

      const alert =
        await Alert.create({
          project,
          type:
            type || "Risk",
          title,
          message,
          severity:
            severity || "Medium",
          status: "Open"
        });

      res.status(201).json({
        success: true,
        alert
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to create alert"
      });
    }
  };

const updateAlert =
  async (req, res) => {
    try {
      const alert =
        await Alert.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      res.json({
        success: true,
        alert
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update alert"
      });
    }
  };

const generateProjectAlerts =
  async (req, res) => {
    try {
      const projects =
        await Project.find();

      const generated = [];

      for (const project of projects) {
        const risk =
          calculateRisk(project);

        project.riskLevel = risk;

        await project.save();

        if (
          risk === "High" ||
          risk === "Critical"
        ) {
          const exists =
            await Alert.findOne({
              project:
                project._id,
              status: "Open",
              type: "Risk"
            });

          if (!exists) {
            const alert =
              await Alert.create({
                project:
                  project._id,

                type: "Risk",

                title:
                  `${risk} Risk Project`,

                message:
                  getRiskMessage(risk),

                severity: risk,

                status: "Open"
              });

            generated.push(alert);
          }
        }
      }

      res.json({
        success: true,
        count:
          generated.length,
        alerts:
          generated
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to generate project alerts"
      });
    }
  };

const resolveAlert =
  async (req, res) => {
    try {
      const alert =
        await Alert.findByIdAndUpdate(
          req.params.id,
          {
            status: "Resolved",
            resolvedAt:
              new Date()
          },
          {
            new: true
          }
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      res.json({
        success: true,
        alert
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to resolve alert"
      });
    }
  };

module.exports = {
  getAlerts,
  createAlert,
  updateAlert,
  generateProjectAlerts,
  resolveAlert
};