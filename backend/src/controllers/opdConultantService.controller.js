const Service = require("../models/Masters/OpdConsultant.model");
const httpStatus = require("http-status");

// Add a new service
const addService = async (req, res) => {
  try {
    const { serviceName, type, department, consultantName, consultantId, billGroup } = req.body;

    // Validate required fields
    if (!serviceName || !type || !department || !consultantName || !billGroup) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // If type is an array, create multiple services
    let newServices = [];

    if (Array.isArray(type)) {
      newServices = await Promise.all(
        type.map(async (d) => {
          const newService = new Service({
            serviceName,
            type: d,
            department,
            consultantName,
            consultantId,
            billGroup,
          });
          return await newService.save();
        })
      );
    } else {
      // If type is a single value, create one service
      const newService = new Service({
        serviceName,
        type,
        department,
        consultantName,
        consultantId,
        billGroup,
      });
      await newService.save();
      newServices.push(newService);
    }

    return res.status(201).json({ message: "Service added successfully!", data: newServices });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add service.", error: error.message });
  }
};


// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ delete: false });
    return res.status(200).json({ success : true, data: services });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch services.", error: error.message });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res.status(200).json({ data: service });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch service.", error: error.message });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate updates
    if (updates.type && !["New", "Follow Up"].includes(updates.type)) {
      return res
        .status(400)
        .json({ message: 'Invalid type. Must be "New" or "Follow Up".' });
    }

    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res
      .status(200)
      .json({ message: "Service updated successfully.", data: updatedService });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update service.", error: error.message });
  }
};

//
const updateServiceRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedServiceRate = await Service.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedServiceRate) {
      return res.status(404).json({ message: "Service rate not found" });
    }

    res.status(200).json({
      message: "Service rate updated successfully",
      data: updatedServiceRate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update service rate", error: error.message });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndUpdate(
      { _id: id },
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete service.", error: error.message });
  }
};

// bulk import
const bulkImport = async (req, res) => {
  try {
    const service = req.body;

    const result = await Service.insertMany(service);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "OPD Consultant Added Successfully", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  addService,
  deleteService,
  updateService,
  getAllServices,
  updateServiceRate,
  bulkImport,
};
