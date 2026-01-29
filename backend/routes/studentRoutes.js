const express = require("express");
const router = express.Router();

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const studentController = require("../controllers/studentController");

router.use(authMiddleware);
router.use(requireRole("student"));

router.get("/profile", studentController.getProfile);
router.put("/profile", studentController.updateProfile);

router.get("/dashboard", studentController.getDashboard);
router.get("/exams", studentController.getExams);
router.get("/seating", studentController.getSeating);

module.exports = router;
