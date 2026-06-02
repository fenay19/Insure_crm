const { default: mongoose } = require("mongoose");
const { taskStatusModel } = require("../../../models/index");

const getTaskStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const taskStatuses = await taskStatusModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!taskStatuses || taskStatuses.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No task statuses found" });
    }
    // sort data from newest to oldest
    taskStatuses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: taskStatuses });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching task statuses", error.message],
    });
  }
};

const postTaskStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { TaskStatus, shortForm, colorCode } = req.body;

    if (!TaskStatus || !shortForm || !colorCode) {
      return res.status(400).json({
        status: "false",
        message: "All fields (TaskStatus, shortForm, colorCode) are required",
      });
    }

    const newTaskStatus = new taskStatusModel({
      TaskStatus,
      shortForm,
      colorCode,
      companyId,
    });
    await newTaskStatus.save();

    res.status(201).json({ status: "true", data: newTaskStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating task status", error.message],
    });
  }
};

const putTaskStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const { TaskStatus, shortForm, colorCode } = req.body;

    const updatedTaskStatus = await taskStatusModel.findByIdAndUpdate(
      id,
      { TaskStatus, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedTaskStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Task status not found" });
    }

    res.status(200).json({ status: "true", data: updatedTaskStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating task status", error.message],
    });
  }
};

const deleteTaskStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTaskStatus = await taskStatusModel.findByIdAndDelete(id);

    if (!deleteTaskStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Task status not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Task status deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting task status", error.message],
    });
  }
};

module.exports = {
  getTaskStatusController,
  postTaskStatusController,
  putTaskStatusController,
  deleteTaskStatusController,
};
