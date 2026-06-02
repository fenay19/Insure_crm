const httpStatus = require("http-status");
const PatientDiagnosticsModel = require("../../../models/OPD/Patient/patient_diagnostic.model");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

// ✅ Create a new diagnostic entry
const createDiagnostic = async (req, res) => {
  try {
    const { patientId } = req.body;
    const newDiagnostic = new PatientDiagnosticsModel(req.body);

    await newDiagnostic.save();
    await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId },
      {
        $set: {
          "requests.otherDiagnostics": newDiagnostic?._id,
        },
      },
      { new: true }
    );
    res.status(201).json({
      message: "Diagnostic record created successfully",
      data: newDiagnostic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating diagnostic record",
      error: error.message,
    });
  }
};

// ✅ Get all diagnostics
const getAllDiagnostics = async (req, res) => {
  try {
    const diagnostics = await PatientDiagnosticsModel.find({
      deleted: false,
    }).populate(["patientId", "departmentId", "consultantId", "opdPatientId"]);

    res
      .status(200)
      .json({ message: "Diagnostics fetched successfully", data: diagnostics });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching diagnostics", error: error.message });
  }
};

// ✅ Get a single diagnostic by ID
const getDiagnosticById = async (req, res) => {
  try {
    const { id } = req.params;
    const diagnostic = await PatientDiagnosticsModel.findOne({
      patientId: id,
    });

    if (!diagnostic || diagnostic.deleted) {
      return res.status(404).json({ message: "Diagnostic record not found" });
    }

    res
      .status(200)
      .json({ message: "Diagnostic fetched successfully", data: diagnostic });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching diagnostic", error: error.message });
  }
};

// ✅ Update a diagnostic record
const updateDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, diagnostics } = req.body;

    const updatedDiagnostic = await PatientDiagnosticsModel.findByIdAndUpdate(
      id,
      { notes, diagnostics },
      { new: true }
    );

    if (!updatedDiagnostic) {
      return res.status(404).json({ message: "Diagnostic record not found" });
    }

    res.status(200).json({
      message: "Diagnostic updated successfully",
      data: updatedDiagnostic,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating diagnostic", error: error.message });
  }
};

// ✅ Soft delete a diagnostic record
const deleteDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDiagnostic = await PatientDiagnosticsModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedDiagnostic) {
      return res.status(404).json({ message: "Diagnostic record not found" });
    }

    res.status(200).json({
      message: "Diagnostic deleted successfully",
      data: deletedDiagnostic,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting diagnostic", error: error.message });
  }
};

module.exports = {
  createDiagnostic,
  getAllDiagnostics,
  getDiagnosticById,
  updateDiagnostic,
  deleteDiagnostic,
};
