const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: true   // IMPORTANT: allow writes & reads for admin setup
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },

    rollNumber: {
      type: String,
      sparse: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
