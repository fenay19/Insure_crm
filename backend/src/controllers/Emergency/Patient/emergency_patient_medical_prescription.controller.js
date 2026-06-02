const httpStatus = require('http-status')
const {
  PatientGlassPrescriptionModel,
  MedicinesModel,
  OPDModel
} = require('../../../models')
const EmergencyPatientMedicalPrescriptionModel = require('../../../models/Emergency/Patient/emergency_patient_medical_prescription.model')


const createPatientMedicalPrescription = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear()
    const latestPrescription =
      await EmergencyPatientMedicalPrescriptionModel.findOne().sort({
        intentNumber: -1
      })
    let latestSerialNumber = 0

    if (latestPrescription && latestPrescription.intentNumber) {
      const latestYear = parseInt(
        latestPrescription.intentNumber.substring(0, 4)
      )
      if (latestYear === currentYear) {
        latestSerialNumber = parseInt(
          latestPrescription.intentNumber.substring(4) 
        )
      }
    }

    // Increment the serial number
    const newSerialNumber = String(latestSerialNumber + 1).padStart(6, '0')
    const intentNumber = `${currentYear}${newSerialNumber}`

    req.body.intentNumber = intentNumber

    const PatientMedicine = new EmergencyPatientMedicalPrescriptionModel({
      ...req.body
    })

    const MedicalPrescriptionIds = PatientMedicine.prescription.map(
      complaint => complaint._id
    )
    const MedicalPrescriptions = await MedicinesModel.find({
      _id: { $in: MedicalPrescriptionIds }
    })

    MedicalPrescriptions.forEach(problem => {
      const matchedPrescription = PatientMedicine.prescription.find(
        p => p._id.toString() === problem._id.toString()
      )
      if (matchedPrescription) {
        problem.count = (problem.count || 0) + 1 // Increment the count of matched prescription
      }
    })

    await Promise.all(MedicalPrescriptions.map(problem => problem.save()))
    const savedPatientMedicalPrescription = await PatientMedicine.save()

    res.status(httpStatus.OK).json({
      msg: 'Emergency Patient Medical Prescription Created Successfully',
      data: savedPatientMedicalPrescription
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updatePatientMedicalPrescription = async (req, res) => {
  try {
    const { id } = req.params
    const patientMedicalPrescription =
      await EmergencyPatientMedicalPrescriptionModel.findById(id)
    if (!patientMedicalPrescription) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Emergency Patient Medical Prescription not found' })
    }
    const MedicalPrescriptionIds = patientMedicalPrescription.prescription.map(
      complaint => complaint._id
    )
    const MedicalPrescriptions = await MedicinesModel.find({
      _id: { $in: MedicalPrescriptionIds }
    })
    MedicalPrescriptions.forEach(problem => {
      const MedicalPrescriptions = patientMedicalPrescription.prescription.find(
        p => p._id === problem._id.toString()
      )
      if (MedicalPrescriptions) {
        problem.count = (problem.count || 0) + 1
      }
    })
    await Promise.all(MedicalPrescriptions.map(problem => problem.save()))
    const updatedPatientMedicalPrescription =
      await EmergencyPatientMedicalPrescriptionModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true
        }
      )
    res.status(httpStatus.OK).json({
      msg: 'Emergency Patient Medical Prescription Updated Successfuly',
      data: updatedPatientMedicalPrescription
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getAllPatientMedicalPrescription = async (req, res) => {
  console.log(req.params.id)
  try {
    const { id } = req.params;
    const patientMedicalPrescription =
      await EmergencyPatientMedicalPrescriptionModel.find({
        patientId: id,
      });
    res
      .status(httpStatus.OK)
      .json({ msg: "Patient details found", data: patientMedicalPrescription });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
}

const getOldPrescription = async (req, res) => {
  try {
    const { patientId, consultantId } = req.params

    const opdRecords = await OPDModel.find({ patientId, consultantId })

    if (!opdRecords.length) {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: 'No OPD records found for the given patient and consultant.'
      })
    }

    const patientData = []
    for (const opd of opdRecords) {
      const currentDate = new Date(opd.createdAt).toISOString().split('T')[0]

      const medicalPrescriptions =
        await EmergencyPatientMedicalPrescriptionModel.find({
          patientId: opd._id.toString(),
          consultantId: consultantId
        })

      const glassPrescriptions = await PatientGlassPrescriptionModel.find({
        patientId: opd._id.toString(),
        consultantId: consultantId
      })

      patientData.push({
        medical: medicalPrescriptions,
        glass: glassPrescriptions,
        createdAt: currentDate
      })
    }
    res.status(httpStatus.OK).json({
      msg: 'Successfully fetched prescriptions',
      presecription: patientData
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

module.exports = {
  createPatientMedicalPrescription,
  updatePatientMedicalPrescription,
  getAllPatientMedicalPrescription,
  getOldPrescription
}
