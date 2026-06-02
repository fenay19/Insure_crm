const CustomerRegistrationModel = require("../../models/Customer/CustomerRegistration.model");
const { SuperAdminModel } = require("../../models/index");
const { TypeOfClientModel } = require("../../models/index");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminModel } = require("../../models/index");
require("dotenv").config();

// new customer registrations details
const createCustomerRegistration = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const {
      customerType,
      customerId,
      prefix,
      name,
      customerGroupName,
      dob,
      doj,
      email,
      mobile,
      panNo,
      aadharNo,
      drivingLicenseNo,
      gstNo,
      address,
      pincode,
      city,
      state,
      contactPersons,
    } = req.body;

    // 🔍 Basic validation for required fields
    const requiredFields = [name, mobile, email];

    if (requiredFields.some((field) => !field || field.trim() === "")) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    // create newCustomerRegistration object
    const newCustomerRegistration = new CustomerRegistrationModel({
      customerType,
      customerId,
      prefix,
      name,
      customerGroupName: customerGroupName || undefined,
      dob,
      doj,
      email,
      mobile,
      panNo,
      aadharNo,
      drivingLicenseNo,
      gstNo,
      address,
      pincode,
      city,
      state,
      contactPersons: contactPersons?.map((person) => ({
        name: person?.name ?? "",
        department: person?.department ?? "",
        position: person?.position ?? "",
        email: person?.email ?? "",
        phone: person?.phone ?? "",
      })),
    });
    await newCustomerRegistration.save();
    console.log("create dunction executed");

    res.status(201).json({
      message: "Customer registration created successfully",
      data: newCustomerRegistration,
    });
  } catch (error) {
    console.error("Error fetching customer registrations:", error);
  }
};

//get all customer registration details
const getAllCustomerRegistration = async (req, res) => {
  try {
    // console.log('Fetching CustomerRegistration data...');
    const customerRegistration = await CustomerRegistrationModel.find();
    // .populate(
    //   "customerGroup",
    //   "customerGroupName"
    // );
    //   .populate("contactPerson");

    // console.log(
    //   "------------------------------------------------",
    //   customerRegistration
    // );

    if (!customerRegistration || customerRegistration.length === 0) {
      return res
        .status(404)
        .json({ message: "Customer registration not found" });
    }

    // sort data from newest to oldest
    customerRegistration.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // b is newer, a is older
    );

    return res.status(200).json({ status: "true", data: customerRegistration });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCustomerRegistration,
  getAllCustomerRegistration,
};
