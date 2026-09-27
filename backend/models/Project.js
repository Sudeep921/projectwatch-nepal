const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        // ==========================================
        // PROJECT INFORMATION
        // ==========================================

        projectName: {
            type: String,
            required: true,
            trim: true
        },

        projectCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        province: {
            type: String,
            required: true,
            trim: true
        },

        district: {
            type: String,
            required: true,
            trim: true
        },

        municipality: {
            type: String,
            required: true,
            trim: true
        },

        contractor: {
            type: String,
            required: true,
            trim: true
        },

        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // ==========================================
        // FINANCIAL INFORMATION
        // ==========================================

        budget: {
            type: Number,
            required: true,
            min: 0
        },

        // ==========================================
        // PROJECT PROGRESS
        // ==========================================

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // ==========================================
        // PROJECT STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "Active",
                "Delayed",
                "Completed",
                "Critical"
            ],
            default: "Active"
        },

        // ==========================================
        // RISK LEVEL
        // ==========================================

        riskLevel: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: "Low"
        },

        // ==========================================
        // DESCRIPTION
        // ==========================================

        description: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // PROJECT LOCATION TEXT
        // ==========================================

        location: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // MAP COORDINATES
        // ==========================================

        latitude: {
            type: Number,
            min: -90,
            max: 90,
            default: null
        },

        longitude: {
            type: Number,
            min: -180,
            max: 180,
            default: null
        },

        // ==========================================
        // PROJECT DATES
        // ==========================================

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
        },

        // ==========================================
        // PUBLIC VISIBILITY
        // ==========================================

        isPublished: {
            type: Boolean,
            default: false
        }
    },

    // ==========================================
    // AUTOMATIC CREATED / UPDATED DATES
    // ==========================================

    {
        timestamps: true
    }
);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports =
    mongoose.model(
        "Project",
        projectSchema
    );