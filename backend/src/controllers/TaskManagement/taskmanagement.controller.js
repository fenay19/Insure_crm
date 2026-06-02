const { default: mongoose } = require("mongoose");
const { TaskModel } = require("../../models/index");
const { priorityModel } = require("../../models/index");
const { taskStatusModel } = require("../../models/index");
const createTask = async (req, res) => {
  try {
    const {
      title,
      priority,
      status,
      client,
      employeeName,
      assignedTo,
      description,
      startDate,
      endDate,
      createdBy,
    } = req.body;
    const { companyId } = req.query;
    // Validate required fields
    if (
      !title ||
      !priority ||
      !status ||
      !client ||
      !employeeName ||
      !description
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Convert priority name to ObjectId
    const priorityId = await priorityModel.findOne({ _id: priority });
    if (!priorityId) {
      return res
        .status(400)
        .json({ success: false, message: `Priority "${priority}" not found` });
    }

    const taskData = {
      title,
      priority: priorityId._id, // Use ObjectId for priority
      status,
      client,
      companyId,
      employeeName,
      assignedTo,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      createdBy,
    };
    console.log("task data is", taskData);

    // Create task
    const task = await TaskModel.create(taskData);

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { companyId } = req.query;
    const tasks = await TaskModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .sort({ createdAt: -1 })
      .populate("priority") // Populates Priority data
      .populate("status") // Populates Status data
      .populate("client") // Populates AdminclientRegistration data
      .populate("assignedTo");
    console.log("get all task is", tasks);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id)
      .populate("priority")
      .populate("status")
      .populate("assignedTo");
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const UpdateTaskStatus = async (req, res) => {
  try {
    const { user, fromStatus, toStatus, comment } = req.body;
    console.log("req boyd is", req.body);
    if (!toStatus || !fromStatus || !comment) {
      return res.status(400).json({
        success: false,
        message: "Status change and comment are required",
      });
    }

    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Get status names using fromStatus and toStatus IDs
    const fromStatusDoc = await taskStatusModel.findById(fromStatus);
    const toStatusDoc = await taskStatusModel.findById(toStatus);

    console.log("from status find is", fromStatusDoc);
    console.log("to status find is", toStatusDoc);

    if (!fromStatusDoc || !toStatusDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status IDs" });
    }

    // Save name instead of ID in statusHistory
    const statusData = {
      fromStatus: fromStatusDoc.TaskStatus,
      toStatus: toStatusDoc.TaskStatus,
      comment,
      user: user || "Unknown User",
      timestamp: new Date(),
    };

    task.status = toStatus; // still save ID
    task.statusHistory.push(statusData);

    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  UpdateTaskStatus,
};
