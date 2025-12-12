const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: Number,
  col: Number,
  studentName: String,
  studentId: String
});

const examSchema = new mongoose.Schema({
  title: String,
  date: Date,
  venue: String,
  rows: Number,
  cols: Number,
  seats: [seatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
