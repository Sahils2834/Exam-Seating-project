const express = require("express");
const router = express.Router();
const multer = require("multer");

const examCtrl = require("../controllers/examController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, requireRole("admin"), examCtrl.createExam);

router.post("/:id/import-csv", authMiddleware, requireRole("admin"), upload.single("file"), examCtrl.importCSV);

router.put("/:id/seats", authMiddleware, requireRole("admin"), examCtrl.updateSeats);

router.post("/:id/upload", authMiddleware, requireRole("teacher"), upload.single("file"), examCtrl.uploadFile);

router.get("/", authMiddleware, examCtrl.listExams);
router.get("/:id", authMiddleware, examCtrl.getExam);
router.get("/:id/files", authMiddleware, examCtrl.listFiles);
router.get("/:id/export-csv", authMiddleware, examCtrl.exportCSV);

module.exports = router;
