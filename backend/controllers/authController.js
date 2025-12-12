const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const AllowedUser = require('../models/AllowedUser');
const RegistrationRequest = require('../models/RegistrationRequest');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/smtp');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber } = req.body;
    if (!name || !password || !role) return res.status(400).json({ message: 'name, password, role required' });

    const identifier = role === 'student' ? (rollNumber || email) : email;

    const allowed = await AllowedUser.findOne({ identifier, role });

    const hashed = await bcrypt.hash(password, 10);

    if (allowed) {
      const user = new User({ name, email, password: hashed, role });
      await user.save();
      if (role === 'student') {
        const sp = new StudentProfile({ user: user._id, rollNumber });
        await sp.save();
      }
      if (email) {
        try { await sendMail({ to: email, subject: 'Welcome', text: `Your account has been created as ${role}` }); } catch(e){ console.warn('mail fail', e.message); }
      }
      return res.json({ message: 'Registered', user: { id: user._id, name: user.name, role: user.role }});
    } else {
      const reqDoc = new RegistrationRequest({ name, email, rollNumber, role, passwordHash: hashed });
      await reqDoc.save();
      return res.json({ message: 'Registration pending admin approval', requestId: reqDoc._id });
    }
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate user or roll number' });
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (studentId) {
      const profile = await StudentProfile.findOne({ rollNumber: studentId }).populate('user');
      if (!profile) return res.status(400).json({ message: 'Invalid studentId' });
      let user = profile.user;
      if (!user) {
        user = await new User({ name: `Student ${profile.rollNumber}`, email: `${profile.rollNumber}@students.local`, password: 'student-noop', role: 'student' }).save();
        profile.user = user._id; await profile.save();
      }
      const token = generateToken(user._id, 'student');
      return res.json({ token, user: { id: user._id, name: user.name, role: 'student' }, profile });
    } else if (req.body.email && password) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
      const token = generateToken(user._id, user.role);
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }});
    } else {
      return res.status(400).json({ message: 'studentId or (email+password) required' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
