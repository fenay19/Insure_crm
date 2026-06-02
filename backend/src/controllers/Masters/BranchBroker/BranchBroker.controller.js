const { default: mongoose } = require("mongoose");
const { branchBrokerModel } = require("../../../models/index");

const getBranchBrokerController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const branchBrokers = await branchBrokerModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!branchBrokers || branchBrokers.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Branch Broker found" });
    }
    // sort data from newest to oldest
    branchBrokers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: branchBrokers });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching Branch Broker", error.message],
    });
  }
};

const postBranchBrokerController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const branchBroker = req.body.branchBroker;
    if (!branchBroker) {
      return res
        .status(400)
        .json({ status: "false", message: " Branch Broker is required" });
    }
    const newInsDepartment = new branchBrokerModel({
      branchBroker,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    console.log("before save ", newInsDepartment);
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Branch Broker", error.message],
    });
  }
};

const putBranchBrokerController = async (req, res) => {
  try {
    const id = req.params.id;
    const { branchBroker } = req.body;

    const updatedDepartment = await branchBrokerModel.findByIdAndUpdate(
      id,
      { branchBroker },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Branch Broker not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Branch Broker", error.message],
    });
  }
};

const deleteBranchBrokerController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await branchBrokerModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Branch Broker not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Branch Broker deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting vehicle Type", error.message],
    });
  }
};

module.exports = {
  getBranchBrokerController,
  postBranchBrokerController,
  putBranchBrokerController,
  deleteBranchBrokerController,
};
