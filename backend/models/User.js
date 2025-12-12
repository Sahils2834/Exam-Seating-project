const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, enum: ['admin','teacher','student'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
