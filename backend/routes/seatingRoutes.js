const express = require("express");
const router = express.Router();
const { processSeatingCSV } = require("../controllers/seatingController");

router.post("/generate/:examId", processSeatingCSV);

module.exports = router;
