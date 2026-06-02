const express = require("express");
const router = express.Router();
const {
  CreateAttendance,
  GetAttendance,
} = require("../../../controllers/Satffs/Attendance/attendance.controller");

// GET → get attendance (by ?date=2025-10-27 or all)
router.post("/get", GetAttendance);
// POST → create or update attendance for a date
router.post("/", CreateAttendance);

module.exports = router;
