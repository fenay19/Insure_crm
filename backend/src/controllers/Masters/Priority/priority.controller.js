const { default: mongoose } = require("mongoose");
const { priorityModel } = require("../../../models/index");

const getPriorityController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const priorities = await priorityModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!priorities || priorities.length === 0) {
      return res.status(404).json({
        status: "false",
        message: "No priorities found",
      });
    }

    priorities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: priorities });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching priorities", error.message],
    });
  }
};

const postPriorityController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { priorityName } = req.body;

    if (!priorityName) {
      return res.status(400).json({
        status: "false",
        message: "priorityName field is required",
      });
    }

    const newPriority = new priorityModel({ priorityName, companyId });
    await newPriority.save();

    res.status(201).json({ status: "true", data: newPriority });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating priority", error.message],
    });
  }
};

const putPriorityController = async (req, res) => {
  try {
    const id = req.params.id;
    const { priorityName } = req.body;

    const updatedPriority = await priorityModel.findByIdAndUpdate(
      id,
      { priorityName },
      { new: true, runValidators: true }
    );

    if (!updatedPriority) {
      return res.status(404).json({
        status: "false",
        message: "Priority not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedPriority });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating priority", error.message],
    });
  }
};

const deletePriorityController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPriority = await priorityModel.findByIdAndDelete(id);

    if (!deletedPriority) {
      return res.status(404).json({
        status: "false",
        message: "Priority not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Priority deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting priority", error.message],
    });
  }
};

module.exports = {
  getPriorityController,
  postPriorityController,
  putPriorityController,
  deletePriorityController,
};
