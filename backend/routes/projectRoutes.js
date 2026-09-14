const express = require("express");
const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Projects fetched successfully",
            projects: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// GET single project
router.get("/:id", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Project fetched successfully",
            project: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// CREATE project
router.post("/", async (req, res) => {
    try {
        const {
            name,
            description,
            province,
            district,
            municipality,
            contractor,
            budget,
            progress,
            status,
            startDate,
            expectedEndDate,
            isPublished
        } = req.body;

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: {
                name,
                description,
                province,
                district,
                municipality,
                contractor,
                budget,
                progress,
                status,
                startDate,
                expectedEndDate,
                isPublished
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// UPDATE project
router.put("/:id", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Project updated successfully",
            projectId: req.params.id,
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// DELETE project
router.delete("/:id", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Project deleted successfully",
            projectId: req.params.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;