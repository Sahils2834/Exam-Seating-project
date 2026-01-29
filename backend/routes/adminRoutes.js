const express = require("express");
const router = express.Router();

const adminCtrl = require("../controllers/adminController");
const User = require("../models/User");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.use(requireRole("admin"));

/**
 * ALLOWED USERS
 */
router.get("/allowed", adminCtrl.listAllowed);
router.post("/allowed", adminCtrl.addAllowed);
router.delete("/allowed/:id", adminCtrl.removeAllowed);

/**
 * REGISTRATION REQUESTS
 */
router.get("/requests", adminCtrl.listRequests);
router.post("/requests/:id/approve", adminCtrl.approveRequest);
router.post("/requests/:id/reject", adminCtrl.rejectRequest);

router.get("/teachers", adminCtrl.listTeachers);

/**
 * ADMIN STATS
 */
router.get("/stats", adminCtrl.getStats);

/**
 * GET USERS BY ROLE (teachers)
 */
router.get("/users", async (req, res) => {
  const role = req.query.role;
  const users = await User.find(role ? { role } : {});
  res.json(users);
});

module.exports = router;
