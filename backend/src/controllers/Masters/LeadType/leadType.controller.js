const { default: mongoose } = require("mongoose");
const { leadTypeModel } = require("../../../models/index");

const getLeadTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const leadTypes = await leadTypeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!leadTypes || leadTypes.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No lead types found" });
    }
    // sort data newest to oldest using date object
    leadTypes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: leadTypes });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching lead types", error.message],
    });
  }
};
const postLeadTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { LeadType } = req.body;

    if (!LeadType) {
      return res.status(400).json({
        status: "false",
        message: "LeadType field is required",
      });
    }

    const newLeadType = new leadTypeModel({ LeadType, companyId });
    await newLeadType.save();

    res.status(201).json({ status: "true", data: newLeadType });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating lead type", error.message],
    });
  }
};
const putLeadTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { LeadType } = req.body;

    const updatedLeadType = await leadTypeModel.findByIdAndUpdate(
      id,
      { LeadType },
      { new: true, runValidators: true }
    );

    if (!updatedLeadType) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead type not found" });
    }

    res.status(200).json({ status: "true", data: updatedLeadType });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating lead type", error.message],
    });
  }
};
const deleteLeadTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeadType = await leadTypeModel.findByIdAndDelete(id);

    if (!deletedLeadType) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead type not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Lead type deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting lead type", error.message],
    });
  }
};

module.exports = {
  getLeadTypeController,
  postLeadTypeController,
  putLeadTypeController,
  deleteLeadTypeController,
};
