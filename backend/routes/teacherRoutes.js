const express = require("express");
const router = express.Router();

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const teacherController = require("../controllers/teacherController");
const Upload = require("../models/Upload");
const Exam = require("../models/Exam");

router.use(authMiddleware);
router.use(requireRole("teacher"));

/* PROFILE */
router.get("/profile", teacherController.getProfile);
router.put("/profile", teacherController.updateProfile);

/* UPLOAD HISTORY */
router.get("/uploads", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.max(Number(req.query.limit || 10), 1);

    const query = { uploader: req.user._id };
    if (req.query.exam) query.exam = req.query.exam;

    const total = await Upload.countDocuments(query);

    const items = await Upload.find(query)
      .populate("exam")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ items, page, total, limit });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ASSIGNED EXAMS */
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find({
      assignedTeachers: req.user._id
    }).sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    console.error("TEACHER EXAMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* DASHBOARD */
router.get("/dashboard", async (req, res) => {
  try {
    const examsCount = await Exam.countDocuments({
      assignedTeachers: req.user._id
    });

    const uploadsCount = await Upload.countDocuments({
      uploader: req.user._id
    });

    res.json({
      examsCount,
      uploadsCount,
      teacher: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });

  } catch (err) {
    console.error("TEACHER DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
