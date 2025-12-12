const express = require('express');
const router = express.Router();
const { register, login, studentLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/student-login', studentLogin);

module.exports = router;
