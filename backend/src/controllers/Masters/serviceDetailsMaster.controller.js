const httpStatus = require("http-status");
const { ServiceDetailsModel } = require("../../models");
const mongoose = require("mongoose");

const getAllServiceDetails = async (req, res) => {
  try {
    const service = await ServiceDetailsModel.find({ delete: false });
    if (!service) {
      return res.status(500).json({ err: "Error in finding inevestigation" });
    }
    return res
      .status(httpStatus.OK)
      .json({ msg: "All inevestigation found successfully", service });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const addServiceDetails = async (req, res) => {
  try {
    const services = req.body;
    if (!services) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const service = new ServiceDetailsModel(req.body);
    await service.save();
    return res
      .status(httpStatus.CREATED)
      .json({ msg: "New Service Details added successfully", services });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server Error", error });
  }
};

const editServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceDetailsModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!service) {
      return res.status(400).json({ msg: "Service Details not found" });
    }
    await service.save();
    return res
      .status(httpStatus.OK)
      .json({ msg: "Service Details updated successfully", service });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const updateServiceDetailRateAndCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, newCode } = req.body;
    if (rate === undefined && newCode === undefined) {
      return res.status(400).json({
        msg: "Please provide at least one field to update: 'rate' or 'newCode'.",
      });
    }

    // Prepare the update object dynamically
    const updateData = {};
    if (rate !== undefined) updateData.rate = rate;
    if (newCode !== undefined) updateData.newCode = newCode;

    // Update the investigation with the specific fields
    const investigation = await ServiceDetailsModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!investigation) {
      return res.status(404).json({
        msg: "Service detail not found.",
      });
    }

    return res.status(200).json({
      msg: "Service detail updated successfully.",
      investigation,
    });
  } catch (error) {
    res.status(500).json({
      err: "Server Error",
      error: error.message,
    });
  }
};

const deleteServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const investigation = await ServiceDetailsModel.findByIdAndUpdate(
      { _id: id },
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!investigation) {
      return res.status(400).json({ msg: "Service Details not found" });
    }
    await investigation.save();
    return res
      .status(httpStatus.OK)
      .json({ msg: "Service Details deleted successfully" });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const deepSanitize = (services = []) => {
  return services.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (
          (key === "department" ||
            key === "departmentId" ||
            key === "patientEncounter") &&
          value === ""
        ) {
          return [key, []];
        }
        return [key, value === "" ? null : value];
      })
    );
  });
};

const bulkImport = async (req, res) => {
  try {

    const sanitizedServices = deepSanitize(req.body);
    const result = await ServiceDetailsModel.insertMany(sanitizedServices);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "New Service Details added successfully", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateServiceRate = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

    const service = await ServiceDetailsModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ msg: "Service Details not found" });
    }

    res.status(200).json({ msg: "Service updated successfully", service });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ err: "Server Error", error });
  }
};

module.exports = {
  getAllServiceDetails,
  addServiceDetails,
  editServiceDetails,
  deleteServiceDetails,
  bulkImport,
  updateServiceRate,
  updateServiceDetailRateAndCode,
};
