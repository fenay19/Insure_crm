const express = require("express");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ServiceRatePathologyModel = require("../../../models/Masters/Pathology_Master/serviceRatePathology");

const router = express.Router();

// Function to create a new service rate
const createServiceRate = async (req, res) => {
  try {
    const { rate, newCode, category, pathologyId } = req.body;

    if (!rate || !newCode || !category || !pathologyId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const newServiceRate = new ServiceRatePathologyModel({
      rate,
      newCode,
      category,
      pathologyId,
    });

    await newServiceRate.save();
    return res.status(httpStatus.CREATED).json({
      message: "Service rate added successfully",
      data: newServiceRate,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Function to get all service rates
// Function to get all service rates and populate pathologyId
const getAllServiceRates = async (req, res) => {
  try {
    const serviceRates = await ServiceRatePathologyModel.find().populate(
      "pathologyId"
    ); 

    return res.status(httpStatus.OK).json({ data: serviceRates });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Function to get a single service rate by ID
const getServiceRateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID" });
    }

    const serviceRate = await ServiceRatePathologyModel.findById(id);
    if (!serviceRate) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Service rate not found" });
    }

    return res.status(httpStatus.OK).json({ data: serviceRate });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Function to update a service rate
const updateServiceRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, newCode, category, pathologyId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID" });
    }

    const updatedServiceRate =
      await ServiceRatePathologyModel.findByIdAndUpdate(
        id,
        { rate, newCode, category, pathologyId },
        { new: true, runValidators: true }
      );

    if (!updatedServiceRate) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Service rate not found" });
    }

    return res.status(httpStatus.OK).json({
      message: "Service rate updated successfully",
      data: updatedServiceRate,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Function to delete a service rate
const deleteServiceRate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID" });
    }

    const deletedServiceRate =
      await ServiceRatePathologyModel.findByIdAndDelete(id);
    if (!deletedServiceRate) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Service rate not found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ message: "Service rate deleted successfully" });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  createServiceRate,
  deleteServiceRate,
  updateServiceRate,
  getAllServiceRates,
};
