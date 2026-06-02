const httpStatus = require("http-status");
const PatientRadiologyModel = require("../../../models/OPD/Patient/patient_radiology.model");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

// ✅ Create a new radiology entry
const createRadiology = async (req, res) => {
  try {
    const { patientId } = req.body;
    const newRadiology = new PatientRadiologyModel(req.body);
    await newRadiology.save();
    await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId },
      {
        $set: {
          "requests.radiology": newRadiology?._id,
        },
      },
      { new: true }
    );
    res.status(201).json({
      message: "Radiology record created successfully",
      data: newRadiology,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating radiology record",
      error: error.message,
    });
  }
};

// ✅ Get all radiology records
const getAllRadiologies = async (req, res) => {
  try {
    const radiologies = await PatientRadiologyModel.find({
      deleted: false,
    }).populate(["patientId", "departmentId", "consultantId", "opdPatientId"]);

    res
      .status(200)
      .json({ message: "Radiologies fetched successfully", data: radiologies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching radiologies", error: error.message });
  }
};

// ✅ Get a single radiology record by ID
const getRadiologyById = async (req, res) => {
  try {
    const { id } = req.params;
    const radiology = await PatientRadiologyModel.findOne({ patientId: id });

    if (!radiology || radiology.deleted) {
      return res.status(404).json({ message: "Radiology record not found" });
    }

    res
      .status(200)
      .json({ message: "Radiology fetched successfully", data: radiology });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching radiology", error: error.message });
  }
};

// ✅ Update a radiology record
const updateRadiology = async (req, res) => {
  try {
    const { id } = req.params;
    const { radiology } = req.body;

    const updatedRadiology = await PatientRadiologyModel.findByIdAndUpdate(
      id,
      { radiology },
      { new: true }
    );

    if (!updatedRadiology) {
      return res.status(404).json({ message: "Radiology record not found" });
    }

    res.status(200).json({
      message: "Radiology updated successfully",
      data: updatedRadiology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating radiology", error: error.message });
  }
};

// ✅ Soft delete a radiology record
const deleteRadiology = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRadiology = await PatientRadiologyModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedRadiology) {
      return res.status(404).json({ message: "Radiology record not found" });
    }

    res.status(200).json({
      message: "Radiology deleted successfully",
      data: deletedRadiology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting radiology", error: error.message });
  }
};

module.exports = {
  createRadiology,
  getAllRadiologies,
  getRadiologyById,
  updateRadiology,
  deleteRadiology,
};
