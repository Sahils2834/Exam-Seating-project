const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const Upload = require("../models/Upload");
const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");

router.use(authMiddleware, requireRole("teacher"));

router.get("/profile", async (req, res) => {
  try {
    let profile = await TeacherProfile
      .findOne({ user: req.user._id })
      .populate("user", "name email");

    if (!profile) {
      profile = {
        user: await User.findById(req.user._id).select("name email"),
        department: ""
      };
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/uploads", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const total = await Upload.countDocuments({ uploader: req.user._id });

    const items = await Upload.find({ uploader: req.user._id })
      .populate("exam")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      items,
      page,
      total,
      limit
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
