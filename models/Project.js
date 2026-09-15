const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
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
            required: true
        },

        district: {
            type: String,
            required: true
        },

        municipality: {
            type: String,
            required: true
        },

        contractor: {
            type: String,
            required: true
        },

        budget: {
            type: Number,
            required: true
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

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

        description: {
            type: String,
            default: ""
        },

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);