const { default: mongoose } = require("mongoose");
const { leadStageModel } = require("../../../models/index");

const getLeadStageController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const leadStages = await leadStageModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!leadStages || leadStages.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No lead stages found" });
    }
    // Sort data newest to oldest
    leadStages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: leadStages });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching lead stages", error.message],
    });
  }
};

const postLeadStageController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { LeadStage, shortForm, colorCode } = req.body;

    if (!LeadStage || !shortForm || !colorCode) {
      return res.status(400).json({
        status: "false",
        message: "All fields (LeadStage, shortForm, colorCode) are required",
      });
    }

    const newLeadStage = new leadStageModel({
      LeadStage,
      shortForm,
      colorCode,
      companyId,
    });
    await newLeadStage.save();

    res.status(201).json({ status: "true", data: newLeadStage });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating lead stage", error.message],
    });
  }
};

const putLeadStageController = async (req, res) => {
  try {
    const id = req.params.id;
    const { LeadStage, shortForm, colorCode } = req.body;

    const updatedLeadStage = await leadStageModel.findByIdAndUpdate(
      id,
      { LeadStage, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedLeadStage) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead stage not found" });
    }

    res.status(200).json({ status: "true", data: updatedLeadStage });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating lead stage", error.message],
    });
  }
};

const deleteLeadStageController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeadStage = await leadStageModel.findByIdAndDelete(id);

    if (!deletedLeadStage) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead stage not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Lead stage deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting lead stage", error.message],
    });
  }
};

module.exports = {
  getLeadStageController,
  postLeadStageController,
  putLeadStageController,
  deleteLeadStageController,
};
