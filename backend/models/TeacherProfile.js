const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  department: String,
  designation: String,
  extra: Object
}, { timestamps: true });

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
