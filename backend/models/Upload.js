const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: String,
    originalName: String,
    size: Number,
    path: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
