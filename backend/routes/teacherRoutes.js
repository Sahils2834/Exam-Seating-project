const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware, requireRole("teacher"));
    
router.get("/uploads", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Upload.countDocuments({ uploader: req.user._id });
    const items = await Upload.find({ uploader: req.user._id })
      .populate("exam", "title")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
