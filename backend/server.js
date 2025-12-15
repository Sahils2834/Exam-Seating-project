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

    console.log("ensureAdmin() started");
    console.log("Admin email:", adminEmail);

    const hash = await bcrypt.hash(adminPass, 10);
    console.log("HASH THAT SHOULD BE SAVED:", hash);

    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Administrator",
        email: adminEmail,
        password: hash,
        role: "admin"
      },
      { new: true, upsert: true }
    );

    console.log("ADMIN UPSERT RESULT:", admin);

  } catch (err) {
    console.error("ensureAdmin ERROR:", err.message);
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await ensureAdmin(); // make sure admin exists

    app.listen(process.env.PORT, () => {
      console.log("Server running on", process.env.PORT);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
