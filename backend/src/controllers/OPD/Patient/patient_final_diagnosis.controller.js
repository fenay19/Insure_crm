const httpStatus = require('http-status')
const mongoose = require('mongoose')
const {
  PatientFinalDiagnosisModel,
  ProvisionalDiagnosisModel
} = require('../../../models')

const createPatientFinalDiagnosis = async (req, res) => {
  try {
    const PatientFinalDiagnosis = new PatientFinalDiagnosisModel({
      ...req.body
    })
    const FinalDiagnosisIds = PatientFinalDiagnosis.diagnosis.map(
      complaint => complaint._id
    )

    const FinalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: FinalDiagnosisIds }
    })

    FinalDiagnosis.forEach(problem => {
      const FinalDiagnosis = PatientFinalDiagnosis.diagnosis.find(
        p => p._id === problem._id.toString()
      )
      if (FinalDiagnosis) {
        problem.count = (problem.count || 0) + 1
      }
    })
    await Promise.all(FinalDiagnosis.map(problem => problem.save()))
    const savedPatientFinalDiagnosis = await PatientFinalDiagnosis.save()
    res.status(httpStatus.OK).json({
      msg: 'Patient Final Diagnosis Created Successfuly',
      data: savedPatientFinalDiagnosis
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updatePatientFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params
    const patientFinalDiagnosis = await PatientFinalDiagnosisModel.findById(id)
    if (!patientFinalDiagnosis) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Patient Final Diagnosis not found' })
    }
    const FinalDiagnosisIds = patientFinalDiagnosis.diagnosis.map(
      complaint => complaint._id
    )
    const FinalDiagnosis = await ProvisionalDiagnosisModel.find({
      _id: { $in: FinalDiagnosisIds }
    })
    FinalDiagnosis.forEach(problem => {
      const FinalDiagnosis = patientFinalDiagnosis.diagnosis.find(
        p => p._id === problem._id.toString()
      )
      if (FinalDiagnosis) {
        problem.count = (problem.count || 0) + 1
      }
    })
    await Promise.all(FinalDiagnosis.map(problem => problem.save()))
    const updatedPatientFinalDiagnosis =
      await PatientFinalDiagnosisModel.findByIdAndUpdate(id, req.body, {
        new: true
      })
    res.status(httpStatus.OK).json({
      msg: 'Patient Final Diagnosis Updated Successfuly',
      data: updatedPatientFinalDiagnosis
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getAllPatientFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const patientFinalDiagnosis = await PatientFinalDiagnosisModel.find({
      patientId: new mongoose.Types.ObjectId(id)
    })
    res
      .status(httpStatus.OK)
      .json({ msg: 'Patient details found', data: patientFinalDiagnosis })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

const getPatientFinalDiagnosis = async (req, res) => {
  try {
    const { consultantId, opdPatientId } = req.params;

    const finalDiagnosis = await PatientFinalDiagnosisModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    if (!finalDiagnosis) {
      return res.status(404).json({ success: false, message: 'Final diagnosis not found' });
    }

    return res.status(200).json({ success: true, finalDiagnosis });
  } catch (error) {
    console.error('Error fetching patient final diagnosis:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  createPatientFinalDiagnosis,
  updatePatientFinalDiagnosis,
  getAllPatientFinalDiagnosis,
  getPatientFinalDiagnosis
}
