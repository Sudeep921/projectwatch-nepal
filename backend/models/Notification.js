const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true
      },

      message: {
        type: String,
        required: true
      },

      type: {
        type: String,
        enum: [
          "Info",
          "Success",
          "Warning",
          "Danger"
        ],
        default: "Info"
      },

      read: {
        type: Boolean,
        default: false
      },

      project: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );