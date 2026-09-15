const Project = require("../models/Project");

const getDashboardStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();

        const activeProjects = await Project.countDocuments({
            status: "Active"
        });

        const completedProjects = await Project.countDocuments({
            status: "Completed"
        });

        const delayedProjects = await Project.countDocuments({
            status: "Delayed"
        });

        const criticalProjects = await Project.countDocuments({
            status: "Critical"
        });

        const budgetResult = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    totalBudget: {
                        $sum: "$budget"
                    }
                }
            }
        ]);

        const progressResult = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    averageProgress: {
                        $avg: "$progress"
                    }
                }
            }
        ]);

        const totalBudget =
            budgetResult.length > 0
                ? budgetResult[0].totalBudget
                : 0;

        const averageProgress =
            progressResult.length > 0
                ? progressResult[0].averageProgress
                : 0;

        res.json({
            success: true,
            stats: {
                totalProjects,
                activeProjects,
                completedProjects,
                delayedProjects,
                criticalProjects,
                totalBudget,
                averageProgress: Number(
                    averageProgress.toFixed(2)
                )
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};