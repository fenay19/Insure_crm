const { default: mongoose } = require("mongoose");
const { leaveTypeModel } = require("../../../models/index");

const getLeaveTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const leaveTypes = await leaveTypeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!leaveTypes || leaveTypes.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No leave types found" });
    }
    // Sort leave types by creation date, newest first
    leaveTypes.sort((a, b) => {
      // if (a.createdAt < b.createdAt) return 1; // b is newer, a is older
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
    res.status(200).json({ status: "true", data: leaveTypes });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching leave types", error.message],
    });
  }
};

const postLeaveTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { leaveType, shortForm, totalLeaves, leavesPerMonth } = req.body;

    if (!leaveType || !shortForm || !totalLeaves || !leavesPerMonth) {
      return res.status(400).json({
        status: "false",
        message:
          "All fields (leaveType, shortForm, totalLeaves, leavesPerMonth) are required",
      });
    }

    const newLeaveType = new leaveTypeModel({
      leaveType,
      companyId,
      shortForm,
      totalLeaves,
      leavesPerMonth,
    });

    await newLeaveType.save();

    res.status(201).json({ status: "true", data: newLeaveType });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating leave type", error.message],
    });
  }
};

const putLeaveTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { leaveType, shortForm, totalLeaves, leavesPerMonth } = req.body;

    const updatedLeaveType = await leaveTypeModel.findByIdAndUpdate(
      id,
      { leaveType, shortForm, totalLeaves, leavesPerMonth },
      { new: true, runValidators: true }
    );

    if (!updatedLeaveType) {
      return res
        .status(404)
        .json({ status: "false", message: "Leave type not found" });
    }

    res.status(200).json({ status: "true", data: updatedLeaveType });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating leave type", error.message],
    });
  }
};

const deleteLeaveTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeaveType = await leaveTypeModel.findByIdAndDelete(id);

    if (!deletedLeaveType) {
      return res
        .status(404)
        .json({ status: "false", message: "Leave type not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Leave type deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting leave type", error.message],
    });
  }
};

module.exports = {
  getLeaveTypeController,
  postLeaveTypeController,
  putLeaveTypeController,
  deleteLeaveTypeController,
};
