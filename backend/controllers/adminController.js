const AllowedUser = require("../models/AllowedUser");
const RegistrationRequest = require("../models/RegistrationRequest");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const { sendMail } = require("../utils/smtp");

exports.addAllowed = async (req, res) => {
  try {
    const { identifier, role } = req.body;

    if (!identifier || !role)
      return res.status(400).json({ message: "identifier & role are required" });

    const exists = await AllowedUser.findOne({ identifier, role });
    if (exists)
      return res.status(400).json({ message: "Already allowed" });

    const item = await new AllowedUser({
      identifier,
      role,
      createdBy: req.user._id
    }).save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listAllowed = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = q ? { identifier: { $regex: q, $options: "i" } } : {};

    const total = await AllowedUser.countDocuments(filter);
    const items = await AllowedUser.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeAllowed = async (req, res) => {
  await AllowedUser.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed" });
};

exports.listRequests = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: "pending" };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { rollNumber: { $regex: q, $options: "i" } },
      ];
    }

    const total = await RegistrationRequest.countDocuments(filter);
    const items = await RegistrationRequest.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const r = await RegistrationRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Request not found" });

    if (!r.passwordHash)
      return res.status(400).json({ message: "Missing passwordHash" });

    let email = r.email;
    let rollNumber = r.rollNumber;

    if (r.role === "student") {
      if (!rollNumber)
        return res.status(400).json({ message: "Student needs a rollNumber" });
      if (!email) email = `${rollNumber}@students.local`;
    }

    if (r.role === "teacher" && !email)
      return res.status(400).json({ message: "Teacher must have an email" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await new User({
        name: r.name,
        email,
        password: r.passwordHash,
        role: r.role
      }).save();
    }

    if (r.role === "student") {
      const exists = await StudentProfile.findOne({ user: user._id });
      if (!exists) {
        await new StudentProfile({
          user: user._id,
          rollNumber
        }).save();
      }
    }

    r.status = "approved";
    await r.save();

    sendMail({
      to: email,
      subject: "Your account has been approved",
      text: `Hello ${r.name}, your account is now active.`
    }).catch(() => {});

    res.json({ message: "User approved", user });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.rejectRequest = async (req, res) => {
  await RegistrationRequest.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Request rejected" });
};


exports.getStats = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const roleCounts = {};
    users.forEach(u => roleCounts[u._id] = u.count);

    res.json({ roleCounts });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
