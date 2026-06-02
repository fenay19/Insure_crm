const httpStatus = require("http-status");
const EmergencyPatientProvisionalDiagnosisModel = require("../../../models/Emergency/Patient/emergency_patient_provisional_diagnosis.modal");
const { ProvisionalDiagnosisModel } = require("../../../models");

const createPatientProvisionalDiagnosis = async (req, res) => {
  try {
    const PatientProvisionalDiagnosis =
      new EmergencyPatientProvisionalDiagnosisModel({ ...req.body });
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
    const savedEmergencyPatientProvisionalDiagnosis =
      await PatientProvisionalDiagnosis.save();
    res
      .status(httpStatus.OK)
      .json({
        msg: " Emergency Patient Provisional Diagnosis Created Successfuly",
        data: savedEmergencyPatientProvisionalDiagnosis,
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
      await EmergencyPatientProvisionalDiagnosisModel.findById(id);
    if (!patientProvisionalDiagnosis) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Emergency Patient Provisional Diagnosis not found" });
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
    const updatedEmergencyPatientProvisionalDiagnosis =
      await EmergencyPatientProvisionalDiagnosisModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
    res
      .status(httpStatus.OK)
      .json({
        msg: "Emergency Patient Provisional Diagnosis Updated Successfuly",
        data: updatedEmergencyPatientProvisionalDiagnosis,
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
    const patientProvisionalDiagnosis =
      await EmergencyPatientProvisionalDiagnosisModel.find({ patientId: id });
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

module.exports = {
  createPatientProvisionalDiagnosis,
  updatePatientProvisionalDiagnosis,
  getAllPatientProvisionalDiagnosis,
};
