const httpStatus = require("http-status");
const PatientPathologyModel = require("../../../models/OPD/Patient/patient_pathology.model");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

// ✅ Create a new pathology entry
const createPathology = async (req, res) => {
  try {
    const { patientId } = req.body;
    const newPathology = new PatientPathologyModel(req.body);
    await newPathology.save();
    await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId },
      {
        $set: {
          "requests.pathology": newPathology?._id,
        },
      },
      { new: true }
    );
    res.status(201).json({
      message: "Pathology record created successfully",
      data: newPathology,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating pathology record",
      error: error.message,
    });
  }
};

// ✅ Get all pathology records
const getAllPathologies = async (req, res) => {
  try {
    const pathologies = await PatientPathologyModel.find({
      deleted: false,
    });

    res
      .status(200)
      .json({ message: "Pathologies fetched successfully", data: pathologies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pathologies", error: error.message });
  }
};

// ✅ Get a single pathology record by ID
const getPathologyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pathology = await PatientPathologyModel.findOne({ patientId: id });

    if (!pathology || pathology.deleted) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res
      .status(200)
      .json({ message: "Pathology fetched successfully", data: pathology });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pathology", error: error.message });
  }
};

// ✅ Update a pathology record
const updatePathology = async (req, res) => {
  try {
    const { id } = req.params;
    const { pathology } = req.body;

    const updatedPathology = await PatientPathologyModel.findByIdAndUpdate(
      id,
      { pathology },
      { new: true }
    );

    if (!updatedPathology) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res.status(200).json({
      message: "Pathology updated successfully",
      data: updatedPathology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating pathology", error: error.message });
  }
};

// ✅ Soft delete a pathology record
const deletePathology = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPathology = await PatientPathologyModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedPathology) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res.status(200).json({
      message: "Pathology deleted successfully",
      data: deletedPathology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pathology", error: error.message });
  }
};

module.exports = {
  createPathology,
  getAllPathologies,
  getPathologyById,
  updatePathology,
  deletePathology,
};
