const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const Exam = require("../models/Exam");
const Upload = require("../models/Upload");
const ExamHall = require("../models/ExamHall");
const SeatingPlan = require("../models/SeatingPlan");
const User = require("../models/User");

/* ============================
   CREATE EXAM
============================ */
exports.createExam = async (req, res) => {
  try {
    const { title, date, subject, description, room, time } = req.body;

    if (!title || !date)
      return res.status(400).json({ message: "Title and Date required" });

    const exam = await Exam.create({
      title,
      date,
      subject: subject || "",
      description: description || "",
      room: room || "",
      time: time || "",
      createdBy: req.user._id,
      assignedTeachers: [],
      assignedStudents: [],
      isPublished: true
    });

    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   LIST EXAMS (ADMIN)
============================ */
exports.listExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("assignedTeachers", "name email")
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   TEACHER EXAMS
============================ */
exports.listTeacherExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      assignedTeachers: req.user._id
    }).sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   STUDENT EXAMS
============================ */
exports.listPublishedExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isPublished: true })
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   GET EXAM
============================ */
exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("assignedTeachers", "name email");

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   ASSIGN TEACHER
============================ */
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId)
      return res.status(400).json({ message: "Teacher ID required" });

    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher")
      return res.status(400).json({ message: "Invalid teacher" });

    if (!exam.assignedTeachers.includes(teacherId)) {
      exam.assignedTeachers.push(teacherId);
      await exam.save();
    }

    res.json({ message: "Teacher assigned", exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   GENERATE AUTO SEATING
============================ */
exports.generateSeating = async (req, res) => {
  try {
    const { examId, hallId } = req.body;

    const exam = await Exam.findById(examId);
    const hall = await ExamHall.findById(hallId);

    if (!exam || !hall)
      return res.status(404).json({ message: "Exam or Hall not found" });

    const students = await User.find({ role: "student" }).sort({ rollNumber: 1 });

    let allocations = [];
    let index = 0;

    for (let r = 1; r <= hall.rows; r++) {
      for (let c = 1; c <= hall.cols; c++) {
        if (index >= students.length) break;

        const s = students[index];

        allocations.push({
          student: s._id,
          rollNumber: s.rollNumber,
          seatNumber: `R${r}-C${c}`,
          row: r,
          col: c
        });

        index++;
      }
    }

    await SeatingPlan.deleteMany({ exam: examId });

    const plan = await SeatingPlan.create({
      exam: examId,
      examName: exam.title,
      hall: hallId,
      allocations,
      createdBy: req.user._id
    });

    res.json({ message: "Seating generated", plan });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   CSV PREVIEW
============================ */
exports.importCSV = async (req, res) => {
  try {
    const csv = req.file.buffer.toString();
    const parsed = Papa.parse(csv, { header: true });

    res.json({
      message: "CSV parsed",
      preview: parsed.data.slice(0, 50)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   CSV SEATING UPLOAD (FIXED)
============================ */
exports.uploadCSVSeating = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const examId = req.params.id;
    const csv = req.file.buffer.toString();
    const parsed = Papa.parse(csv, { header: true });

    if (parsed.errors.length) {
      return res.status(400).json({ message: "Invalid CSV format" });
    }

    const rows = parsed.data.filter(r => r.rollNumber || r.roll || r.seat);

    let allocations = [];
    let index = 0;

    for (const row of rows) {
      const roll = row.rollNumber || row.roll || row.RollNumber;
      const seat = row.seat || row.seatNumber || `S-${index + 1}`;

      if (!roll) continue;

      const student = await User.findOne({ rollNumber: roll });
      if (!student) continue;

      let r = Number(row.row) || Math.floor(index / 6) + 1;
      let c = Number(row.col) || (index % 6) + 1;

      allocations.push({
        student: student._id,
        rollNumber: roll,
        seatNumber: seat,
        row: r,
        col: c
      });

      index++;
    }

    await SeatingPlan.deleteMany({ exam: examId });

    const exam = await Exam.findById(examId);

    const plan = await SeatingPlan.create({
      exam: examId,
      examName: exam?.title || "Exam",
      hall: null,
      allocations,
      createdBy: req.user._id
    });

    await Exam.findByIdAndUpdate(examId, { seatingUploaded: true });

    res.json({
      message: "Seating uploaded successfully",
      count: allocations.length,
      plan
    });

  } catch (err) {
    console.error("UPLOAD CSV ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



/* ============================
   FILE UPLOAD
============================ */
exports.uploadFile = async (req, res) => {
  try {
    const examId = req.params.id;
    const uploadDir = path.join(__dirname, "../uploads", examId);

    if (!fs.existsSync(uploadDir))
      fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}_${req.file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    const file = await Upload.create({
      exam: examId,
      uploader: req.user._id,
      filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: `/uploads/${examId}/${filename}`,
      mimeType: req.file.mimetype
    });

    res.json({ message: "File uploaded", file });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   LIST FILES
============================ */
exports.listFiles = async (req, res) => {
  try {
    const files = await Upload.find({ exam: req.params.id })
      .sort({ createdAt: -1 });

    res.json({ files });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   EXPORT SEATING CSV
============================ */
exports.exportCSV = async (req, res) => {
  try {
    const plan = await SeatingPlan.findOne({ exam: req.params.id })
      .populate("allocations.student", "name email rollNumber");

    if (!plan) return res.status(404).json({ message: "No seating found" });

    const rows = plan.allocations.map(a => ({
      name: a.student?.name,
      rollNumber: a.rollNumber,
      seat: a.seatNumber,
      row: a.row,
      col: a.col
    }));

    const csv = Papa.unparse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=seating.csv");
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
