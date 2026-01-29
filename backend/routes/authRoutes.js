const express = require("express");
const router = express.Router();

const {
  login,
  registerRequest,
  studentLogin
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");

/**
 * LOGIN ROUTES
 */
router.post("/login", login);
router.post("/student-login", studentLogin);

/**
 * REGISTER REQUEST
 */
router.post("/register-request", registerRequest);

/**
 * GET CURRENT USER
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(401).json({ message: "Session invalid" });
  }
});

module.exports = router;
