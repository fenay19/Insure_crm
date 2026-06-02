const { default: mongoose } = require("mongoose");
const { leadReferenceModel } = require("../../../models/index");

const getLeadReferenceController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const leadReferences = await leadReferenceModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!leadReferences || leadReferences.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No lead references found" });
    }
    // sort data from newest to oldest
    leadReferences.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json({ status: "true", data: leadReferences });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: ["Error fetching lead references", error.message],
      });
  }
};
const postLeadReferenceController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { LeadReference } = req.body;

    if (!LeadReference) {
      return res.status(400).json({
        status: "false",
        message: "LeadReference field is required",
      });
    }

    const newLeadReference = new leadReferenceModel({
      LeadReference,
      companyId,
    });
    await newLeadReference.save();

    res.status(201).json({ status: "true", data: newLeadReference });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: ["Error creating lead reference", error.message],
      });
  }
};
const putLeadReferenceController = async (req, res) => {
  try {
    const id = req.params.id;
    const { LeadReference } = req.body;

    const updatedLeadReference = await leadReferenceModel.findByIdAndUpdate(
      id,
      { LeadReference },
      { new: true, runValidators: true }
    );

    if (!updatedLeadReference) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead reference not found" });
    }

    res.status(200).json({ status: "true", data: updatedLeadReference });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: ["Error updating lead reference", error.message],
      });
  }
};
const deleteLeadReferenceController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeadReference = await leadReferenceModel.findByIdAndDelete(id);

    if (!deletedLeadReference) {
      return res
        .status(404)
        .json({ status: "false", message: "Lead reference not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Lead reference deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: ["Error deleting lead reference", error.message],
      });
  }
};

module.exports = {
  getLeadReferenceController,
  postLeadReferenceController,
  putLeadReferenceController,
  deleteLeadReferenceController,
};
