const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  rollNumber: { type: String, unique: true, required: true },
  course: String,
  year: String,
  extra: Object
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
