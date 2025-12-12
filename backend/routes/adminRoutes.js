const express = require("express");
const router = express.Router();

const adminCtrl = require("../controllers/adminController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware, requireRole("admin"));

router.get("/allowed", adminCtrl.listAllowed);
router.post("/allowed", adminCtrl.addAllowed);
router.delete("/allowed/:id", adminCtrl.removeAllowed);

router.get("/requests", adminCtrl.listRequests);
router.post("/requests/:id/approve", adminCtrl.approveRequest);
router.post("/requests/:id/reject", adminCtrl.rejectRequest);

router.get("/stats", adminCtrl.getStats);

module.exports = router;
