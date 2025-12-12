const mongoose = require('mongoose');

const allowedSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or rollNumber
  role: { type: String, enum: ['teacher','student'], required: true },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('AllowedUser', allowedSchema);
