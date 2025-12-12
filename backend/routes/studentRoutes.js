const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

router.get('/profile', authMiddleware, requireRole('student'), studentController.getProfile);
router.put('/profile', authMiddleware, requireRole('student'), studentController.updateProfile);

module.exports = router;
