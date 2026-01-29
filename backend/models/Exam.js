const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    title: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      default: "",
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      default: ""
    },

    room: {
      type: String,
      default: ""
    },

    /* HALLS */
    halls: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ExamHall" }
    ],

    /* CREATOR */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /* ASSIGNED TEACHERS */
    assignedTeachers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    /* ASSIGNED STUDENTS */
    assignedStudents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    /* SEATING FLAGS */
    seatingGenerated: {
      type: Boolean,
      default: false
    },

    seatingUploaded: {
      type: Boolean,
      default: false
    },

    /* STATUS */
    status: {
      type: String,
      enum: ["draft", "scheduled", "completed"],
      default: "scheduled"
    },

    /* PUBLISH CONTROL */
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
