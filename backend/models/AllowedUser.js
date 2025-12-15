const mongoose = require("mongoose");

const allowedUserSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ["student", "teacher"], required: true },
    designation: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AllowedUser", allowedUserSchema);
