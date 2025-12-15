const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const examRoutes = require("./routes/examRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

app.use(express.json());
app.use(cors());

async function ensureAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminEmail || !adminPass) {
      console.log("Admin credentials missing in .env");
      return;
    }

    console.log("Creating / Ensuring admin...");

    const hash = await bcrypt.hash(adminPass, 10);

    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Administrator",
        email: adminEmail,
        password: hash,
        role: "admin",
      },
      { new: true, upsert: true }
    );

    console.log("Admin ready:", admin.email);

  } catch (err) {
    console.error("ensureAdmin ERROR:", err.message);
  }
}

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teachers", teacherRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await ensureAdmin(); // ensure admin exists

    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
