const SeatingPlan = require("../models/SeatingPlan");
const Upload = require("../models/Upload");
const fs = require("fs");
const csv = require("csv-parser");

exports.processSeatingCSV = async (req, res) => {
  try {
    const { examId } = req.params;

    const upload = await Upload.findOne({ exam: examId }).sort({ createdAt: -1 });
    if (!upload) return res.status(404).json({ message: "No CSV uploaded" });

    const allocations = [];

    fs.createReadStream(upload.path)
      .pipe(csv())
      .on("data", (row) => {
        allocations.push({
          rollNumber: row.rollNumber,
          seatNumber: row.seat,
          row: Number(row.row),
          col: Number(row.col)
        });
      })
      .on("end", async () => {
        await SeatingPlan.findOneAndUpdate(
          { exam: examId },
          {
            exam: examId,
            examName: "Generated Seating",
            allocations
          },
          { upsert: true, new: true }
        );

        res.json({ success: true, allocationsCount: allocations.length });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seating generation failed" });
  }
};
