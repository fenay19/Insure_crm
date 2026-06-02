const { default: mongoose } = require("mongoose");
const BrokerBranchModel = require("../../../models/Masters/BrokerBranch/BrokerBranch.model")
// const BankDetailsModel = require("../../../models/Masters/Banking-Details/BankingDetails.model");

const getBrokerBranchController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const brokerBranch = await BrokerBranchModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ status: "true", data: brokerBranch });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching bank details", error.message],
    });
  }
};

const postBrokerBranchController = async (req, res) => {
  try {
    const {
      branchId,
      branchCode,
      branchName,
      address,
      pinCode,
      mobile,
      email,
    } = req.body;
    const { companyId } = req.query;
    if (
      !branchCode||
      !branchName 
    ) {
      return res.status(400).json({
        status: "false",
        message: "Branch Code and Name are required",
      });
    }

    const newBrokerBranch = new BrokerBranchModel({
      branchId,
      branchCode,
      branchName,
      address,
      pinCode,
      mobile,
      email,
      companyId
    });
    await newBrokerBranch.save();
    res.status(201).json({ status: "true", data: newBrokerBranch });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating Broker Branch detail", error.message],
    });
  }
};

const putBrokerBranchController = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
console.log("backend data ",updateData);

    const updatedBrokerBranch = await BrokerBranchModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBrokerBranch) {
      return res.status(404).json({
        status: "false",
        message: "Branch detail not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedBrokerBranch });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating Broker Branch", error.message],
    });
  }
};

const deleteBrokerBranchController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBrokerBranch = await BrokerBranchModel.findByIdAndDelete(id);

    if (!deletedBrokerBranch) {
      return res.status(404).json({
        status: "false",
        message: "Broker Branch detail not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Broker Branch deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Broker Branch", error.message],
    });
  }
};

module.exports = {
  getBrokerBranchController,
  postBrokerBranchController,
  putBrokerBranchController,
  deleteBrokerBranchController,
};
