const httpStatus = require("http-status");
const {
  PatientRemarkModel,
  PatientGlassPrescriptionModel,
} = require("../../../models/OPD/Patient/patient_glasss_prescription.model");
const mongoose = require("mongoose");

// GLASS PRESCRIPTION CONTROLLERS

const createPatientGlassPrescription = async (req, res) => {
  try {
    // Create new prescription entry
    const patientGlassPrescription = new PatientGlassPrescriptionModel(
      req.body
    );

    // Save to database
    const savedPatientGlassPrescription = await patientGlassPrescription.save();

    return res.status(httpStatus.CREATED).json({
      msg: "Patient Glass Prescription Created Successfully",
      data: savedPatientGlassPrescription,
      success: true,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: "Validation Error",
        details: error.message,
      });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
};
const updatePatientGlassPrescription = async (req, res) => {
  try {
    const { patientId, eyeId } = req.params;
    const updatedData = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(eyeId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the prescription document
    const prescription = await PatientGlassPrescriptionModel.findOne({
      patientId,
    });
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    // Identify whether the eye belongs to "right" or "left", always using index 0
    let eyeType = null;

    if (prescription.right[0]?._id.toString() === eyeId) {
      eyeType = "right";
    } else if (prescription.left[0]?._id.toString() === eyeId) {
      eyeType = "left";
    } else {
      return res.status(404).json({ message: "Eye prescription not found" });
    }
    // Ensure we're updating only the required fields while keeping the rest of the data
    prescription[eyeType][0] = {
      ...prescription[eyeType][0], // Keep other properties
      distance: updatedData[eyeType].distance, // Replace distance
      add: updatedData[eyeType].add, // Replace add
    };

    // // Save the updated prescription
    await prescription.save();

    return res.status(200).json({
      message: "Eye prescription updated successfully",
      success: true,
      updatedPrescription: prescription,
    });
  } catch (error) {
    console.error("Error updating eye prescription:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPatientGlassPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);

    const prescriptions = await PatientGlassPrescriptionModel.find({
      patientId: objectId,
    });

    if (!prescriptions.length) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No prescriptions found for this patient" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Patient details found", data: prescriptions });
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const deletePatientGlassPrescription = async (req, res) => {
  try {
    const { patientId, eyeId } = req.params; // prescriptionId -> main document ID, eyeId -> right/left object ID

    if (!mongoose.Types.ObjectId.isValid(eyeId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find and update the prescription document by pulling out the matching right/left object
    const updatedPrescription =
      await PatientGlassPrescriptionModel.findByIdAndUpdate(
        patientId,
        {
          $pull: {
            right: { _id: eyeId }, // Remove if the ID matches in "right"
            left: { _id: eyeId }, // Remove if the ID matches in "left"
          },
        },
        { new: true }
      );

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({
      message: "Eye prescription deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting eye prescription:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// PATIENT REMARK CONTROLLERS

// Add a new patient remark
const addPatientRemark = async (req, res) => {
  try {
    console.log(req.body)
    const { patientId, departmentId, consultantId, visionRemark, visionAdvice } = req.body;

    const newRemark = new PatientRemarkModel({
      patientId,
      departmentId,
      consultantId,
      visionRemark,
      visionAdvice,
    });

    const savedRemark = await newRemark.save();
    res.status(201).json({ success: true, data: savedRemark });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding remark", error });
  }
};

// Get all patient remarks (excluding deleted)
const getAllPatientRemarks = async (req, res) => {
  try {
    const remarks = await PatientRemarkModel.find({ deleted: false })
      .populate("patientId", "name") // You can adjust fields
      .populate("departmentId", "name")
      .populate("consultantId", "name");

    res.status(200).json({ success: true, data: remarks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching remarks", error });
  }
};

// Get remark by ID
const getPatientRemarkById = async (req, res) => {
  try {
    const remark = await PatientRemarkModel.findOne({ patientId: req.params.id, deleted: false });

    if (!remark) {
      return res.status(404).json({ success: false, message: "Remark not found" });
    }

    res.status(200).json({ success: true, data: [remark] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching remark", error });
  }
};

// Update patient remark
const updatePatientRemark = async (req, res) => {
  try {
    const updated = await PatientRemarkModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Remark not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating remark", error });
  }
};

// Soft delete patient remark
const deletePatientRemark = async (req, res) => {
  try {
    const deletedRemark = await PatientRemarkModel.findByIdAndUpdate(
      req.params.id,
      { $set: { deleted: true } },
      { new: true }
    );

    if (!deletedRemark) {
      return res.status(404).json({ success: false, message: "Remark not found" });
    }

    res.status(200).json({ success: true, message: "Remark deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting remark", error });
  }
};


module.exports = {
  createPatientGlassPrescription,
  updatePatientGlassPrescription,
  getAllPatientGlassPrescription,
  deletePatientGlassPrescription,
  addPatientRemark,
  getPatientRemarkById,
  updatePatientRemark
};
