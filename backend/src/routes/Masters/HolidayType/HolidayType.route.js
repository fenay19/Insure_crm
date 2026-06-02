const express = require("express");
const router = express.Router();
const {
  createHolidayType,
  getHolidayTypes,
  getHolidayTypeById,
  updateHolidayType,
  deleteHolidayType,
} = require("../../../controllers/Masters/HolidayType/HolidayType.Controller");

// Create
router.post("/", createHolidayType);

// Get all
router.get("/", getHolidayTypes);

// Get single
router.get("/:id", getHolidayTypeById);

// Update
router.put("/:id", updateHolidayType);

// Delete
router.delete("/:id", deleteHolidayType);

module.exports = router;
