const Verification =
  require("../models/Verification");

const Evidence =
  require("../models/Evidence");

const Project =
  require("../models/Project");

const {
  analyzeEvidence
} = require(
  "../services/aiVerificationService"
);

const getVerifications =
  async (req, res) => {
    try {
      const verifications =
        await Verification.find()
          .populate(
            "project",
            "name projectId progress status"
          )
          .populate(
            "evidence"
          )
          .populate(
            "verifiedBy",
            "name email role"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        count:
          verifications.length,
        verifications
      });
    } catch (error) {
      console.error(
        "Get verifications error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch verifications"
      });
    }
  };

const createVerification =
  async (req, res) => {
    try {
      const {
        project,
        evidence,
        reportedProgress,
        verificationStatus,
        notes
      } = req.body;

      if (!project) {
        return res.status(400).json({
          success: false,
          message:
            "Project is required"
        });
      }

      const projectData =
        await Project.findById(
          project
        );

      if (!projectData) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found"
        });
      }

      const analysis =
        await analyzeEvidence({
          projectProgress:
            projectData.progress,
          reportedProgress,
          evidenceType:
            evidence
              ? "Evidence"
              : null
        });

      const verification =
        await Verification.create({
          project,
          evidence:
            evidence || undefined,
          reportedProgress:
            reportedProgress !==
            undefined
              ? Number(
                  reportedProgress
                )
              : undefined,
          status:
            verificationStatus ||
            analysis.status,
          result:
            analysis.message,
          difference:
            analysis.difference,
          notes:
            notes || "",
          verifiedBy:
            req.user?.id ||
            req.user?._id
        });

      res.status(201).json({
        success: true,
        message:
          "Verification created successfully",
        verification,
        analysis
      });
    } catch (error) {
      console.error(
        "Create verification error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create verification"
      });
    }
  };

module.exports = {
  getVerifications,
  createVerification
};