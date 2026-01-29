const TeacherProfile = require("../models/TeacherProfile");

/**
 * GET TEACHER PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    let profile = await TeacherProfile.findOne({ user: req.user._id })
      .populate("user", "name email role");

    if (!profile) {
      profile = await TeacherProfile.create({ user: req.user._id });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/**
 * UPDATE TEACHER PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["department", "designation", "phone", "experience"];

    let profile = await TeacherProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new TeacherProfile({ user: req.user._id });
    }

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    const updated = await TeacherProfile
      .findOne({ user: req.user._id })
      .populate("user", "name email role");

    res.json(updated);

  } catch (err) {
    console.error("UPDATE TEACHER PROFILE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
