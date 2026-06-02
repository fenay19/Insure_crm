const mongoose = require("mongoose");
const subCustomerGroupModel = require("../../../models/Masters/SubCustomerGroup/SubCustomerGroup.model");
require("dotenv").config();

// new customer registrations details
const postSubCustomerGroup = async (req, res) => {
  try {
    console.log("reached Cntroller");
    console.log("Request body:", req.body);
    const { companyId } = req.query;
    const { customerGroupName, subCustomerGroup } = req.body;

    // 🔍 Basic validation for required fields
    const requiredFields = [customerGroupName, subCustomerGroup];

    if (requiredFields.some((field) => !field || field.trim() === "")) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    // create newCustomerRegistration object
    const newcustomerGroup = new subCustomerGroupModel({
      customerGroupName,
      subCustomerGroup,
      companyId,
    });
    console.log("before save", newcustomerGroup);
    await newcustomerGroup.save();
    console.log("create dunction executed");

    res.status(201).json({
      message: "sub customer Group created successfully",
      data: newcustomerGroup,
    });
  } catch (error) {
    console.error("Error fetching customer Groups:", error);
  }
};

//get all customer Group details
const getSubCustomerGroup = async (req, res) => {
  try {
    const { companyId } = req.query;
    const customerGroup = await subCustomerGroupModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    //   .populate("prefix")
    //   .populate("contactPerson");

    // console.log(
    //   "------------------------------------------------",
    //   customerGroup
    // );

    if (!customerGroup || customerGroup.length === 0) {
      return res.status(404).json({ message: "Sub Customer group not found" });
    }

    // sort data from newest to oldest
    customerGroup.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // b is newer, a is older
    );

    return res.status(200).json({ status: "true", data: customerGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSubCustomerGroupByCustomer = async (req, res) => {
  try {
    const { companyId } = req.query;
    const customerGroupName = req.params.id;
    const customerGroup = await subCustomerGroupModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      customerGroupName: new mongoose.Types.ObjectId(customerGroupName),
    });

    if (!customerGroup || customerGroup.length === 0) {
      return res.status(404).json({ message: "Sub Customer group not found" });
    }

    // sort data from newest to oldest
    customerGroup.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // b is newer, a is older
    );

    return res.status(200).json({ status: "true", data: customerGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSubCustomerGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await subCustomerGroupModel.findById(id);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Sub Group not found" });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get Sub Group by ID Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// update policy data
const updateSubCustomerGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    let updateData = { ...req.body };
    console.log("Inside update ", groupId);

    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res
        .status(400)
        .json({ message: "Valid Sub Group ID is required" });
    }
    // Update only provided fields; $set ensures only changed fields are updated.
    const updatedGroupDetail = await subCustomerGroupModel.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedGroupDetail) {
      return res.status(404).json({ message: "Sub Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Sub Group updated successfully",
      data: updatedGroupDetail,
    });
  } catch (error) {
    console.error("Error updating Sub Group:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating Sub Group",
      error: error.message,
    });
  }
};

// delete policy Detail
const deleteSubCustomerGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubCustomerGroup =
      await subCustomerGroupModel.findByIdAndDelete(id);

    if (!deletedSubCustomerGroup) {
      return res.status(404).json({ message: "Sub Customer Group not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Sub Customer Group deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error deleting Sub Customer Group" });
  }
};

module.exports = {
  postSubCustomerGroup,
  getSubCustomerGroup,
  getSubCustomerGroupByCustomer,
  getSubCustomerGroupById,
  updateSubCustomerGroup,
  deleteSubCustomerGroup,
};
