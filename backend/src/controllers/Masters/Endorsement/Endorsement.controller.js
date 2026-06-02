const { default: mongoose } = require("mongoose");
const { endorsementModel } = require("../../../models/index");

const getEndorsementController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const endorsements = await endorsementModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!endorsements || endorsements.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No endorsement found" });
    }
    // sort data from newest to oldest
    endorsements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: endorsements });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching endorsement", error.message],
    });
  }
};

const postEndorsementController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const endorsement = req.body.endorsement;
    if (!endorsement) {
      return res
        .status(400)
        .json({ status: "false", message: "Endorsement is required" });
    }
    const newInsDepartment = new endorsementModel({
      endorsement,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Endorsement", error.message],
    });
  }
};

const putEndorsementController = async (req, res) => {
  try {
    const id = req.params.id;
    const { endorsement } = req.body;

    const updatedDepartment = await endorsementModel.findByIdAndUpdate(
      id,
      { endorsement },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "endorsement not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating endorsement", error.message],
    });
  }
};

const deleteEndorsementController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await endorsementModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "endorsement not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "endorsement deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting endorsement", error.message],
    });
  }
};

module.exports = {
  getEndorsementController,
  postEndorsementController,
  putEndorsementController,
  deleteEndorsementController,
};
