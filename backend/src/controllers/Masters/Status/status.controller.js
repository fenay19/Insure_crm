const { default: mongoose } = require("mongoose");
const { statusModel } = require("../../../models/index");

const getStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const statusname = await statusModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!statusname || statusname.length === 0) {
      return res.status(404).json({
        status: "false",
        message: "No statusName found",
      });
    }
    // sort data from newest to oldest
    statusname.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: statusname });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching statusName", error.message],
    });
  }
};

const postStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { statusName } = req.body;

    if (!statusName) {
      return res.status(400).json({
        status: "false",
        message: "statusName field is required",
      });
    }

    const newStatus = new statusModel({ statusName, companyId });
    await newStatus.save();

    res.status(201).json({ status: "true", data: newStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating statusName", error.message],
    });
  }
};

const putStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const { statusName } = req.body;

    const updatedStatus = await statusModel.findByIdAndUpdate(
      id,
      { statusName },
      { new: true, runValidators: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({
        status: "false",
        message: "Status Name not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating statusName", error.message],
    });
  }
};

const deleteStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedStatus = await statusModel.findByIdAndDelete(id);

    if (!deletedStatus) {
      return res.status(404).json({
        status: "false",
        message: "Status Name not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Status deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting statusName", error.message],
    });
  }
};

module.exports = {
  getStatusController,
  postStatusController,
  putStatusController,
  deleteStatusController,
};
