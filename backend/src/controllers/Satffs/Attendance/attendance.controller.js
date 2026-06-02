const Attendance = require("../../../models/Staffs/Attendance/attendance.model");
const Administrative = require("../../../models/Staffs/administrative/administrative.model");

// ✅ Create Attendance
exports.CreateAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res
        .status(400)
        .json({ message: "Date and records array are required." });
    }

    // Verify all employees exist
    for (const rec of records) {
      const exists = await Administrative.findById(rec.staffId);
      if (!exists) {
        return res
          .status(404)
          .json({ message: `Employee not found for ID: ${rec.staffId}` });
      }
    }

    // Check if attendance for the date already exists
    const existing = await Attendance.findOne({ date });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date." });
    }

    // Create attendance
    const attendance = new Attendance({
      date,
      records,
      // createdBy,
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance created successfully.",
      data: attendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.GetAttendance = async (req, res) => {
  try {
    const { date, month } = req.body;
    console.log(date);

    // 1️⃣ Specific Date
    if (date) {
      const record = await Attendance.findOne({ date }).populate(
        "records.staffId",
        "basicDetails"
      );

      if (!record)
        return res
          .status(404)
          .json({ message: "No attendance found for this date." });

      const data = record.records.map((r) => ({
        name:
          `${r.staffId?.basicDetails?.empCode} - ${r.staffId?.basicDetails?.firstName} ${r.staffId?.basicDetails?.lastName}` ||
          "Unknown",
        status: r.status,
        inTime: r.inTime,
        outTime: r.outTime,
        comment: r.comment,
      }));

      return res.json({ type: "date", date, data });
    }

    // 2️⃣ Specific Month
    if (month) {
      const monthData = await Attendance.find({
        date: { $regex: `^${month}` }, // match all dates in month (YYYY-MM)
      }).populate("records.staffId", "basicDetails");

      if (!monthData.length) {
        return res
          .status(404)
          .json({ message: "No attendance found for this month." });
      }

      // Aggregate employee data
      const stats = {};
      monthData.forEach((day) => {
        day.records.forEach((r) => {
          const empName =
            `${r.staffId?.basicDetails?.empCode} - ${r.staffId?.basicDetails?.firstName} ${r.staffId?.basicDetails?.lastName}` ||
            "Unknown";

          if (!stats[empName]) stats[empName] = { presentDays: 0 };

          if (r.status === "PRESENT" || r.status === "HALF DAY")
            stats[empName].presentDays += 1;
        });
      });

      // Calculate total days in selected month
      const [year, monthNumber] = month.split("-"); // "2025-10"
      const totalDaysInMonth = new Date(year, monthNumber, 0).getDate();

      // Convert to final array
      const final = Object.entries(stats).map(([name, s]) => ({
        name,
        presentDays: s.presentDays,
        totalDays: totalDaysInMonth,
        presentPercentage: ((s.presentDays / totalDaysInMonth) * 100).toFixed(
          1
        ),
      }));

      return res.json({ type: "month", month, data: final });
    }

    // 3️⃣ Default: return all attendance logs (for list view)
    const all = await Attendance.find({}, "date").sort({ date: -1 });
    res.json({ type: "all", data: all });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
