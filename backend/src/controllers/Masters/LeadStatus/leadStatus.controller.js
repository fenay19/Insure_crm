const { default: mongoose } = require("mongoose");
const { leadStatusModel } = require("../../../models/index");

const getLeadStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const leadStatuses = await leadStatusModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!leadStatuses || leadStatuses.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No lead statuses found" });
    }
    // sort data from newest to oldest
    leadStatuses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: leadStatuses });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching lead statuses", error.message],
    });
  }
};

const postLeadStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { LeadStatus, shortForm, colorCode } = req.body;

    if (!LeadStatus || !shortForm || !colorCode) {
      return res.status(400).json({
        status: "false",
        message: "All fields (LeadStatus, shortForm, colorCode) are required",
      });
    }

    const newLeadStatus = new leadStatusModel({
      LeadStatus,
      companyId,
      shortForm,
      colorCode,
    });
    await newLeadStatus.save();

    res.status(201).json({ status: "true", data: newLeadStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating lead status", error.message],
    });
  }
};

const putLeadStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const { LeadStatus, shortForm, colorCode } = req.body;

    const updatedLeadStatus = await leadStatusModel.findByIdAndUpdate(
      id,
      { LeadStatus, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedLeadStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead status not found" });
    }

    res.status(200).json({ status: "true", data: updatedLeadStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating lead status", error.message],
    });
  }
};

const deleteLeadStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeadStatus = await leadStatusModel.findByIdAndDelete(id);

    if (!deletedLeadStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead status not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Lead status deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting lead status", error.message],
    });
  }
};

module.exports = {
  getLeadStatusController,
  postLeadStatusController,
  putLeadStatusController,
  deleteLeadStatusController,
};
