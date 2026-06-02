const { default: mongoose } = require("mongoose");
const { riskCodeModel } = require("../../../models/index");

const getRiskCodeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const riskCodes = await riskCodeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!riskCodes || riskCodes.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No risk Code found" });
    }
    // sort data from newest to oldest
    riskCodes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: riskCodes });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching risk Code", error.message],
    });
  }
};

const postRiskCodeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const riskCode = req.body.riskCode;
    if (!riskCode) {
      return res
        .status(400)
        .json({ status: "false", message: "risk Code is required" });
    }
    const newInsDepartment = new riskCodeModel({
      riskCode,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  risk Code", error.message],
    });
  }
};

const putRiskCodeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { riskCode } = req.body;

    const updatedDepartment = await riskCodeModel.findByIdAndUpdate(
      id,
      { riskCode },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "risk Code not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating risk Code", error.message],
    });
  }
};

const deleteRiskCodeController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await riskCodeModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "risk Code not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "risk Code deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting risk Code", error.message],
    });
  }
};

module.exports = {
  getRiskCodeController,
  postRiskCodeController,
  putRiskCodeController,
  deleteRiskCodeController,
};
