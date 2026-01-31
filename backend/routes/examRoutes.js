const express = require("express");
const router = express.Router();
const multer = require("multer");

const examCtrl = require("../controllers/examController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const SeatingPlan = require("../models/SeatingPlan");

const upload = multer({ storage: multer.memoryStorage() });

/* ======================================================
   ADMIN ROUTES
====================================================== */

// Create exam
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  examCtrl.createExam
);

// List all exams
router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  examCtrl.listExams
);

// Assign teacher to exam
router.post(
  "/:id/assign-teacher",
  authMiddleware,
  requireRole("admin"),
  examCtrl.assignTeacher
);

// Generate seating automatically
router.post(
  "/generate-seating",
  authMiddleware,
  requireRole("admin"),
  examCtrl.generateSeating
);

// Import CSV (preview only)
router.post(
  "/:id/import-csv",
  authMiddleware,
  requireRole("admin"),
  upload.single("file"),
  examCtrl.importCSV
);

// Export seating CSV
router.get(
  "/:id/export-csv",
  authMiddleware,
  requireRole("admin"),
  examCtrl.exportCSV
);


/* ======================================================
   TEACHER ROUTES
====================================================== */

// Teacher → only assigned exams
router.get(
  "/teacher/exams",
  authMiddleware,
  requireRole("teacher"),
  examCtrl.listTeacherExams
);

// Teacher upload seating CSV
router.post(
  "/:id/upload-seating",
  authMiddleware,
  requireRole("teacher"),
  upload.single("file"),
  examCtrl.uploadCSVSeating
);

// Teacher upload exam files (pdf/csv/etc)
router.post(
  "/:id/upload",
  authMiddleware,
  requireRole("teacher"),
  upload.single("file"),
  examCtrl.uploadFile
);

// Teacher list uploaded files
router.get(
  "/:id/files",
  authMiddleware,
  requireRole("teacher"),
  examCtrl.listFiles
);


/* ======================================================
   STUDENT ROUTES
====================================================== */

// Student → published exams list
router.get(
  "/student/exams",
  authMiddleware,
  requireRole("student"),
  examCtrl.listPublishedExams
);

// Student → get exam details
router.get(
  "/student/:id",
  authMiddleware,
  requireRole("student"),
  examCtrl.getExam
);

/* ======================================================
   STUDENT → VIEW SEATING FROM CSV UPLOAD
====================================================== */

router.get(
  "/:examId/uploads",
  authMiddleware,
  examCtrl.getExamUploads
);


/* ======================================================
   SEATING LOOKUP (ALL AUTH USERS)
====================================================== */

router.get(
  "/:id/plans",
  authMiddleware,
  async (req, res) => {
    try {
      const plans = await SeatingPlan.find({ exam: req.params.id })
        .populate("hall")
        .populate("allocations.student", "name email rollNumber");

      res.json(plans);
    } catch (err) {
      console.error("SEATING FETCH ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
