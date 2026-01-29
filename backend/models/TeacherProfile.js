const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    department: {
      type: String,
      default: ""
    },

    designation: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    experience: {
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

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema);
