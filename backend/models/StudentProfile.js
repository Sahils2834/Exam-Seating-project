const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    course: {
      type: String,
      default: ""
    },

    year: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    extra: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
