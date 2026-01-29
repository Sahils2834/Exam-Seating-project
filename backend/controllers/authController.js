const User = require("../models/User");
const AllowedUser = require("../models/AllowedUser");
const RegistrationRequest = require("../models/RegistrationRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * ==============================
 * ADMIN / TEACHER LOGIN
 * ==============================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        rollNumber: user.rollNumber || null
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ==============================
 * STUDENT LOGIN (ROLL / EMAIL)
 * AUTO-CREATE IF IN AllowedUser
 * ==============================
 */
exports.studentLogin = async (req, res) => {
  try {
    const identifier = req.body.studentId || req.body.identifier;

    if (!identifier)
      return res.status(400).json({ message: "Student ID or Email required" });

    const search = identifier.trim().toLowerCase();

    // Try existing student
    let user = await User.findOne({
      role: "student",
      $or: [{ rollNumber: search }, { email: search }]
    });

    // If not found → check allowed list
    if (!user) {
      const allowed = await AllowedUser.findOne({
        identifier: search,
        role: "student"
      });

      if (!allowed) {
        return res.status(403).json({ message: "Student not allowed" });
      }

      // Auto-create student account
      user = await User.create({
        name: allowed.name || "Student",
        email: search.includes("@") ? search : `${search}@students.local`,
        role: "student",
        rollNumber: search,
        password: await bcrypt.hash("student-temp", 10)
      });

      console.log("✅ AUTO-CREATED STUDENT:", search);
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Student login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ==============================
 * REGISTRATION REQUEST
 * ==============================
 */
exports.registerRequest = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, designation } = req.body;

    if (!name || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });

    if (role === "student" && !rollNumber)
      return res.status(400).json({ message: "Roll Number required" });

    if (role === "teacher" && !email)
      return res.status(400).json({ message: "Email required" });

    // Allowed user check
    const allowed = await AllowedUser.findOne({
      identifier: role === "student" ? rollNumber : email,
      role
    });

    if (!allowed)
      return res.status(403).json({ message: "Not in allowed list" });

    // Prevent duplicate request
    const existingReq = await RegistrationRequest.findOne({
      $or: [{ email }, { rollNumber }],
      status: "pending"
    });

    if (existingReq)
      return res.status(400).json({ message: "Request already exists" });

    // Prevent duplicate user
    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    await RegistrationRequest.create({
      name,
      email,
      rollNumber,
      role,
      designation,
      passwordHash,
      status: "pending"
    });

    res.json({
      message: "Registration submitted. Await admin approval."
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
