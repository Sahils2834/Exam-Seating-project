const StudentProfile = require("../models/StudentProfile");
const Exam = require("../models/Exam");
const SeatingPlan = require("../models/SeatingPlan");

/**
 * GET STUDENT PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile
      .findOne({ user: req.user._id })
      .populate("user", "name email role");

    if (!profile) {
      return res.json({
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        },
        rollNumber: req.user.rollNumber || "",
        course: "",
        year: "",
        phone: ""
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("GET STUDENT PROFILE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * UPDATE STUDENT PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["rollNumber", "course", "year", "phone"];

    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new StudentProfile({ user: req.user._id });
    }

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    const updated = await StudentProfile
      .findOne({ user: req.user._id })
      .populate("user", "name email role");

    res.json(updated);
  } catch (err) {
    console.error("UPDATE STUDENT PROFILE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * STUDENT DASHBOARD
 */
exports.getDashboard = async (req, res) => {
  try {
    const examsCount = await Exam.countDocuments({ isPublished: true });

    const seating = await SeatingPlan.findOne({
      "allocations.student": req.user._id
    });

    res.json({
      student: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rollNumber: req.user.rollNumber || ""
      },
      examsCount,
      hasSeating: !!seating
    });
  } catch (err) {
    console.error("STUDENT DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET STUDENT EXAMS
 */
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error("STUDENT EXAMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET STUDENT SEATING
 */
exports.getSeating = async (req, res) => {
  try {
    const plan = await SeatingPlan.findOne({
      "allocations.student": req.user._id
    }).populate("exam hall");

    if (!plan) {
      return res.json({ message: "No seating assigned yet" });
    }

    res.json({ plan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

