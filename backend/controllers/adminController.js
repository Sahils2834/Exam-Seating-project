const AllowedUser = require("../models/AllowedUser");
const RegistrationRequest = require("../models/RegistrationRequest");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const { sendMail } = require("../utils/smtp");

exports.addAllowed = async (req, res) => {
  try {
    const { identifier, role, name, designation } = req.body;

    if (!identifier || !role)
      return res.status(400).json({ message: "Identifier & role required" });

    const exists = await AllowedUser.findOne({ identifier, role });
    if (exists) return res.status(400).json({ message: "Already exists" });

    const item = await AllowedUser.create({
      identifier,
      role,
      name,
      designation,
      createdBy: req.user._id,
    });

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listAllowed = async (req, res) => {
  try {
    const users = await AllowedUser.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeAllowed = async (req, res) => {
  try {
    await AllowedUser.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const list = await RegistrationRequest.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const r = await RegistrationRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Request not found" });

    let email = r.email;
    if (r.role === "student" && !email)
      email = `${r.rollNumber}@students.local`;

    const user = await User.create({
      name: r.name,
      email,
      password: r.passwordHash,
      role: r.role,
      rollNumber: r.role === "student" ? r.rollNumber : undefined,
      designation: r.role === "teacher" ? r.designation : undefined,
    });

    if (r.role === "student") {
      await StudentProfile.create({
        user: user._id,
        rollNumber: r.rollNumber,
      });
    }

    r.status = "approved";
    await r.save();

    sendMail({
      to: email,
      subject: "Account Approved",
      text: `Hello ${r.name}, your account has been approved.`,
    });

    res.json({ message: "User approved", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    await RegistrationRequest.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Request rejected" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const result = {};
  stats.forEach((s) => (result[s._id] = s.count));

  res.json(result);

} catch (err) {
  res.status(500).json({ error: err.message });
}
};
