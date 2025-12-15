const express = require("express");
const router = express.Router();

const {
  login,
  registerRequest,
  studentLogin
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register-request", registerRequest);
router.post("/student-login", studentLogin);

module.exports = router;
