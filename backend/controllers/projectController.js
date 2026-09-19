const Project = require("../models/Project");
const { calculateRisk } = require("../services/riskService");
const Alert = require("../models/Alert");

// ===============================
// CREATE PROJECT
// ===============================
const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body
    };

    projectData.riskLevel = calculateRisk(projectData);

    const project = await Project.create(projectData);

    // Critical project भए alert create गर्ने
    if (project.riskLevel === "Critical") {
      await Alert.create({
        project: project._id,
        title: "Critical project risk detected",
        message: `Potential high-risk condition detected for ${project.projectName}. Human review is recommended.`,
        type: "Critical Risk",
        severity: "Critical"
      });
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// GET PUBLIC PROJECTS
// ===============================
const getPublicProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            isPublished: true
        })
            .select(
                "projectName projectCode province district municipality contractor budget progress status riskLevel description startDate endDate"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error("Public projects error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET ALL PROJECTS
// SEARCH + FILTER + PAGINATION
// ===============================
const getProjects = async (req, res) => {
    try {
        const {
            search,
            province,
            district,
            municipality,
            status,
            riskLevel,
            page = 1,
            limit = 10
        } = req.query;

        // ===============================
        // FILTER OBJECT
        // ===============================
        const filter = {};


        // ===============================
        // SEARCH
        // ===============================
        if (search) {
            filter.$or = [
                {
                    projectName: {
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
                    contractor: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        // ===============================
        // PROVINCE FILTER
        // ===============================
        if (province) {
            filter.province = province;
        }


        // ===============================
        // DISTRICT FILTER
        // ===============================
        if (district) {
            filter.district = district;
        }


        // ===============================
        // MUNICIPALITY FILTER
        // ===============================
        if (municipality) {
            filter.municipality = municipality;
        }


        // ===============================
        // STATUS FILTER
        // ===============================
        if (status) {
            filter.status = status;
        }


        // ===============================
        // RISK LEVEL FILTER
        // ===============================
        if (riskLevel) {
            filter.riskLevel = riskLevel;
        }


        // ===============================
        // PAGINATION
        // ===============================
        const currentPage = Math.max(Number(page) || 1, 1);
        const perPage = Math.max(Number(limit) || 10, 1);

        const skip = (currentPage - 1) * perPage;


        // ===============================
        // GET PROJECTS
        // ===============================
        const projects = await Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);


        // ===============================
        // TOTAL PROJECTS
        // ===============================
        const total = await Project.countDocuments(filter);


        // ===============================
        // RESPONSE
        // ===============================
        res.status(200).json({
            success: true,

            count: projects.length,

            total,

            page: currentPage,

            limit: perPage,

            totalPages: Math.ceil(total / perPage),

            projects
        });

    } catch (error) {
        console.error("Get projects error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET SINGLE PROJECT
// ===============================
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        console.error("Get single project error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// UPDATE PROJECT
// ===============================
const updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const updatedData = {
      ...existingProject.toObject(),
      ...req.body
    };

    updatedData.riskLevel = calculateRisk(updatedData);

    delete updatedData._id;
    delete updatedData.__v;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    if (project.riskLevel === "Critical") {
      await Alert.create({
        project: project._id,
        title: "Project risk requires review",
        message: `Potential discrepancy or critical risk detected for ${project.projectName}. Human review is recommended.`,
        type: "Critical Risk",
        severity: "Critical"
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      project
    });

  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===============================
// DELETE PROJECT
// ===============================
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    getPublicProjects
};