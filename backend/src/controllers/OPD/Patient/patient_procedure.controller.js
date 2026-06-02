const httpStatus = require("http-status");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

const {
  PatientProcedureModel,
  SurgeryPackageModel,
  ProcedureModel,
} = require("../../../models");
const mongoose = require("mongoose");

const createPatientProcedure = async (req, res) => {
  try {
    const { patientId } = req.body;
    const PatientProcedure = new PatientProcedureModel({ ...req.body });
    const surgeryPackageIds = PatientProcedure.procedure.map(
      (procedure) => procedure._id
    );
    const surgeryPackage = await ProcedureModel.find({
      _id: { $in: surgeryPackageIds },
    });
    surgeryPackage.forEach((problem) => {
      const surgeryPackage = PatientProcedure.procedure.find(
        (p) => p._id === problem._id.toString()
      );
      if (surgeryPackage) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(surgeryPackage.map((problem) => problem.save()));
    const savedPatientProcedure = await PatientProcedure.save();
    await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId },
      {
        $set: {
          "requests.procedure": savedPatientProcedure?._id,
        },
      },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      msg: "Patient Procedure Created Successfuly",
      data: savedPatientProcedure,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const patientProcedure = await PatientProcedureModel.findById(id);
    if (!patientProcedure) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Patient Procedure not found" });
    }
    const surgeryPackageIds = patientProcedure.procedure.map(
      (procedure) => procedure._id
    );
    const surgeryPackage = await ProcedureModel.find({
      _id: { $in: surgeryPackageIds },
    });
    surgeryPackage.forEach((problem) => {
      const surgeryPackage = patientProcedure.procedure.find(
        (p) => p._id === problem._id.toString()
      );
      if (surgeryPackage) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(surgeryPackage.map((problem) => problem.save()));
    const updatedPatientProcedure =
      await PatientProcedureModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    res.status(httpStatus.OK).json({
      msg: "Patient Procedure Updated Successfuly",
      data: updatedPatientProcedure,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const getAllPatientProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const patientProcedure = await PatientProcedureModel.find({
      patientId: new mongoose.Types.ObjectId(id),
      createdAt: { $gte: currentDate },
    });
    res
      .status(httpStatus.OK)
      .json({ msg: "Patient details found", data: patientProcedure });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const getPatientProcedures = async (req, res) => {
  try {
    const { consultantId, opdPatientId } = req.params;

    // Fetch the patient's procedures based on consultantId and opdPatientId
    const proceduresData = await PatientProcedureModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    return res.status(200).json({ success: true, proceduresData });
  } catch (error) {
    console.error("Error fetching patient procedures:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createPatientProcedure,
  updatePatientProcedure,
  getAllPatientProcedure,
  getPatientProcedures,
};
