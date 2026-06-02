const httpStatus = require("http-status");
const {
  PatientLabRadiologyModel,
  InvestigationRadiologyMasterModel,
  InvestigationPathologyMasterModel,
} = require("../../../models");
const mongoose = require("mongoose");
const createPatientLabRadiology = async (req, res) => {
  try {
    const PatientLabRadiology = new PatientLabRadiologyModel({ ...req.body });
    const investigationIds = PatientLabRadiology.labRadiology.map(
      (investigation) => investigation.investigationId
    );
    const investigationRadiology = await InvestigationRadiologyMasterModel.find(
      { _id: { $in: investigationIds } }
    );
    const investigationPathology = await InvestigationPathologyMasterModel.find(
      { _id: { $in: investigationIds } }
    );
    if (investigationRadiology) {
      investigationRadiology.forEach((problem) => {
        const investigationRadiology = PatientLabRadiology.labRadiology.find(
          (p) => p._id === problem.investigationIds
        );
        if (investigationRadiology) {
          problem.count = (problem.count || 0) + 1;
        }
      });
      await Promise.all(
        investigationRadiology.map((problem) => problem.save())
      );
    }
    investigationPathology.forEach((problem) => {
      const investigationPathology = PatientLabRadiology.labRadiology.find(
        (p) => p._id === problem.investigationIds
      );
      if (investigationPathology) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(investigationPathology.map((problem) => problem.save()));
    const savedPatientLabRadiology = await PatientLabRadiology.save();
    res.status(httpStatus.OK).json({
      msg: "Patient Lab Radiology Created Successfuly",
      data: savedPatientLabRadiology,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientLabRadiology = async (req, res) => {
  try {
    const { id } = req.params;
    const PatientLabRadiology = await PatientLabRadiologyModel.findById(id);
    const investigationIds = PatientLabRadiology.labRadiology.map(
      (investigation) => investigation.investigationId
    );
    const investigationRadiology = await InvestigationRadiologyMasterModel.find(
      { _id: { $in: investigationIds } }
    );
    const investigationPathology = await InvestigationPathologyMasterModel.find(
      { _id: { $in: investigationIds } }
    );
    if (investigationRadiology) {
      investigationRadiology.forEach((problem) => {
        const investigationRadiology = PatientLabRadiology.labRadiology.find(
          (p) => p._id === problem.investigationIds
        );
        if (investigationRadiology) {
          problem.count = (problem.count || 0) + 1;
        }
      });
      await Promise.all(
        investigationRadiology.map((problem) => problem.save())
      );
    }
    investigationPathology.forEach((problem) => {
      const investigationPathology = PatientLabRadiology.labRadiology.find(
        (p) => p._id === problem.investigationIds
      );
      if (investigationPathology) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    await Promise.all(investigationPathology.map((problem) => problem.save()));
    const updatedPatientLabRadiology =
      await PatientLabRadiologyModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    res.status(httpStatus.OK).json({
      msg: "Patient Lab Radiology Updated Successfuly",
      data: updatedPatientLabRadiology,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientLabRadiology = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const patientProcedure = await PatientLabRadiologyModel.find({
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

const deleteLabRadiologyEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { investigationId } = req.body;

    const updatedRecord = await PatientLabRadiologyModel.findOneAndUpdate(
      { _id: id },
      { $pull: { labRadiology: { _id: investigationId } } },
      { new: true }
    );

    if (!updatedRecord) {
      return { success: false, message: "Patient record not found" };
    }

    // Optional: If no labRadiology tests remain, delete the entire record
    if (updatedRecord.labRadiology.length === 0) {
      await PatientLabRadiologyModel.findByIdAndDelete(updatedRecord._id);
    }

    return res.status(200).json({
      success: true,
      message: "LabRadiology entry deleted successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error deleting lab radiology entry:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

module.exports = {
  createPatientLabRadiology,
  updatePatientLabRadiology,
  getAllPatientLabRadiology,
  deleteLabRadiologyEntry,
};
