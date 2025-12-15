const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seatNumber: { type: String, required: true },
  row: Number,
  col: Number
});

const seatingPlanSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: "ExamHall", required: true },
    allocations: [allocationSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeatingPlan", seatingPlanSchema);
