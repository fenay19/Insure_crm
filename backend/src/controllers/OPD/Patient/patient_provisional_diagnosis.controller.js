const httpStatus = require("http-status");
const mongoose = require("mongoose");
const {
  PatientProvisionalDiagnosisModel,
  ProvisionalDiagnosisModel,
} = require("../../../models");

const createPatientProvisionalDiagnosis = async (req, res) => {
 
  try {
    const PatientProvisionalDiagnosis = new PatientProvisionalDiagnosisModel({
      ...req.body,
    });
    const provisionalDiagnosisIds = PatientProvisionalDiagnosis.diagnosis.map(
      (complaint) => complaint._id
    );
    const provisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: provisionalDiagnosisIds },
    });
    provisionalDiagnosis.forEach((problem) => {
      const provisionalDiagnosis = PatientProvisionalDiagnosis.diagnosis.find(
        (p) => p._id === problem._id.toString()
      );
      if (provisionalDiagnosis) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(provisionalDiagnosis.map((problem) => problem.save()));
    const savedPatientProvisionalDiagnosis =
      await PatientProvisionalDiagnosis.save();
    res
      .status(httpStatus.OK)
      .json({
        msg: "Patient Provisional Diagnosis Created Successfuly",
        data: savedPatientProvisionalDiagnosis,
      });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientProvisionalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const patientProvisionalDiagnosis =
      await PatientProvisionalDiagnosisModel.findById(id);
    if (!patientProvisionalDiagnosis) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Patient Provisional Diagnosis not found" });
    }
    const provisionalDiagnosisIds = patientProvisionalDiagnosis.diagnosis.map(
      (complaint) => complaint._id
    );
    const provisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: provisionalDiagnosisIds },
    });
    provisionalDiagnosis.forEach((problem) => {
      const provisionalDiagnosis = patientProvisionalDiagnosis.diagnosis.find(
        (p) => p._id === problem._id.toString()
      );
      if (provisionalDiagnosis) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(provisionalDiagnosis.map((problem) => problem.save()));
    const updatedPatientProvisionalDiagnosis =
      await PatientProvisionalDiagnosisModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    res
      .status(httpStatus.OK)
      .json({
        msg: "Patient Provisional Diagnosis Updated Successfuly",
        data: updatedPatientProvisionalDiagnosis,
      });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientProvisionalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const patientProvisionalDiagnosis =
      await PatientProvisionalDiagnosisModel.find({
        patientId: new mongoose.Types.ObjectId(id),
       
      });
    res
      .status(httpStatus.OK)
      .json({
        msg: "Patient details found",
        data: patientProvisionalDiagnosis,
      });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const getAllPatientProvisionalDiagnosisById = async (req, res) => {
  try {
    const { id } = req.params; // Assuming 'id' is the patientId

    const patientProvisionalDiagnosis =
      await PatientProvisionalDiagnosisModel.find({
        patientId: new mongoose.Types.ObjectId(id), // Filtering by patientId
      });

    res.status(httpStatus.OK).json({
      msg: "Patient details found",
      data: patientProvisionalDiagnosis,
    });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error",
    });
  }
};


const getPatientProvisionalDiagnosis = async (req, res) => {
  const { consultantId, opdPatientId } = req.params;

  try {
    // Fetch provisional diagnosis data from the database
    const provisionalDiagnosis = await PatientProvisionalDiagnosisModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    // If no provisional diagnosis is found, return a 404 response
    if (!provisionalDiagnosis) {
      return res.status(404).json({
        success: false,
        message: "Provisional diagnosis not found for the given patient and consultant.",
      });
    }

    // Return the provisional diagnosis data
    return res.status(200).json({
      success: true,
      provisionalDiagnosis: provisionalDiagnosis,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching provisional diagnosis:", error);

    // Return a 500 response for internal server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  createPatientProvisionalDiagnosis,
  updatePatientProvisionalDiagnosis,
  getAllPatientProvisionalDiagnosis,
  getAllPatientProvisionalDiagnosisById,
  getPatientProvisionalDiagnosis
};
