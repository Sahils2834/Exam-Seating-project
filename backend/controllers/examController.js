const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const Exam = require("../models/Exam");
const Upload = require("../models/Upload");

exports.createExam = async (req, res) => {
  try {
    const exam = await new Exam({
      title: req.body.title,
      date: req.body.date,
      createdBy: req.user._id,
      seating: []
    }).save();

    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSeats = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { seating: req.body.seating },
      { new: true }
    );
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.importCSV = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No CSV uploaded" });

    const csv = req.file.buffer.toString();
    const parsed = Papa.parse(csv, { header: true });

    if (parsed.errors.length)
      return res.status(400).json({ message: "Invalid CSV format" });

    const seating = parsed.data.map(row => ({
      rollNumber: row.rollNumber,
      seat: row.seat
    }));

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { seating },
      { new: true }
    );

    res.json({ message: "CSV imported", exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const examId = req.params.id;
    const uploadDir = path.join(__dirname, "../uploads", examId);

    if (!fs.existsSync(uploadDir))
      fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}_${req.file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    const fileRecord = await new Upload({
      exam: examId,
      uploader: req.user._id,
      filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: `/uploads/${examId}/${filename}`
    }).save();

    res.json({ message: "Uploaded", file: fileRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const files = await Upload.find({ exam: req.params.id }).sort({
      createdAt: -1
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam)
      return res.status(404).json({ message: "Exam not found" });

    const csv = Papa.unparse(exam.seating);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=seating.csv");

    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
