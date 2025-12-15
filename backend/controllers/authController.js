const User = require("../models/User");
const AllowedUser = require("../models/AllowedUser");
const RegistrationRequest = require("../models/RegistrationRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber)
      return res.status(400).json({ message: "Roll number required" });

    const user = await User.findOne({ rollNumber, role: "student" });

    if (!user)
      return res.status(400).json({ message: "Invalid student ID" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerRequest = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, designation } = req.body;

    if (!name || !password || !role)
      return res.status(400).json({ message: "Missing fields" });

    if (role === "student" && !rollNumber)
      return res.status(400).json({ message: "Roll Number required" });

    if (role === "teacher" && !email)
      return res.status(400).json({ message: "Email required" });

    const allowed = await AllowedUser.findOne({
      identifier: role === "student" ? rollNumber : email,
      role,
    });

    if (!allowed)
      return res.status(400).json({
        message: "You are not in the allowed list. Contact admin.",
      });

    const existingReq = await RegistrationRequest.findOne({
      email,
      status: "pending",
    });
    if (existingReq)
      return res.status(400).json({ message: "Request already submitted" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    await RegistrationRequest.create({
      name,
      email,
      rollNumber,
      role,
      designation,
      passwordHash,
      status: "pending",
    });

    res.json({
      message: "Registration request submitted. Await admin approval.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
