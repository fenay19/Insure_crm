const httpStatus = require("http-status");
const { PatientFollowUpModel } = require("../../../models");
const mongoose = require("mongoose");

const createPatientFollowUp = async (req, res) => {
  try {
    const PatientFollowUp = new PatientFollowUpModel({ ...req.body });
    const savedPatientFollowUp = await PatientFollowUp.save();
    res.status(httpStatus.OK).json({
      success: true,
      msg: "Patient Follow Up Created Successfuly",
      data: savedPatientFollowUp,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
  }
};

const updatePatientFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const PatientFollowUp = await PatientFollowUpModel.findById(id);
    if (!PatientFollowUp) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ success: false, msg: "Patient Follow up not found" });
    }
    const updatedPatientFollowUp = await PatientFollowUpModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(httpStatus.OK).json({
      success: true,
      msg: "Patient Follow up Updated Successfuly",
      data: updatedPatientFollowUp,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
  }
};

const getAllPatientFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const PatientFollowUp = await PatientFollowUpModel.find({
      patientId: new mongoose.Types.ObjectId(id),
      createdAt: { $gte: currentDate },
    });
    res.status(httpStatus.OK).json({
      success: true,
      msg: "Patient details found",
      data: PatientFollowUp,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Internal server error" });
  }
};

const getPatientFollowUpDate = async (req, res) => {
  try {
    const { consultantId, opdPatientId } = req.params;

    const followUp = await PatientFollowUpModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    if (!followUp) {
      return res
        .status(404)
        .json({ success: false, message: "Follow-up data not found" });
    }

    return res.status(200).json({ success: true, followUp });
  } catch (error) {
    console.error("Error fetching patient follow-up date:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteFollowUpById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFollowUp = await PatientFollowUpModel.findByIdAndDelete(id);

    if (!deletedFollowUp) {
      return res
        .status(404)
        .json({ success: false, message: "Follow-up not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Follow-up deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting follow-up", error });
  }
};

module.exports = {
  createPatientFollowUp,
  updatePatientFollowUp,
  getAllPatientFollowUp,
  getPatientFollowUpDate,
  deleteFollowUpById,
};
