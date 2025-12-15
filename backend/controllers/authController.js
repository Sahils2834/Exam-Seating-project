const User = require("../models/User");
const RegistrationRequest = require("../models/RegistrationRequest");
const AllowedUser = require("../models/AllowedUser");
const StudentProfile = require("../models/StudentProfile");

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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.registerRequest = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber } = req.body;

    if (role === "student" && !rollNumber)
      return res.status(400).json({ message: "Roll Number required" });

    const exists = await RegistrationRequest.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    await new RegistrationRequest({
      name,
      email,
      passwordHash,
      rollNumber,
      role,
      status: "pending"
    }).save();

    return res.json({ message: "Registration submitted. Await approval." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    const user = await User.findOne({ rollNumber }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
