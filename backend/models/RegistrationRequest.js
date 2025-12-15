const mongoose = require("mongoose");

const registrationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String },

    rollNumber: { type: String },

    designation: { type: String },

    role: { type: String, enum: ["student", "teacher"], required: true },

    passwordHash: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegistrationRequest", registrationRequestSchema);
