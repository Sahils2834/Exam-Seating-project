const mongoose = require("mongoose");

const AllocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rollNumber: String,
  seatNumber: String,
  row: Number,
  col: Number
});

const SeatingPlanSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  examName: String,
  hall: { type: mongoose.Schema.Types.ObjectId, ref: "ExamHall" },
  allocations: [AllocationSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("SeatingPlan", SeatingPlanSchema);
