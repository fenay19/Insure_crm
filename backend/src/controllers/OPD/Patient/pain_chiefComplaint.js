

const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { PainChiefComplaintModel } = require("../../../models");
const PatientPainChiefComplaintModel = require("../../../models/OPD/Patient/patient_painChief_complaint");

const createPatientPainChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.body;
    const existing = await PatientPainChiefComplaintModel.findOne({
      patientId,
    });
    if (existing) {
      return res.json({ message: "Patient chief Complaint all ready exists" });
    }
    const PatientChiefComplaint = new PatientPainChiefComplaintModel({
      ...req.body,
    });

    const chiefComplaintIds = PatientChiefComplaint.chiefComplaint.map(
      (complaint) => complaint._id
    );

    const chiefComplaints = await PainChiefComplaintModel.find({
      _id: { $in: chiefComplaintIds },
    });

    chiefComplaints.forEach((problem) => {
      const chiefComplaint = PatientChiefComplaint.chiefComplaint.find(
        (p) => p._id === problem._id.toString()
      );
      if (chiefComplaint) {
        problem.count = (problem.count || 0) + 1;
      }
    });

    await Promise.all(chiefComplaints.map((problem) => problem.save()));

    const savedPatientChiefComplaint = await PatientChiefComplaint.save();

    res.status(httpStatus.OK).json({
      msg: "Patient Chief Complaint Created Successfully",
      data: savedPatientChiefComplaint,
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getPainChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientChiefComplaint = await PatientPainChiefComplaintModel.find({
      patientId,
    });
    if (!patientChiefComplaint || patientChiefComplaint.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Chief Complaints found for this patient" });
    }
    res.status(httpStatus.OK).json({ data: patientChiefComplaint });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePainChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { chiefComplaint } = req.body; // Incoming complaint (may contain _id)


    // 🔍 Find the existing patient chief complaint record
    const patientChiefComplaint = await PatientPainChiefComplaintModel.findOne({ patientId });

    if (!patientChiefComplaint) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Patient Chief Complaint not found" });
    }

    let updatedPatientChiefComplaint;

    if (chiefComplaint._id) {
      // Check if the provided _id exists in the chiefComplaint array
      const existingComplaint = patientChiefComplaint.chiefComplaint.find(
        (complaint) => complaint._id.toString() === chiefComplaint._id
      );

      if (existingComplaint) {
        // ✅ If _id exists in the array, update the specific complaint
        updatedPatientChiefComplaint = await PatientPainChiefComplaintModel.findOneAndUpdate(
          { patientId, "chiefComplaint._id": chiefComplaint._id },
          { $set: { "chiefComplaint.$": chiefComplaint } }, // Update the matched object
          { new: true }
        );
      } else {
        // ❌ If _id doesn't exist, fall back to original logic (push new entry)
        updatedPatientChiefComplaint = await PatientPainChiefComplaintModel.findOneAndUpdate(
          { patientId },
          { $push: { chiefComplaint: chiefComplaint } }, // Add new complaint
          { new: true }
        );
      }
    } else {
      // 🚀 If no _id at all, push new complaint (original logic)
      updatedPatientChiefComplaint = await PatientPainChiefComplaintModel.findOneAndUpdate(
        { patientId },
        { $push: { chiefComplaint: chiefComplaint } }, // Add new complaint
        { new: true }
      );
    }

    res.status(httpStatus.OK).json({
      msg: "Patient Chief Complaint Updated Successfully",
      data: updatedPatientChiefComplaint,
    });
  } catch (error) {
    console.error("Error updating patient chief complaint:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}; 


const deletePainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;  
    const { index } = req.query; 
    if (!id || index === undefined) {
      return res.status(400).json({ error: "Invalid request. ID and index are required." });
    }

    // Find the document
    const patientComplaint = await PatientPainChiefComplaintModel.findById(id);

    if (!patientComplaint) {
      return res.status(404).json({ error: "Pain chief complaint not found." });
    }

    // Check if index is valid
    if (index < 0 || index >= patientComplaint.chiefComplaint.length) {
      return res.status(400).json({ error: "Invalid index." });
    }

    // Remove the specific chiefComplaint at the given index
    patientComplaint.chiefComplaint.splice(index, 1);

    // Save the updated document
    await patientComplaint.save();

    res.status(200).json({
      message: "Chief complaint deleted successfully.",
      status: true,
      updatedData: patientComplaint,
    });
  } catch (err) {
    console.error("Error deleting chief complaint:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

module.exports = {
  createPatientPainChiefComplaint,
  getPainChiefComplaint,
  updatePainChiefComplaint,
  deletePainChiefComplaint,
};
