const TeacherProfile = require('../models/TeacherProfile');

exports.getProfile = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id }).populate('user','name email');
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = await TeacherProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new TeacherProfile({ user: req.user._id, ...req.body });
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
