const mongoose = require("mongoose");

const allowedUserSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, trim: true },

    name: { type: String, default: "" },

    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true
    },

    designation: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

allowedUserSchema.index({ identifier: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("AllowedUser", allowedUserSchema);
