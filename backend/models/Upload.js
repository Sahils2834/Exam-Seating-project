const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      default: 0
    },

    path: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      default: ""
    },

    uploadType: {
      type: String,
      enum: ["seating", "exam", "results", "other"],
      default: "other"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
