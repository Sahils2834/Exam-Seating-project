const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const examRoutes = require("./routes/examRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * =========================
 * STATIC FILES (UPLOADS)
 * =========================
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * =========================
 * AUTO CREATE ADMIN
 * =========================
 */
async function ensureAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminEmail || !adminPass) {
      console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASS missing in .env");
      return;
    }

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log("✅ Admin already exists:", adminEmail);
      return;
    }

    const hash = await bcrypt.hash(adminPass, 10);

    await User.create({
      name: "Administrator",
      email: adminEmail,
      password: hash,
      role: "admin"
    });

    console.log("✅ Admin account created:", adminEmail);

  } catch (err) {
    console.error("❌ ensureAdmin ERROR:", err.message);
  }
}

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teachers", teacherRoutes);


/**
 * =========================
 * 404 HANDLER
 * =========================
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.stack || err);
  res.status(500).json({ message: "Internal server error" });
});

/**
 * =========================
 * DATABASE CONNECT
 * =========================
 */
mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true
})
.then(async () => {
  console.log("✅ MongoDB connected");

  await ensureAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});
