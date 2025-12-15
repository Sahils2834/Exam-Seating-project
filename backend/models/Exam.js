const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    date: Date,
    halls: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamHall" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
