const AllowedUser = require("../models/AllowedUser");
const RegistrationRequest = require("../models/RegistrationRequest");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const { sendMail } = require("../utils/smtp");

/**
 * ============================
 * ADD ALLOWED USER
 * ============================
 */
exports.addAllowed = async (req, res) => {
  try {
    let { identifier, role, name, designation } = req.body;

    if (!identifier || !role) {
      return res.status(400).json({ message: "Identifier & role required" });
    }

    identifier = identifier.trim().toLowerCase();

    const exists = await AllowedUser.findOne({ identifier, role });
    if (exists) {
      return res.status(400).json({ message: "Already exists in allowed list" });
    }

    const item = await AllowedUser.create({
      identifier,
      role,
      name: name || "",
      designation: designation || "",
      createdBy: req.user._id
    });

    res.json({ message: "Allowed user added", item });

  } catch (err) {
    console.error("ADD ALLOWED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ============================
 * LIST ALLOWED USERS
 * ============================
 */
exports.listAllowed = async (req, res) => {
  try {
    const users = await AllowedUser.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("LIST ALLOWED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ============================
 * REMOVE ALLOWED USER
 * ============================
 */
exports.removeAllowed = async (req, res) => {
  try {
    const deleted = await AllowedUser.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Allowed user not found" });
    }

    res.json({ message: "Removed successfully" });

  } catch (err) {
    console.error("REMOVE ALLOWED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ============================
 * LIST REGISTRATION REQUESTS
 * ============================
 */
exports.listRequests = async (req, res) => {
  try {
    const list = await RegistrationRequest.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    console.error("LIST REQUESTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ============================
 * APPROVE REQUEST
 * ============================
 */
exports.approveRequest = async (req, res) => {
  try {
    const r = await RegistrationRequest.findById(req.params.id);

    if (!r)
      return res.status(404).json({ message: "Request not found" });

    if (r.status === "approved")
      return res.status(400).json({ message: "Already approved" });

    let email = (r.email || "").toLowerCase();
    if (r.role === "student" && !email) {
      email = `${r.rollNumber}@students.local`;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber: r.rollNumber }]
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // ✅ Create actual user
    const user = await User.create({
      name: r.name,
      email,
      password: r.passwordHash,
      role: r.role,
      rollNumber: r.role === "student" ? r.rollNumber : undefined,
      designation: r.role === "teacher" ? r.designation : undefined
    });

    // ✅ ADD TO ALLOWED USERS
    await AllowedUser.create({
      identifier: r.role === "student" ? r.rollNumber : email,
      role: r.role,
      name: r.name,
      designation: r.designation || "",
      createdBy: req.user._id
    });

    r.status = "approved";
    await r.save();

    res.json({
      message: "User approved & activated successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ============================
 * REJECT REQUEST
 * ============================
 */
exports.rejectRequest = async (req, res) => {
  try {
    const rejected = await RegistrationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!rejected) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request rejected successfully" });

  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * ============================
 * ADMIN DASHBOARD STATS
 * ============================
 */
exports.getStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const result = {
      admin: 0,
      teacher: 0,
      student: 0
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
    });

    res.json(result);

  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ============================
 * LIST REAL TEACHERS
 * ============================
 */
exports.listTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("_id name email");

    res.json(teachers);

  } catch (err) {
    console.error("LIST TEACHERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
