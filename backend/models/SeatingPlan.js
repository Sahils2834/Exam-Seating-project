const mongoose = require("mongoose");

/**
 * INDIVIDUAL SEAT ALLOCATION
 */
const allocationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rollNumber: {
      type: String,
      default: ""
    },

    seatNumber: {
      type: String,
      required: true
    },

    row: {
      type: Number,
      default: 0
    },

    col: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

/**
 * SEATING PLAN PER EXAM
 */
const seatingPlanSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    examName: {
      type: String,
      required: true
    },

    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamHall",
      required: true,
      default: null
    },

    allocations: [allocationSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeatingPlan", seatingPlanSchema);
