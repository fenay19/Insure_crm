const mongoose = require("mongoose");
const customerGroupModel = require("../../models/CustomerGroup/CustomerGroup.model");
require("dotenv").config();

// new customer registrations details
const postCustomerGroup = async (req, res) => {
  try {
    console.log("reached Cntroller");
    console.log("Request body:", req.body);
    const {
      customerGroupId,
      customerGroupName,
      subCustomerGroupName,
      prefix,
      customerName,
      incarporatoionDate,
      email,
      mobile,
      panNo,
      adhaarNo,
      DLNo,
      gstNo,
      address,
      pincode,
      city,
      state,
      createdBy,
      companyId,
      contactPerson,
    } = req.body;

    // 🔍 Basic validation for required fields
    const requiredFields = [customerGroupName, mobile, email];

    if (requiredFields.some((field) => !field || field.trim() === "")) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    // create newCustomerRegistration object
    const newcustomerGroup = new customerGroupModel({
      customerGroupId,
      customerGroupName,
      subCustomerGroupName,
      prefix,
      customerName,
      incarporatoionDate,
      email,
      mobile,
      panNo,
      adhaarNo,
      DLNo,
      gstNo,
      address,
      pincode,
      city,
      state,
      createdBy,
      companyId,
      contactPersons: contactPerson?.map((person) => ({
        name: person?.name ?? "",
        department: person?.department ?? "",
        address: person?.address ?? "",
        email: person?.email ?? "",
        phone: person?.phone ?? "",
      })),
    });
    await newcustomerGroup.save();
    console.log("create dunction executed");

    res.status(201).json({
      message: "customer Group created successfully",
      data: newcustomerGroup,
    });
  } catch (error) {
    console.error("Error fetching customer Groups:", error);
  }
};

//get all customer Group details
const getCustomerGroup = async (req, res) => {
  try {
    const customerGroup = await customerGroupModel
      .find()
      .populate("prefix")
      .populate("contactPerson");

    // console.log(
    //   "------------------------------------------------",
    //   customerGroup
    // );

    if (!customerGroup || customerGroup.length === 0) {
      return res.status(404).json({ message: "Customer group not found" });
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

const getCustomerGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await customerGroupModel.findById(id);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get Group by ID Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// update policy data
const updateCustomerGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    let updateData = { ...req.body };
    console.log("Inside update ", groupId);

    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Valid Group ID is required" });
    }
    console.log("Edited object ", updateData);
    // Update only provided fields; $set ensures only changed fields are updated.
    const updatedGroupDetail = await customerGroupModel.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedGroupDetail) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: updatedGroupDetail,
    });
  } catch (error) {
    console.error("Error updating Group:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating Group",
      error: error.message,
    });
  }
};

// delete policy Detail
const deleteCustomerGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomerGroup = await customerGroupModel.findByIdAndDelete(id);

    if (!deletedCustomerGroup) {
      return res.status(404).json({ message: "Customer Group not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Customer Group deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting Customer Group" });
  }
};

module.exports = {
  postCustomerGroup,
  getCustomerGroup,
  getCustomerGroupById,
  updateCustomerGroup,
  deleteCustomerGroup,
};
