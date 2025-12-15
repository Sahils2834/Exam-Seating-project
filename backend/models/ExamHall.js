const mongoose = require("mongoose");

const examHallSchema = new mongoose.Schema(
  {
    hallName: { type: String, required: true },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamHall", examHallSchema);
