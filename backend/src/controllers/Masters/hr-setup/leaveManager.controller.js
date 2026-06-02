const { LeaveManagerModel } = require("../../../models/index");
const { statusModel } = require("../../../models/index");
const { leaveTypeModel } = require("../../../models/index");
const { Administrative } = require("../../../models/index");
const mongoose = require("mongoose");

// Create a new leave manager entry
const createLeaveManager = async (req, res) => {
  try {
    const {
      staffName,
      leaveType,
      status,
      leaveMode,
      fromDate,
      toDate,
      alternateMobileNo,
      noOfDays,
      reason,
    } = req.body;

    // ✅ Validate required fields
    if (
      !staffName ||
      !leaveType ||
      !status ||
      !fromDate ||
      !noOfDays ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // ✅ Ensure referenced documents exist
    const [foundLeaveType] = await Promise.all([
      leaveTypeModel.findById(leaveType),
    ]);

    if (!foundLeaveType) {
      return res.status(404).json({
        success: false,
        message: `Leave type not found.`,
      });
    }

    // ✅ Create leave record with ObjectId references
    const newLeave = new LeaveManagerModel({
      staffName,
      leaveType: foundLeaveType._id,
      status,
      leaveMode,
      fromDate,
      toDate,
      alternateMobileNo,
      noOfDays,
      reason,
    });

    const savedLeave = await newLeave.save();

    res.status(201).json({
      success: true,
      message: "Leave request created successfully.",
      data: savedLeave,
    });
  } catch (error) {
    console.error("Create Leave Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ Fetch all leave managers
const getAllLeaveManagers = async (req, res) => {
  try {
    const leaveRecords = await LeaveManagerModel.find({ delete: false })
      .populate("leaveType", "leaveType") // populate leaveType field with its name
      .populate("status", "statusName") // populate status field with its name
      .sort({ createdAt: -1 });

    if (!leaveRecords || leaveRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leave records found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All leave records fetched successfully.",
      count: leaveRecords.length,
      data: leaveRecords,
    });
  } catch (error) {
    console.error("Error in getAllLeaveManagers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching leave records.",
      error: error.message,
    });
  }
};

// Update a specific leave manager
const updateLeaveManager = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { staffName, leaveType, status, noOfDays, reason } = req.body;

    // ✅ Check required fields
    if (!staffName || !leaveType || !status || !noOfDays || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ✅ Check if leave record exists
    const existingLeave = await LeaveManagerModel.findById(leaveId);
    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found.",
      });
    }

    // ✅ Find leaveType by name
    const foundLeaveType = await leaveTypeModel.findOne({
      leaveType: leaveType,
    });
    if (!foundLeaveType) {
      return res.status(404).json({
        success: false,
        message: `Leave type "${leaveType}" not found.`,
      });
    }

    // ✅ Find status by name
    const foundStatus = await statusModel.findOne({ statusName: status });
    if (!foundStatus) {
      return res.status(404).json({
        success: false,
        message: `Status "${status}" not found.`,
      });
    }

    // ✅ Update the leave record
    existingLeave.staffName = staffName;
    existingLeave.leaveType = foundLeaveType.leaveType;
    existingLeave.status = foundStatus.statusName;
    existingLeave.noOfDays = noOfDays;
    existingLeave.reason = reason;

    const updatedLeave = await existingLeave.save();

    res.status(200).json({
      success: true,
      message: "Leave request updated successfully.",
      data: updatedLeave,
    });
  } catch (error) {
    console.error("Update Leave Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Soft delete a specific leave manager
const deleteLeaveManager = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeaveManager = await LeaveManagerModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedLeaveManager) {
      return res
        .status(404)
        .json({ success: false, message: "Leave manager not found" });
    }

    res.status(200).json({
      success: true,
      message: "Leave manager deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting leave manager:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get total leaves taken by staff for a specific leave type in the current year
const getLeaveCountByType = async (req, res) => {
  try {
    const { staffName, leaveType } = req.params;

    if (!staffName || !leaveType) {
      return res.status(400).json({
        success: false,
        message: "staffName and leaveType are required.",
      });
    }

    // Current year
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    // Find the leaveType document
    const leaveTypeDoc = await leaveTypeModel.findOne({ leaveType });
    if (!leaveTypeDoc) {
      return res.status(404).json({
        success: false,
        message: `Leave type "${leaveType}" not found.`,
      });
    }

    // Fetch all approved leaves of this type for the staff created in the current year
    const leaves = await LeaveManagerModel.find({
      staffName,
      leaveType: leaveTypeDoc._id,
      status: "Approved", // <- status is now a string
      delete: false,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalDays = leaves.reduce(
      (sum, leave) => sum + (leave.noOfDays || 0),
      0
    );

    res.status(200).json({
      success: true,
      staffName,
      leaveType: leaveTypeDoc.leaveType,
      year: currentYear,
      totalLeavesTaken: totalDays,
      leaveCount: leaves.length,
    });
  } catch (error) {
    console.error("Error calculating leave count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update leave status
// Update leave status
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params; // leave ID
    const { status, rejectReason } = req.body; // include rejectReason

    if (!status || !["Applied", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: Applied, Approved, Rejected.",
      });
    }

    // Find leave record
    const leaveRecord = await LeaveManagerModel.findById(id);
    if (!leaveRecord) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found.",
      });
    }

    // Update status
    leaveRecord.status = status;

    // Only set rejectReason if status is 'Rejected'
    if (status === "Rejected") {
      leaveRecord.rejectReason = rejectReason || "";
    } else {
      leaveRecord.rejectReason = ""; // clear if not rejected
    }

    const updatedLeave = await leaveRecord.save();

    res.status(200).json({
      success: true,
      message: `Leave status updated to "${status}".`,
      data: updatedLeave,
    });
  } catch (error) {
    console.error("Update Leave Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Export all controllers
module.exports = {
  createLeaveManager,
  getAllLeaveManagers,
  updateLeaveManager,
  deleteLeaveManager,
  getLeaveCountByType,
  updateLeaveStatus,
};
