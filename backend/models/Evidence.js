// const mongoose = require("mongoose");

// const evidenceSchema = new mongoose.Schema(
//   {
//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true
//     },

//     fieldReport: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "FieldReport",
//       default: null
//     },

//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     fileName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     filePath: {
//       type: String,
//       required: true
//     },

//     fileType: {
//       type: String,
//       enum: ["image", "video", "document"],
//       required: true
//     },

//     mimeType: {
//       type: String,
//       default: ""
//     },

//     fileSize: {
//       type: Number,
//       default: 0
//     },

//     description: {
//       type: String,
//       default: ""
//     },

//     location: {
//       type: String,
//       default: ""
//     },

//     latitude: {
//       type: Number
//     },

//     longitude: {
//       type: Number
//     },

//     capturedAt: {
//       type: Date
//     },

//     verificationStatus: {
//       type: String,
//       enum: [
//         "Pending",
//         "Verified",
//         "Rejected",
//         "Needs Human Review"
//       ],
//       default: "Pending"
//     },

//     verificationNote: {
//       type: String,
//       default: ""
//     },

//     aiStatus: {
//       type: String,
//       enum: [
//         "Not Checked",
//         "Processing",
//         "Verified",
//         "Potential Discrepancy"
//       ],
//       default: "Not Checked"
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model("Evidence", evidenceSchema);

const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    fieldReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldReport",
      default: null
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true,
      trim: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      enum: ["image", "video", "document"],
      required: true
    },

    mimeType: {
      type: String,
      default: ""
    },

    fileSize: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    },

    capturedAt: {
      type: Date
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Rejected",
        "Needs Human Review"
      ],
      default: "Pending"
    },

    verificationNote: {
      type: String,
      default: ""
    },

    aiStatus: {
      type: String,
      enum: [
        "Not Checked",
        "Processing",
        "Verified",
        "Potential Discrepancy"
      ],
      default: "Not Checked"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Evidence", evidenceSchema);