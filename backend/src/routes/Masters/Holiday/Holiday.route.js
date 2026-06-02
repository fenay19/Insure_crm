const express = require("express");
const router = express.Router();
const {
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
} = require("../../../controllers/Masters/Holiday/Holiday.controller");

// Create
router.post("/", createHoliday);

// Get all
router.get("/", getHolidays);

// Get single
router.get("/:id", getHolidayById);

// Update
router.put("/:id", updateHoliday);

// Delete
router.delete("/:id", deleteHoliday);

module.exports = router;
