const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { ChiefComplaintModel } = require("../../../models");
const PatientChiefComplaintModel = require("../../../models/OPD/Patient/patient_chief_complaint.model");
const patientPainChiefComplaint = require("../../../models/OPD/Patient/patient_painChief_complaint");

const createPatientChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.body;
    const existing = await PatientChiefComplaintModel.findOne({ patientId });
    if (existing) {
      return res.json({ message: "Patient chief Complaint all ready exists" });
    }
    const PatientChiefComplaint = new PatientChiefComplaintModel({
      ...req.body,
    });

    const chiefComplaintIds = PatientChiefComplaint.chiefComplaint.map(
      (complaint) => complaint._id
    );

    const chiefComplaints = await ChiefComplaintModel.find({
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

const updatePatientChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { chiefComplaint } = req.body; // Incoming complaint (may contain _id)

    // 🔍 Find the existing patient chief complaint record
    const patientChiefComplaint = await PatientChiefComplaintModel.findOne({
      patientId,
    });

    if (!patientChiefComplaint) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Patient Chief Complaint not found" });
    }

    let updatedPatientChiefComplaint;

    if (chiefComplaint._id) {
      // Check if the provided _id exists in the chiefComplaint array
      const existingComplaint = patientChiefComplaint?.chiefComplaint?.find(
        (complaint) => complaint?._id?.toString() === chiefComplaint?._id
      );

      if (existingComplaint) {
        // ✅ If _id exists in the array, update the specific complaint
        updatedPatientChiefComplaint =
          await PatientChiefComplaintModel.findOneAndUpdate(
            { patientId, "chiefComplaint._id": chiefComplaint._id },
            { $set: { "chiefComplaint.$": chiefComplaint } }, // Update the matched object
            { new: true }
          );
      } else {
        // ❌ If _id doesn't exist, fall back to original logic (push new entry)
        updatedPatientChiefComplaint =
          await PatientChiefComplaintModel.findOneAndUpdate(
            { patientId },
            { $push: { chiefComplaint: chiefComplaint } }, // Add new complaint
            { new: true }
          );
      }
    } else {
      // 🚀 If no _id at all, push new complaint (original logic)
      updatedPatientChiefComplaint =
        await PatientChiefComplaintModel.findOneAndUpdate(
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
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const chiefComplaints = await ChiefComplaintModel.find({
      departmentId: new mongoose.Types.ObjectId(id),
    });

    if (!chiefComplaints) {
      res.status(401).json({ msg: "Data is not found" });
    }

    res.status(httpStatus.OK).json({
      msg: "Chief Complaints Retrieved Successfully",
      data: chiefComplaints,
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const getPatientChiefComplaint = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientChiefComplaint = await PatientChiefComplaintModel.find({
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

const getPatientChiefComplaintByPatientAndConsultant = async (req, res) => {
  try {
    const { consultantId, opdPatientId } = req.params;

    // Find the chief complaints based on consultantId and opdPatientId
    const chiefComplaints = await PatientChiefComplaintModel.find({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    // If no chief complaints are found, return a 404 response
    if (!chiefComplaints) {
      return res.status(404).json({
        success: false,
        message:
          "Chief complaints not found for the given patient and consultant",
      });
    }

    // Return the found chief complaints
    return res.status(200).json({
      success: true,
      message: "Chief complaints found successfully",
      chiefComplaints: chiefComplaints,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching chief complaints:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching chief complaints",
      error: error.message,
    });
  }
};

const deletePainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;  // Document ID
    const { index } = req.query; // Index of chiefComplaint to delete
console.log(req.body)
    if (!id || index === undefined) {
      return res.status(400).json({ error: "Invalid request. ID and index are required." });
    }

    // Find the document
    const patientComplaint = await PatientChiefComplaintModel.findById(id);

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
  createPatientChiefComplaint,
  updatePatientChiefComplaint,
  getAllPatientChiefComplaint,
  getPatientChiefComplaint,
  getPatientChiefComplaintByPatientAndConsultant,
  deletePainChiefComplaint,
};
