const httpStatus = require("http-status");
const EmergencyPatientFinalDiagnosisModel = require("../../../models/Emergency/Patient/emergency_patient_finalDiagnosis.model");
const { ProvisionalDiagnosisModel } = require("../../../models");

const createPatientFinalDiagnosis = async (req, res) => {
  try {
    const PatientFinalDiagnosis = new EmergencyPatientFinalDiagnosisModel({
      ...req.body,
    });
    const FinalDiagnosisIds = PatientFinalDiagnosis.diagnosis.map(
      (complaint) => complaint._id
    );

    const FinalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: FinalDiagnosisIds },
    });

    FinalDiagnosis.forEach((problem) => {
      const FinalDiagnosis = PatientFinalDiagnosis.diagnosis.find(
        (p) => p._id === problem._id.toString()
      );
      if (FinalDiagnosis) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(FinalDiagnosis.map((problem) => problem.save()));
    const savedPatientFinalDiagnosis = await PatientFinalDiagnosis.save();
    res.status(httpStatus.OK).json({
      msg: "Emergency Patient Final Diagnosis Created Successfuly",
      data: savedPatientFinalDiagnosis,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const patientFinalDiagnosis =
      await EmergencyPatientFinalDiagnosisModel.findById(id);
    if (!patientFinalDiagnosis) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Emergency Patient Final Diagnosis not found" });
    }
    const FinalDiagnosisIds = patientFinalDiagnosis.diagnosis.map(
      (complaint) => complaint._id
    );
    const FinalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: FinalDiagnosisIds },
    });
    FinalDiagnosis.forEach((problem) => {
      const FinalDiagnosis = patientFinalDiagnosis.diagnosis.find(
        (p) => p._id === problem._id.toString()
      );
      if (FinalDiagnosis) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(FinalDiagnosis.map((problem) => problem.save()));
    const updatedPatientFinalDiagnosis =
      await EmergencyPatientFinalDiagnosisModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
    res.status(httpStatus.OK).json({
      msg: "Emergency Patient Final Diagnosis Updated Successfuly",
      data: updatedPatientFinalDiagnosis,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;

    const patientFinalDiagnosis =
      await EmergencyPatientFinalDiagnosisModel.find({
        patientId: id,
      });
    res
      .status(httpStatus.OK)
      .json({ msg: "Emergency Patient details found", data: patientFinalDiagnosis });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

module.exports = {
  createPatientFinalDiagnosis,
  updatePatientFinalDiagnosis,
  getAllPatientFinalDiagnosis,
};
