const { OPDModel, InvoiceNoModel } = require('../../models')
const {
  ConsultantModel,
  EmployeeModel,
  ServiceDetailsModel,
  OPDPackageModel
} = require('../../models')
const { patientDetailsModel } = require('../../models')
const { MedicalProblemModel, DrugHistoryModel } = require('../../models')
const { DrugAllergyModel, FoodAllergyModel } = require('../../models')
const {
  GeneralAllergyModel,
  GynacHistoryModel,
  ObstetricHistoryModel,
  NutritionalHistoryModel,
  PediatricHistoryModel,
  OtherHistoryModel
} = require('../../models')
const OpdPatientModel = require('../../models/appointment-confirm/opdPatient.model')
const FamilyHistoryProblem = require('../../models/OPD/familyHistory.model')

const { FamilyMemberModel } = require('../../models')
const { LifeStyleModel } = require('../../models')
const { ProcedureModel, PatientProcedureModel } = require('../../models')
const { InstructionModel, PatientInstructionModel } = require('../../models')
const {
  ChiefComplaintModel,
  PresentIllnessHistoryModel,
  PatientChiefComplaintModel
} = require('../../models')
const PainChiefComplaintModel = require('../../models/OPD/painChiefComplaint.model')
const {
  ProvisionalDiagnosisModel,
  FinalDiagnosisModel,
  PatientProvisionalDiagnosisModel
} = require('../../models')
const { OPDMenuModel } = require('../../models')
const { RiskFactorModel } = require('../../models')
const {
  GeneralExaminationModel,
  LocalExaminationModel,
  PatientExaminationModel
} = require('../../models')
const {
  PatientHistroyModel,
  PatientPresentIllnessHistoryModel,
  PatientMedicalPrescriptionModel,
  PatientFinalDiagnosisModel,
  PatientFollowUpModel,
  PatientGlassPrescriptionModel
} = require('../../models')
const { SystematicExaminationModel } = require('../../models')
const { OtherExaminationModel } = require('../../models')
const { SurgeryPackageModel } = require('../../models')
const { OPDBillingModel } = require('../../models')
const {
  AdminModel,
  InvestigationPathologyMasterModel,
  InvestigationRadiologyMasterModel,
  PatientVitalsModel,
  PatientLabRadiologyModel
} = require('../../models')
const EmergencyPatientMedicalPrescriptionModel = require('../../models/Emergency/Patient/emergency_patient_medical_prescription.model')

const opdRegSchemaValidation = require('../../validations/OPD/opd.validation')

const httpStatus = require('http-status')
const mongoose = require('mongoose')

let serialCounter = 1

const generateToken = () => {
  const serialNumber = serialCounter.toString(36).padStart(4, '0')
  serialCounter++
  return serialNumber
}

let opdCounter = 1
const generateOpdNumber = () => {
  const year = new Date().getFullYear()
  const serialNumber = opdCounter.toString().padStart(5, '0')
  opdCounter++
  return `OP-${year}-${serialNumber}`
}

const createOpdRegistion = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findOne({ _id: userId })

    if (user.role == 'admin') {
      const { error } = opdRegSchemaValidation.validate(req.body)
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message })
      }
      req.body.user = user.refId
      // console.log(req.body.user);
      const tokenNumber = generateToken()
      const opdNumber = generateOpdNumber()
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name
      })
      const savedOpdReg = await newOpd.save()
      res
        .status(httpStatus.CREATED)
        .json({ msg: 'OPD Registration Done ', data: savedOpdReg })
    } else if (user.role == 'doctor') {
      const doctor = await ConsultantModel.findOne({ _id: user.refId })
      const { error } = opdRegSchemaValidation.validate(req.body)
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message })
      }
      req.body.user = doctor.basicDetails.user
      console.log(req.body.user)
      const tokenNumber = generateToken()
      const opdNumber = generateOpdNumber()
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name
      })
      const savedOpdReg = await newOpd.save()
      res
        .status(httpStatus.CREATED)
        .json({ msg: 'OPD Registration Done ', data: savedOpdReg })
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const employee = await EmployeeModel.findOne({ _id: user.refId })
      const { error } = opdRegSchemaValidation.validate(req.body)
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message })
      }
      req.body.user = employee.basicDetails.user
      console.log(req.body.user)
      const tokenNumber = generateToken()
      const opdNumber = generateOpdNumber()
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name
      })
      const savedOpdReg = await newOpd.save()
      res
        .status(httpStatus.CREATED)
        .json({ msg: 'OPD Registration Done ', data: savedOpdReg })
    }
  } catch (error) {
    console.error('Error storing opd registration:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateOpdRegistion = async (req, res) => {
  try {
    const opdId = req.params.id
    const opd = await OPDModel.findOne({ _id: opdId })
    if (!opd) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'OPD registration not found' })
    }
    const updatedOPD = await OPDModel.findOneAndUpdate(
      { _id: opdId },
      { $set: req.body },
      { new: true }
    )
    res
      .status(httpStatus.OK)
      .json({ msg: 'OPD registration updated', data: updatedOPD })
  } catch (error) {
    console.error('Error updating opd registration:', error)
    res.status(400).json({ error: error.message })
  }
}

const changeConfirmAppointmentStatus = async (req, res) => {
  try {
    const opdConfirmAppointment = await OPDModel.findOneAndUpdate(
      { _id: req.params.id },
      { confirmAppointment: true }
    )
    res
      .status(httpStatus.OK)
      .json({ msg: 'Appointment Confirmed', data: opdConfirmAppointment })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const changeCancelAppointmentStatus = async (req, res) => {
  try {
    const opdCancelmAppointment = await OPDModel.findOneAndUpdate(
      { _id: req.params.id },
      { cancelAppointment: true }
    )
    res
      .status(httpStatus.OK)
      .json({ msg: 'Appointment Cancelled', data: opdCancelmAppointment })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getAllOpdRegistration = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findOne({ _id: userId })
    if (user.role == 'admin') {
      const opds = await OPDModel.find({
        delete: false,
        user: req.user.branchId
      })
      res.status(httpStatus.OK).json({ data: opds })
    } else if (user.role == 'doctor') {
      const existingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      const opds = await OPDModel.find({
        delete: false,
        user: existingdoctor.basicDetails.user
      })
      res.status(httpStatus.OK).json({ data: opds })
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      const opds = await OPDModel.find({
        delete: false,
        user: existingEmployee?.basicDetails.user
      })
      res.status(httpStatus.OK).json({ data: opds })
    }
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getCountByConsultant = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findOne({ _id: userId })

    if (user.role == 'admin') {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const opds = await OPDModel.find({
        delete: false,
        user: req.user.branchId,
        createdAt: { $gte: currentDate } // Filter documents with createdAt greater than or equal to current date
      })

      const uniqueConsultantNames = [
        ...new Set(opds.map(opd => opd.consultant))
      ]

      const countPromises = uniqueConsultantNames.map(async consultantName => {
        const pendingCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'pending',
          createdAt: { $gte: currentDate }
        })

        const outCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'out',
          createdAt: { $gte: currentDate }
        })

        return {
          consultant: consultantName,
          pending: pendingCount,
          out: outCount
        }
      })

      const counts = await Promise.all(countPromises)
      res.status(httpStatus.OK).json(counts)
    } else if (user.role == 'doctor') {
      const existingDoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const opds = await OPDModel.find({
        delete: false,
        user: existingDoctor.basicDetails.user,
        createdAt: { $gte: currentDate } // Filter documents with createdAt greater than or equal to current date
      })

      const uniqueConsultantNames = [
        ...new Set(opds.map(opd => opd.consultant))
      ]

      const countPromises = uniqueConsultantNames.map(async consultantName => {
        const pendingCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'pending',
          createdAt: { $gte: currentDate }
        })

        const outCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'out',
          createdAt: { $gte: currentDate }
        })

        return {
          consultant: consultantName,
          pending: pendingCount,
          out: outCount
        }
      })

      const counts = await Promise.all(countPromises)
      res.status(httpStatus.OK).json(counts)
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const opds = await OPDModel.find({
        delete: false,
        user: existingEmployee.basicDetails.user,
        createdAt: { $gte: currentDate } // Filter documents with createdAt greater than or equal to current date
      })

      const uniqueConsultantNames = [
        ...new Set(opds.map(opd => opd.consultant))
      ]

      const countPromises = uniqueConsultantNames.map(async consultantName => {
        const pendingCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'pending',
          createdAt: { $gte: currentDate }
        })

        const outCount = await OPDModel.countDocuments({
          delete: false,
          consultant: consultantName,
          status: 'out',
          createdAt: { $gte: currentDate }
        })

        return {
          consultant: consultantName,
          pending: pendingCount,
          out: outCount
        }
      })

      const counts = await Promise.all(countPromises)
      res.status(httpStatus.OK).json(counts)
    }
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getOPDRegistrationResponse = async (req, res) => {
  try {
    const { from, to } = req.body

    const fromDate = new Date(from)
    const toDate = new Date(to)

    toDate.setDate(toDate.getDate() + 1)

    const opdRegistrations = await OPDModel.find({
      delete: false,
      createdAt: { $gte: fromDate, $lt: toDate }
    })

    // Extracting patientIds from opds
    const patientIds = opdRegistrations.map(opd => opd.patientId.toString())

    // Fetch patient details for all patientIds
    const patientDetailsPromises = patientIds.map(patientId =>
      patientDetailsModel.findOne({ _id: patientId })
    )

    // Wait for all patientDetailsPromises to resolve
    const patientDetails = await Promise.all(patientDetailsPromises)

    // Assign patientDetails to corresponding opds
    const opdsWithPatientDetails = opdRegistrations.map((opd, index) => ({
      ...opd.toObject(), // Convert Mongoose document to plain object
      patientDetails: patientDetails[index]
    }))

    res.status(httpStatus.OK).json({ data: opdsWithPatientDetails })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getOPDRegistrationBYBilling = async (req, res) => {
  try {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const opds = await OPDModel.find({
      delete: false,
      patientIn: false,
      status: 'pending',
      confirmAppointment: true,
      createdAt: { $gte: currentDate }
    })

    // Extracting patientIds from opds
    const patientIds = opds.map(opd => opd.patientId.toString())

    // Fetch patient details for all patientIds
    const patientDetailsPromises = patientIds.map(patientId =>
      patientDetailsModel.findOne({ _id: patientId })
    )

    // Wait for all patientDetailsPromises to resolve
    const patientDetails = await Promise.all(patientDetailsPromises)

    // Assign patientDetails to corresponding opds
    const opdsWithPatientDetails = opds.map((opd, index) => ({
      ...opd.toObject(), // Convert Mongoose document to plain object
      patientDetails: patientDetails[index]
    }))

    res.status(httpStatus.OK).json({ data: opdsWithPatientDetails })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const changePatientInStatus = async (req, res) => {
  try {
    const { id } = req.params
    const updatedOPD = await OPDModel.findByIdAndUpdate(
      { _id: id },
      { patientIn: true, status: 'out' },
      { new: true }
    )

    if (!updatedOPD) {
      throw new Error('OPD entry not found')
    }

    res.status(httpStatus.OK).json({ data: updatedOPD })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

//  Medical Problem
const createMedicalProblem = async (req, res) => {
  try {
    const newMedicalProblem = new MedicalProblemModel({ ...req.body })
    const savedMedicalProblem = await newMedicalProblem.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Medical Problem Added Successfully ',
      data: savedMedicalProblem
    })
  } catch (error) {
    console.error('Error storing Medical Problem:', error)
    res.status(400).json({ error: error.message })
  }
}
const createFamilyHistoryProblem = async (req, res) => {
  try {
    const newFamilyProblem = new FamilyHistoryProblem({ ...req.body })
    const savedMedicalProblem = await newFamilyProblem.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Family Problem Added Successfully ',
      data: savedMedicalProblem
    })
  } catch (error) {
    console.error('Error storing Medical Problem:', error)
    res.status(400).json({ error: error.message })
  }
}

// Get all Family History Problems
const getAllFamilyHistoryProblems = async (req, res) => {
  try {
    const familyProblems = await FamilyHistoryProblem.find({ delete: false })
    res.status(httpStatus.OK).json({ data: familyProblems })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Update a Family History Problem by ID
const updateFamilyHistoryProblem = async (req, res) => {
  try {
    const familyProblem = await FamilyHistoryProblem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!familyProblem) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Family Problem Not Found' })
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: 'Family Problem Updated Successfully', familyProblem })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Error updating Family Problem', error })
  }
}

const getMostUsedFamilyProblems = async (req, res) => {
  try {
    const { id } = req.params
    const familyProblem = await FamilyHistoryProblem.find({
      delete: false,
      departmentId: id
    })
      .sort({ medicalCount: -1, createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: familyProblem })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Delete Family History Problems by IDs
const deleteFamilyHistoryProblems = async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    const objectIdArray = ids.map(id => id.toString())

    const result = await FamilyHistoryProblem.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Family Problem found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Family Problem deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error deleting Family Problem',
      details: err.message
    })
  }
}
const getAllMedicalProblem = async (req, res) => {
  try {
    const medicalproblem = await MedicalProblemModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: medicalproblem })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateMedicalProblem = async (req, res) => {
  try {
    const medicalproblem = await MedicalProblemModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Medical Problem  Updated Successfully', medicalproblem })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Medical Problem Not Found', error })
  }
}

const deleteMedicalProblemById = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await MedicalProblemModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Medical Problem found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Medical Problem deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Medical Problem',
      details: err.message
    })
  }
}

const GetMostUsedMedicalProblem = async (req, res) => {
  try {
    const { id } = req.params
    const medicalproblems = await MedicalProblemModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: medicalproblems })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

//  Drug History
const createDrugHistory = async (req, res) => {
  try {
    const newDrugHistory = new DrugHistoryModel({ ...req.body })
    const savedDrugHistory = await newDrugHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Drug History Added Successfully ',
      data: savedDrugHistory
    })
  } catch (error) {
    console.error('Error storing Drug History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllDrugHistory = async (req, res) => {
  try {
    const DrugHistory = await DrugHistoryModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: DrugHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateDrugHistory = async (req, res) => {
  try {
    const DrugHistory = await DrugHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Drug History  Updated Successfully', DrugHistory })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Drug History Not Found', error })
  }
}

const deleteDrugHistoryById = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await DrugHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Drug History found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Drug History deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Drug History', details: err.message })
  }
}

const GetMostUsedDrugHistory = async (req, res) => {
  try {
    const { id } = req.params
    const DrugHistorys = await DrugHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: DrugHistorys })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Drug Allergy
const createDrugAllergy = async (req, res) => {
  try {
    const newDrugAllergy = new DrugAllergyModel({ ...req.body })
    const savedDrugAllergy = await newDrugAllergy.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Drug Allergy Added Successfully ',
      data: savedDrugAllergy
    })
  } catch (error) {
    console.error('Error storing Drug Allergy:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllDrugAllergy = async (req, res) => {
  try {
    const drugAllergy = await DrugAllergyModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: drugAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateDrugAllergyById = async (req, res) => {
  try {
    const DrugAllergy = await DrugAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Drug Allergy  Updated Successfully', DrugAllergy })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Drug Allergy Not Found', error })
  }
}

const deleteDrugAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await DrugAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Drug Allergy found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Drug Allergy deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Drug Allergy', details: err.message })
  }
}

const GetMostUsedDrugAllergy = async (req, res) => {
  try {
    const { id } = req.params
    const DrugAllergy = await DrugAllergyModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(15) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: DrugAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Food Allergy
const createFoodAllergy = async (req, res) => {
  try {
    const newFoodAllergy = new FoodAllergyModel({ ...req.body })
    const savedFoodAllergy = await newFoodAllergy.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Food Allergy Added Successfully ',
      data: savedFoodAllergy
    })
  } catch (error) {
    console.error('Error storing Food Allergy:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllFoodAllergy = async (req, res) => {
  try {
    const FoodAllergy = await FoodAllergyModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: FoodAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateFoodAllergyById = async (req, res) => {
  try {
    const foodlAllergy = await FoodAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Food Allergy  Updated Successfully', foodlAllergy })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Food Allergy Not Found', error })
  }
}

const deleteFoodAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await FoodAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Food Allergy found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Food Allergy deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Food Allergy', details: err.message })
  }
}

const GetMostUsedFoodAllergy = async (req, res) => {
  try {
    const { id } = req.params
    const FoodAllergy = await FoodAllergyModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(15) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: FoodAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// General Allergy
const createGeneralAllergy = async (req, res) => {
  try {
    const newGeneralAllergy = new GeneralAllergyModel({ ...req.body })
    const savedGeneralAllergy = await newGeneralAllergy.save()
    res.status(httpStatus.CREATED).json({
      msg: 'General Allergy Added Successfully ',
      data: savedGeneralAllergy
    })
  } catch (error) {
    console.error('Error storing General Allergy:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllGeneralAllergy = async (req, res) => {
  try {
    const generalAllergy = await GeneralAllergyModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: generalAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateGeneralAllergyById = async (req, res) => {
  try {
    const generalAllergy = await GeneralAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'General Allergy  Updated Successfully', generalAllergy })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'General Allergy Not Found', error })
  }
}

const deleteGeneralAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await GeneralAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No General Allergy found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'General Allergy deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting General Allergy',
      details: err.message
    })
  }
}

const GetMostUsedGeneralAllergy = async (req, res) => {
  try {
    const { id } = req.params
    const generalAllergy = await GeneralAllergyModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(15) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: generalAllergy })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Family Member
const createFamilyMember = async (req, res) => {
  try {
    const newFamilyMember = new FamilyMemberModel({ ...req.body })
    const savedFamilyMember = await newFamilyMember.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Family Member Added Successfully ',
      data: savedFamilyMember
    })
  } catch (error) {
    console.error('Error storing Family Member:', error)
    res.status(400).json({ error: error.message })
  }
}

const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params // Extract ID from request parameters

    const deletedFamilyMember = await FamilyMemberModel.findByIdAndDelete(id)

    if (!deletedFamilyMember) {
      return res.status(404).json({ msg: 'Family Member not found' })
    }

    res.status(200).json({ msg: 'Family Member Deleted Successfully' })
  } catch (error) {
    console.error('Error deleting Family Member:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getAllFamilyMember = async (req, res) => {
  try {
    const familyMember = await FamilyMemberModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: familyMember })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedFamilyMember = async (req, res) => {
  try {
    const { id } = req.params
    const familyMember = await MedicalProblemModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: familyMember })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Life Style
const deleteLifeStyleObjectiveEntriesByIndex = async (req, res) => {

  console.log("deleteLifeStyleObjectiveEntriesByIndex",req.body)
  try {
    const { id } = req.params

    const lifestyle = await LifeStyleModel.findById(id)

    if (!lifestyle) {
      return res.status(404).json({ msg: 'Lifestyle not found' })
    }

    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    sortedIndexes.forEach(index => {
      if (index >= 0 && index < lifestyle.objective.length) {
        lifestyle.objective.splice(index, 1)
      }
    })

    lifestyle.markModified('objective')

    await lifestyle.save()

    res
      .status(200)
      .json({
        msg: 'Objective entries deleted successfully',
        updatedData: lifestyle,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const deleteLifeStyleObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const lifestyle = await LifeStyleModel.findById(id)
    if (!lifestyle) {
      return res.status(404).json({ msg: 'Lifestyle not found' })
    }

    if (objectiveIndex < 0 || objectiveIndex >= lifestyle.objective.length) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = lifestyle.objective[objectiveIndex]

    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    lifestyle.markModified('objective')
    await lifestyle.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: lifestyle,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const editLifeStyleObjectiveInnerDataEntry = async (req, res) => {
  try {

    console.log("editLifeStyleObjectiveInnerDataEntry",req.body)
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body

    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const lifestyle = await LifeStyleModel.findById(id)
    if (!lifestyle) {
      return res.status(404).json({ msg: 'Lifestyle not found' })
    }

    if (objectiveIndex < 0 || objectiveIndex >= lifestyle.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    const objectiveItem = lifestyle.objective[objectiveIndex]

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res.status(400).json({ msg: 'Invalid innerData index' })
    }

    objectiveItem.innerData[innerDataIndex].data = data

    lifestyle.markModified('objective')

    await lifestyle.save()

    res.status(200).json({
      msg: 'InnerData entry updated successfully',
      updatedData: lifestyle,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating innerData entry',
      details: err.message
    })
  }
}
const updateLifeStyleObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { index, problem } = req.body

    const lifestyle = await LifeStyleModel.findById(id)

    if (!lifestyle) {
      return res.status(404).json({ msg: 'Lifestyle not found' })
    }

    if (typeof index !== 'number' || !problem) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    if (index < 0 || index >= lifestyle.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    lifestyle.objective[index].problem = problem

    lifestyle.markModified('objective')

    await lifestyle.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: lifestyle,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

const updateObjectiveLifeStyle = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    console.log("id",id,"objective",objective)
    const lifestyle = await LifeStyleModel.findById(id)
    lifestyle?.innerData?.push(...innerData)
    const newLifeStyle = await lifestyle.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Lifestyle Updated Objective Successfully',
      data: newLifeStyle
    })
  } catch (error) {
    console.error('Error storing Lifestyle Objective:', error)
    res.status(400).json({ error: error.message })
  }
}
const createLifeStyle = async (req, res) => {
  try {
    const {
      problem,
      answerType,
      departmentId,
      consultantId,
      objective,
    } = req.body;
console.log("req.body",req.body)
    // Validation for required fields
    if (!problem || !answerType || !departmentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Missing required fields: problem, answerType, or departmentId",
      });
    }

    // Validate objective is an array (optional step, for robustness)
    if (objective && !Array.isArray(objective)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Objective must be an array of objects.",
      });
    }

    const newLifeStyle = new LifeStyleModel({
      problem,
      answerType,
      departmentId,
      consultantId,
      objective: Array.isArray(objective) ? objective : [],
    });

    const savedLifeStyle = await newLifeStyle.save();

    res.status(httpStatus.CREATED).json({
      msg: "Lifestyle Added Successfully",
      data: savedLifeStyle,
    });
  } catch (error) {
    console.error("Error storing Lifestyle:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while storing lifestyle data.",
      error: error.message,
    });
  }
};

const getAllLifeStyle = async (req, res) => {
  try {
    const lifeStyles = await LifeStyleModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: lifeStyles })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}


const updateLifeStyleById = async (req, res) => {
  const { id } = req.params;
  const { objective } = req.body; // should be an array
  const { layer2Data } = req.body; // should be an array

  console.log("layer2Data",layer2Data)

  if(!objective && layer2Data){

    try {
      const lifestyle = await LifeStyleModel.findById(id);
      if (!lifestyle) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: "Lifestyle not found" });
      }
  
      // 🎯 Find the target objective by _id inside lifestyle.objective
      const target = lifestyle.objective.find(
        (obj) => obj._id.toString() === layer2Data.objective._id
      );
  
      if (!target) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: "Target objective not found in lifestyle.objective" });
      }
  
      // ✅ Append the new inner objective data
      const newChildren = layer2Data.objective.objective; // should be array
      if (!Array.isArray(newChildren)) {
        return res.status(httpStatus.BAD_REQUEST).json({ msg: "layer2Data.objective.objective must be an array" });
      }
  
      newChildren.forEach((child) => {
        if (child.problem && child.answerType) {
          target.objective.push({
            problem: child.problem,
            answerType: child.answerType,
            objective: Array.isArray(child.objective) ? child.objective : []
          });
        }
      });
  
      const updated = await lifestyle.save();
  
      return res.status(httpStatus.OK).json({
        msg: "Child objectives added to target objective",
        data: updated,
      });
  
    } catch (error) {
      console.error("Error updating lifestyle:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error.message,
      });
    }

  }

  console.log("objective---",objective)
  try {
    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Lifestyle not found" });
    }

    // Validate input
    if (!Array.isArray(objective) || objective.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "",
      });
    }

    // Loop and push each item into lifestyle.objective
    objective.forEach((obj) => {
      if (obj.problem && obj.answerType) {
        lifestyle.objective.push({
          problem: obj.problem,
          answerType: obj.answerType,
          objective: Array.isArray(obj.objective) ? obj.objective : [],
        });
      }
    });

    const updatedLifestyle = await lifestyle.save();

    return res.status(httpStatus.OK).json({
      msg: "Objectives added to first layer",
      data: updatedLifestyle,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const updateLifeStyleByIdForLastLayer = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
  const { objective, _id } = req.body; // Destructure objective and nested _id from req.body

  console.log("objectives", objective); // Log objectives to inspect

  try {
    // Validate data
    if (!objective || !Array.isArray(objective.objective)) {
      return res.status(400).json({ msg: "Invalid or missing objective data" });
    }

    // Find the document and update the second-level objective
    const updatedLifeStyle = await LifeStyleModel.findOneAndUpdate(
      { 
        _id: id, // Match by main document _id
        "objective._id": _id, // Match by the nested objective _id (first level)
        "objective.objective._id": objective._id, // Match by the second-level objective _id
      },
      {
        // Push the new objectives to the third-level objective array
        $push: {
          "objective.$.objective.$[obj].objective": {
            $each: objective.objective.map((newObj) => ({
              problem: newObj.problem,
              answerType: newObj.answerType,
              objective: Array.isArray(newObj.objective) ? newObj.objective : [],
            })),
          },
        },
      },
      {
        new: true, // Return the updated document
        arrayFilters: [
          { "obj._id": objective._id } // Apply filter to match second-level objective based on its _id
        ],
      }
    );

    // Check if document was found and updated
    if (!updatedLifeStyle) {
      return res.status(404).json({ msg: "Objective with specified _id not found" });
    }

    // Return success response with the updated document
    return res.status(200).json({
      msg: "Objectives added successfully",
      data: updatedLifeStyle, // Return the updated document
    });
  } catch (error) {
    console.error("❌ Error updating lifeStyle:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};














const deleteLifeStyleByIds = async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    const objectIdArray = ids.map(id => id.toString())

    const result = await LifeStyleModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Lifestyle found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Lifestyle deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Lifestyle',
      details: err.message
    })
  }
}

const GetMostUsedLifeStyle = async (req, res) => {
  try {
    const { id } = req.params
    const lifeStyles = await LifeStyleModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 })
      .limit(15)
    res.status(httpStatus.OK).json({ data: lifeStyles })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Gynac History API
const createGynacHistory = async (req, res) => {
  try {
    const newGynacHistory = new GynacHistoryModel({ ...req.body })
    const savedGynacHistory = await newGynacHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Gynac History Added Successfully ',
      data: savedGynacHistory
    })
  } catch (error) {
    console.error('Error storing Gynac History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllGynacHistory = async (req, res) => {
  try {
    const GynacHistory = await GynacHistoryModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: GynacHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedGynacHistory = async (req, res) => {
  try {
    const { id } = req.params
    const GynacHistory = await GynacHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: GynacHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateGynacHistoryById = async (req, res) => {
  try {
    const GynacHistory = await GynacHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Gynac History  Updated Successfully', GynacHistory })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'GynacHistory Not Found', error })
  }
}

const deleteGynacHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the GynacHistory with the provided IDs
    const result = await GynacHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    // if (result.deletedCount === 0) {
    //   return res.status(httpStatus.NOT_FOUND).json({ msg: "No Gynac History found with the provided IDs" });
    // }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Gynac History deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Gynac History', details: err.message })
  }
}

const deleteGynacObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params

    // Find the document
    const gynacHistory = await GynacHistoryModel.findById(id)

    if (!gynacHistory) {
      return res.status(404).json({ msg: 'Gynac History not found' })
    }

    // Sort indexes in descending order to prevent shifting issues
    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    // Remove elements at specified indexes
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < gynacHistory.objective.length) {
        gynacHistory.objective.splice(index, 1)
      }
    })

    // Mark objective as modified before saving
    gynacHistory.markModified('objective')

    // Save the updated document
    await gynacHistory.save()

    res
      .status(200)
      .json({
        msg: 'Objective entries deleted successfully',
        updatedData: gynacHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const deleteGynacObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const gynacHistory = await GynacHistoryModel.findById(id)
    if (!gynacHistory) {
      return res.status(404).json({ msg: 'Gynac History not found' })
    }

    // Validate objective index
    if (objectiveIndex < 0 || objectiveIndex >= gynacHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    // Get the objective item
    const objectiveItem = gynacHistory.objective[objectiveIndex]

    // Sort and remove elements in innerData to prevent shifting issues
    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    gynacHistory.markModified('objective')
    await gynacHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: gynacHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const editGynacObjectiveInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body // Expecting objectiveIndex, innerDataIndex, and new data

    // Validate request data
    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    // Find the document by ID
    const gynacHistory = await GynacHistoryModel.findById(id)
    if (!gynacHistory) {
      return res
        .status(404)
        .json({ msg: 'Gynac History not found', success: false })
    }

    // Validate the objective index
    if (objectiveIndex < 0 || objectiveIndex >= gynacHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = gynacHistory.objective[objectiveIndex]

    // Validate the innerData index
    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    // Update the specific innerData entry
    objectiveItem.innerData[innerDataIndex].data = data

    // Mark the objective as modified before saving
    gynacHistory.markModified('objective')

    // Save the updated document
    await gynacHistory.save()

    res.status(200).json({
      msg: 'InnerData entry updated successfully',
      updatedData: gynacHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating innerData entry',
      details: err.message,
      success: false
    })
  }
}

const updateGynacObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params // Get GynacHistory ID from request params
    const { index, data } = req.body // Expecting an object with index & new data

    // Find the document by ID
    const gynacHistory = await GynacHistoryModel.findById(id)

    if (!gynacHistory) {
      return res.status(404).json({ msg: 'Gynac History not found' })
    }

    if (typeof index !== 'number' || !data) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    // Check if index is valid
    if (index < 0 || index >= gynacHistory.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    // Update the specific `data` field inside `objective` array
    gynacHistory.objective[index].data = data

    // Mark objective as modified before saving
    gynacHistory.markModified('objective')

    // Save the updated document
    await gynacHistory.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: gynacHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

const updateObjectiveGynacHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    const gynacHistory = await GynacHistoryModel.findById(id)
    gynacHistory.objective.push(...objective)
    const newcgynacHistory = await gynacHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Gynac History Updated Objective Successfully ',
      data: newcgynacHistory
    })
  } catch (error) {
    console.error('Error storing Gynac History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

// Other History
const createOtherHistory = async (req, res) => {
  try {
    const newOtherHistory = new OtherHistoryModel({ ...req.body })
    const savedOtherHistory = await newOtherHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Other History Added Successfully ',
      data: savedOtherHistory
    })
  } catch (error) {
    console.error('Error storing Other History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllOtherHistory = async (req, res) => {
  try {
    const OtherHistory = await OtherHistoryModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: OtherHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedOtherHistory = async (req, res) => {
  try {
    const { id } = req.params
    const OtherHistory = await OtherHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: OtherHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateOtherHistoryById = async (req, res) => {
  try {
    const OtherHistory = await OtherHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Other History Updated Successfully', OtherHistory })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Other History Not Found', error })
  }
}

const deleteOtherHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString())

    // Delete the OtherHistory with the provided IDs
    const result = await OtherHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    res
      .status(httpStatus.OK)
      .json({ msg: 'Other History deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Other History', details: err.message })
  }
}

const deleteOtherObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params

    const otherHistory = await OtherHistoryModel.findById(id)

    if (!otherHistory) {
      return res.status(404).json({ msg: 'Other History not found' })
    }

    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    sortedIndexes.forEach(index => {
      if (index >= 0 && index < otherHistory.objective.length) {
        otherHistory.objective.splice(index, 1)
      }
    })

    otherHistory.markModified('objective')

    await otherHistory.save()

    res
      .status(200)
      .json({
        msg: 'Objective entries deleted successfully',
        updatedData: otherHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const deleteOtherObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const otherHistory = await OtherHistoryModel.findById(id)
    if (!otherHistory) {
      return res.status(404).json({ msg: 'Other History not found' })
    }

    if (objectiveIndex < 0 || objectiveIndex >= otherHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = otherHistory.objective[objectiveIndex]

    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    otherHistory.markModified('objective')
    await otherHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: otherHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const editOtherObjectiveInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body

    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const otherHistory = await OtherHistoryModel.findById(id)
    if (!otherHistory) {
      return res
        .status(404)
        .json({ msg: 'Other History not found', success: false })
    }

    if (objectiveIndex < 0 || objectiveIndex >= otherHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = otherHistory.objective[objectiveIndex]

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    objectiveItem.innerData[innerDataIndex].data = data

    otherHistory.markModified('objective')

    await otherHistory.save()

    res.status(200).json({
      msg: 'InnerData entry updated successfully',
      updatedData: otherHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating innerData entry',
      details: err.message,
      success: false
    })
  }
}

const updateOtherObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { index, data } = req.body

    const otherHistory = await OtherHistoryModel.findById(id)

    if (!otherHistory) {
      return res.status(404).json({ msg: 'Other History not found' })
    }

    if (typeof index !== 'number' || !data) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    if (index < 0 || index >= otherHistory.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    otherHistory.objective[index].data = data

    otherHistory.markModified('objective')

    await otherHistory.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: otherHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

const updateObjectiveOtherHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    const otherHistory = await OtherHistoryModel.findById(id)
    otherHistory.objective.push(...objective)
    const newOtherHistory = await otherHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Other History Updated Objective Successfully ',
      data: newOtherHistory
    })
  } catch (error) {
    console.error('Error storing Other History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

// Obstrestric History API

const createObstetricHistory = async (req, res) => {
  try {
    const newObstetricHistory = new ObstetricHistoryModel({ ...req.body })
    const savedObstetricHistory = await newObstetricHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Obstetric History Added Successfully ',
      data: savedObstetricHistory
    })
  } catch (error) {
    console.error('Error storing Obstetric History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllObstetricHistory = async (req, res) => {
  try {
    const ObstetricHistory = await ObstetricHistoryModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: ObstetricHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedObstetricHistory = async (req, res) => {
  try {
    const { id } = req.params
    const ObstetricHistory = await ObstetricHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: ObstetricHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateObstetricHistoryById = async (req, res) => {
  try {
    const ObstetricHistory = await ObstetricHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'Obstetric History  Updated Successfully',
      ObstetricHistory
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Obstetric History Not Found', error })
  }
}

const deleteObstetricHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the ObstetricHistory with the provided IDs
    const result = await ObstetricHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    // if (result.deletedCount === 0) {
    //   return res.status(httpStatus.NOT_FOUND).json({ msg: "No Obstetric History found with the provided IDs" });
    // }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Obstetric History deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Obstetric History',
      details: err.message
    })
  }
}

const updateObjectiveObstetricHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    const ObstetricHistory = await ObstetricHistoryModel.findById(id)
    ObstetricHistory.objective.push(...objective)
    const newcObstetricHistory = await ObstetricHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Obstetric History Updated Objective Successfully ',
      data: newcObstetricHistory
    })
  } catch (error) {
    console.error('Error storing Obstetric History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

const deleteObstetricObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params

    // Find the document
    const obstetricHistory = await ObstetricHistoryModel.findById(id)

    if (!obstetricHistory) {
      return res.status(404).json({ msg: 'Obstetric History not found' })
    }

    // Sort indexes in descending order to prevent shifting issues
    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    // Remove elements at specified indexes
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < obstetricHistory.objective.length) {
        obstetricHistory.objective.splice(index, 1)
      }
    })

    // Mark objective as modified before saving
    obstetricHistory.markModified('objective')

    // Save the updated document
    await obstetricHistory.save()

    res.status(200).json({
      msg: 'Objective entries deleted successfully',
      updatedData: obstetricHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting objective entries',
      details: err.message
    })
  }
}

const updateObstetricObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params // Get ObstetricHistory ID from request params
    const { index, data } = req.body // Expecting an object with index & new data

    // Find the document by ID
    const obstetricHistory = await ObstetricHistoryModel.findById(id)

    if (!obstetricHistory) {
      return res.status(404).json({ msg: 'Obstetric History not found' })
    }

    if (typeof index !== 'number' || !data) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    // Check if index is valid
    if (index < 0 || index >= obstetricHistory.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    // Update the specific `data` field inside `objective` array
    obstetricHistory.objective[index].data = data

    // Mark objective as modified before saving
    obstetricHistory.markModified('objective')

    // Save the updated document
    await obstetricHistory.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: obstetricHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

// Obstetric History ends

// Nutritional History API
const deleteNutritionalObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params

    // Find the document
    const nutritionalHistory = await NutritionalHistoryModel.findById(id)

    if (!nutritionalHistory) {
      return res.status(404).json({ msg: 'Nutritional History not found' })
    }

    // Sort indexes in descending order to prevent shifting issues
    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    // Remove elements at specified indexes
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < nutritionalHistory.objective.length) {
        nutritionalHistory.objective.splice(index, 1)
      }
    })

    // Mark objective as modified before saving
    nutritionalHistory.markModified('objective')

    // Save the updated document
    await nutritionalHistory.save()

    res.status(200).json({
      msg: 'Objective entries deleted successfully',
      updatedData: nutritionalHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting objective entries',
      details: err.message
    })
  }
}

const updateNutritionalObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params // Get NutritionalHistory ID from request params
    const { index, data } = req.body // Expecting an object with index & new data

    // Find the document by ID
    const nutritionalHistory = await NutritionalHistoryModel.findById(id)

    if (!nutritionalHistory) {
      return res.status(404).json({ msg: 'Nutritional History not found' })
    }

    if (typeof index !== 'number' || !data) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    // Check if index is valid
    if (index < 0 || index >= nutritionalHistory.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    // Update the specific `data` field inside `objective` array
    nutritionalHistory.objective[index].data = data

    // Mark objective as modified before saving
    nutritionalHistory.markModified('objective')

    // Save the updated document
    await nutritionalHistory.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: nutritionalHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

const deleteNutritionalObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const nutritionalHistory = await NutritionalHistoryModel.findById(id)
    if (!nutritionalHistory) {
      return res
        .status(404)
        .json({ msg: 'Nutritional History not found', success: false })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= nutritionalHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = nutritionalHistory.objective[objectiveIndex]
    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    nutritionalHistory.markModified('objective')
    await nutritionalHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: nutritionalHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const editNutritionalObjectiveInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body

    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const nutritionalHistory = await NutritionalHistoryModel.findById(id)
    if (!nutritionalHistory) {
      return res
        .status(404)
        .json({ msg: 'Nutritional History not found', success: false })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= nutritionalHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = nutritionalHistory.objective[objectiveIndex]
    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    objectiveItem.innerData[innerDataIndex].data = data
    nutritionalHistory.markModified('objective')
    await nutritionalHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entry updated successfully',
        updatedData: nutritionalHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({
        error: 'Error updating innerData entry',
        details: err.message,
        success: false
      })
  }
}

const deletePediatricObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const pediatricHistory = await PediatricHistoryModel.findById(id)
    if (!pediatricHistory) {
      return res
        .status(404)
        .json({ msg: 'Pediatric History not found', success: false })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= pediatricHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = pediatricHistory.objective[objectiveIndex]
    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    pediatricHistory.markModified('objective')
    await pediatricHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: pediatricHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting objective entries', details: err.message })
  }
}

const editPediatricObjectiveInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body

    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const pediatricHistory = await PediatricHistoryModel.findById(id)
    if (!pediatricHistory) {
      return res
        .status(404)
        .json({ msg: 'Pediatric History not found', success: false })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= pediatricHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = pediatricHistory.objective[objectiveIndex]
    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    objectiveItem.innerData[innerDataIndex].data = data
    pediatricHistory.markModified('objective')
    await pediatricHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entry updated successfully',
        updatedData: pediatricHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({
        error: 'Error updating innerData entry',
        details: err.message,
        success: false
      })
  }
}
const deleteObstetricObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex } = req.body.ids

    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const obstetricHistory = await ObstetricHistoryModel.findById(id)
    if (!obstetricHistory) {
      return res.status(404).json({ msg: 'Obstetric History not found' })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= obstetricHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = obstetricHistory.objective[objectiveIndex]

    const sortedIndexes = innerDataIndex.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    obstetricHistory.markModified('objective')
    await obstetricHistory.save()

    res
      .status(200)
      .json({
        msg: 'InnerData entries deleted successfully',
        updatedData: obstetricHistory,
        success: true
      })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting innerData entries', details: err.message })
  }
}

const editObstetricObjectiveInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { objectiveIndex, innerDataIndex, data } = req.body

    if (
      typeof objectiveIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const obstetricHistory = await ObstetricHistoryModel.findById(id)
    if (!obstetricHistory) {
      return res
        .status(404)
        .json({ msg: 'Obstetric History not found', success: false })
    }

    if (
      objectiveIndex < 0 ||
      objectiveIndex >= obstetricHistory.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid objective index', success: false })
    }

    const objectiveItem = obstetricHistory.objective[objectiveIndex]

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    objectiveItem.innerData[innerDataIndex].data = data

    obstetricHistory.markModified('objective')
    await obstetricHistory.save()

    res.status(200).json({
      msg: 'InnerData entry updated successfully',
      updatedData: obstetricHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating innerData entry',
      details: err.message,
      success: false
    })
  }
}

const createNutritionalHistory = async (req, res) => {
  try {
    const newNutritionalHistory = new NutritionalHistoryModel({ ...req.body })
    const savedNutritionalHistory = await newNutritionalHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Nutritional History Added Successfully ',
      data: savedNutritionalHistory
    })
  } catch (error) {
    console.error('Error storing Nutritional History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllNutritionalHistory = async (req, res) => {
  try {
    const NutritionalHistory = await NutritionalHistoryModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: NutritionalHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedNutritionalHistory = async (req, res) => {
  try {
    const { id } = req.params
    const NutritionalHistory = await NutritionalHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: NutritionalHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateNutritionalHistoryById = async (req, res) => {
  try {
    const NutritionalHistory = await NutritionalHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'Nutritional History  Updated Successfully',
      NutritionalHistory
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Nutritiona lHistory Not Found', error })
  }
}

const deleteNutritionalHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the NutritionalHistory with the provided IDs
    const result = await NutritionalHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Nutritional History found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Nutritional History deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Nutritional History',
      details: err.message
    })
  }
}

const updateObjectiveNutritionalHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body

    const NutritionalHistory = await NutritionalHistoryModel.findById(id)
    NutritionalHistory.objective.push(...objective)
    // const newcNutritionalHistory = await NutritionalHistory.save();
    res.status(httpStatus.CREATED).json({
      msg: 'Nutritional History Updated Objective Successfully ',
      data: newcNutritionalHistory
    })
  } catch (error) {
    console.error('Error storing Nutritional History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

// Pediatric History API
const createPediatricHistory = async (req, res) => {
  try {
    const newPediatricHistory = new PediatricHistoryModel({ ...req.body })
    const savedPediatricHistory = await newPediatricHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Pediatric History Added Successfully ',
      data: savedPediatricHistory
    })
  } catch (error) {
    console.error('Error storing Pediatric History:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllPediatricHistory = async (req, res) => {
  try {
    const PediatricHistory = await PediatricHistoryModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: PediatricHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedPediatricHistory = async (req, res) => {
  try {
    const { id } = req.params
    const PediatricHistory = await PediatricHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: PediatricHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updatePediatricHistoryById = async (req, res) => {
  try {
    const PediatricHistory = await PediatricHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'Pediatric History  Updated Successfully',
      PediatricHistory
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Pediatric History Not Found', error })
  }
}

const deletePediatricHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the PediatricHistory with the provided IDs
    const result = await PediatricHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Pediatric History found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Pediatric History deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Pediatric History',
      details: err.message
    })
  }
}

const updateObjectivePediatricHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    const PediatricHistory = await PediatricHistoryModel.findById(id)
    PediatricHistory.objective.push(...objective)
    const newcPediatricHistory = await PediatricHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Pediatric History Updated Objective Successfully ',
      data: newcPediatricHistory
    })
  } catch (error) {
    console.error('Error storing Pediatric History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

const deletePediatricObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params

    // Find the document
    const pediatricHistory = await PediatricHistoryModel.findById(id)

    if (!pediatricHistory) {
      return res.status(404).json({ msg: 'Pediatric History not found' })
    }

    // Sort indexes in descending order to prevent shifting issues
    const sortedIndexes = req.body?.ids.sort((a, b) => b - a)

    // Remove elements at specified indexes
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < pediatricHistory.objective.length) {
        pediatricHistory.objective.splice(index, 1)
      }
    })

    // Mark objective as modified before saving
    pediatricHistory.markModified('objective')

    // Save the updated document
    await pediatricHistory.save()

    res.status(200).json({
      msg: 'Objective entries deleted successfully',
      updatedData: pediatricHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting objective entries',
      details: err.message
    })
  }
}

const updatePediatricObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params // Get PediatricHistory ID from request params
    const { index, data } = req.body // Expecting an object with index & new data

    // Find the document by ID
    const pediatricHistory = await PediatricHistoryModel.findById(id)

    if (!pediatricHistory) {
      return res.status(404).json({ msg: 'Pediatric History not found' })
    }

    if (typeof index !== 'number' || !data) {
      return res
        .status(400)
        .json({ msg: 'Invalid index or missing data field' })
    }

    // Check if index is valid
    if (index < 0 || index >= pediatricHistory.objective.length) {
      return res.status(400).json({ msg: 'Invalid objective index' })
    }

    // Update the specific `data` field inside `objective` array
    pediatricHistory.objective[index].data = data

    // Mark objective as modified before saving
    pediatricHistory.markModified('objective')

    // Save the updated document
    await pediatricHistory.save()

    res.status(200).json({
      msg: 'Objective entry updated successfully',
      updatedData: pediatricHistory,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective entry',
      details: err.message
    })
  }
}

// Procedure
const createProcedure = async (req, res) => {
  try {
    const newProcedure = new ProcedureModel({ ...req.body })
    const savedProcedure = await newProcedure.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Procedure Added Successfully ', data: savedProcedure })
  } catch (error) {
    console.error('Error storing Procedure:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllProcedure = async (req, res) => {
  try {
    const procedure = await ProcedureModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: procedure })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateProcedureById = async (req, res) => {
  try {
    const Procedure = await ProcedureModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Procedure  Updated Successfully', Procedure })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Procedure Not Found', error })
  }
}

const deleteProcedureByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the Procedure with the provided IDs
    const result = await ProcedureModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Procedure found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Procedure deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Procedure', details: err.message })
  }
}

const GetMostUsedProcedure = async (req, res) => {
  try {
    const { id } = req.params
    const procedure = await ProcedureModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(20) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: procedure })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Instruction
const createInstruction = async (req, res) => {
  try {
    const newInstruction = new InstructionModel({ ...req.body })
    const savedInstruction = await newInstruction.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Instruction Data Added Successfully ',
      data: savedInstruction
    })
  } catch (error) {
    console.error('Error storing Instruction Data:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllInstruction = async (req, res) => {
  try {
    const instruction = await InstructionModel.find({ delete: false })
    // const data = [];
    // instruction.forEach((element) => {
    //   // console.log(element._doc.description);
    //   data.push({
    //     ...element._doc,
    //     description:
    //       element._doc.description.length === 0
    //         ? null
    //         : element._doc.description[0],
    //   });
    // });
    res.status(httpStatus.OK).json({ data: instruction })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateInstructionById = async (req, res) => {
  try {
    const Instruction = await InstructionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Instruction  Updated Successfully', Instruction })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Instruction Not Found', error })
  }
}

const deleteInstructionByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the Instruction with the provided IDs
    const result = await InstructionModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Instruction found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Instruction deleted successfully', result })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in deleting Instruction', details: err.message })
  }
}

const GetMostInstruction = async (req, res) => {
  try {
    const { id } = req.params
    const instruction = await InstructionModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    // const data = [];
    // instruction.forEach((element) => {
    //   // console.log(element._doc.description);
    //   data.push({
    //     ...element._doc,
    //     description:
    //       element._doc.description.length === 0
    //         ? null
    //         : element._doc.description[0],
    //   });
    // });
    res.status(httpStatus.OK).json({ data: instruction })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Chief Complaints
const createChiefComplaint = async (req, res) => {
  try {
    const newChiefComplaint = new ChiefComplaintModel({ ...req.body })
    const savedChiefComplaint = await newChiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Added Successfully ',
      data: savedChiefComplaint
    })
  } catch (error) {
    console.error('Error storing Chief Complaint:', error)
    res.status(400).json({ error: error.message })
  }
}
const createPainChiefComplaint = async (req, res) => {
  try {
    const newChiefComplaint = new PainChiefComplaintModel({ ...req.body })
    const savedChiefComplaint = await newChiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Pain Chief Complaint Added SuccessFully ',
      data: savedChiefComplaint
    })
  } catch (error) {
    console.error('Error storing Chief Complaint:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params

    const ChiefComplaint = await ChiefComplaintModel.find({
      departmentId: new mongoose.Types.ObjectId(id),
      delete: false
    })
    res.status(httpStatus.OK).json({ data: ChiefComplaint })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}
const getAllPainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params
    const ChiefComplaint = await PainChiefComplaintModel.find({
      departmentId: new mongoose.Types.ObjectId(id),
      delete: false
    })
    res.status(httpStatus.OK).json({ data: ChiefComplaint })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    
    const { symptoms } = req.body
    const chiefComplaint = await ChiefComplaintModel.findById(id)
    chiefComplaint.symptoms.push(...symptoms)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error storing Chief Complaint:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateDescriptionCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const { description } = req.body
    const chiefComplaint = await ChiefComplaintModel.findById(id)
    chiefComplaint.description.push(...description)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Desscription Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Description:', error)
    res.status(400).json({ error: error.message })
  }
}
const updateRelevingFactors = async (req, res) => {
  try {
    const { id } = req.params
    const { relievingFactors } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.relievingFactors.push(...relievingFactors)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint relievingFactors Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Description:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateSinceCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const { since } = req.body
    const chiefComplaint = await ChiefComplaintModel.findById(id)
    chiefComplaint.since.push(...since)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Since Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Since:', error)
    res.status(400).json({ error: error.message })
  }
}
const updatePainDuration = async (req, res) => {
  try {
    const { id } = req.params
    const { duration } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.duration.push(...duration)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint duration Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint duration:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateTreatmentCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const { treatment } = req.body
    const chiefComplaint = await ChiefComplaintModel.findById(id)
    chiefComplaint.treatment.push(...treatment)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Treatment Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Treatment:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateLocationCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const { Location } = req.body
    const chiefComplaint = await ChiefComplaintModel.findById(id)
    chiefComplaint.Location.push(...Location)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Location Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Location:', error)
    res.status(400).json({ error: error.message })
  }
}
const updatePainLocationCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const { Location } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.location.push(...Location)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint Location Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Location:', error)
    res.status(400).json({ error: error.message })
  }
}
const updateQualityPain = async (req, res) => {
  try {
    const { id } = req.params
    const { quality } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.quality.push(...quality)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint quality Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Location:', error)
    res.status(400).json({ error: error.message })
  }
}
const updateNatureOfPain = async (req, res) => {
  try {
    const { id } = req.params
    const { natureOfPain } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.natureOfPain.push(...natureOfPain)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint quality Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Location:', error)
    res.status(400).json({ error: error.message })
  }
}
const updateAggregatingFactors = async (req, res) => {
  try {
    const { id } = req.params
    const { aggravatingFactors } = req.body
    const chiefComplaint = await PainChiefComplaintModel.findById(id)
    chiefComplaint.aggravatingFactors.push(...aggravatingFactors)
    const newchiefComplaint = await chiefComplaint.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Chief Complaint aggravatingFactors Updated Successfully ',
      data: newchiefComplaint
    })
  } catch (error) {
    console.error('Error Updating Chief Complaint Location:', error)
    res.status(400).json({ error: error.message })
  }
}

const GetMostCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params
    const ChiefComplaint = await ChiefComplaintModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: ChiefComplaint })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateCheifcomplaintById = async (req, res) => {
  try {
    const { patientId } = req.body
console.log(patientId);
    const patientChiefComplaint =
      await PatientChiefComplaintModel.findOneAndUpdate(
        { patientId },
        { $set: { chiefComplaint: req.body } },
        { new: true }
      )

    if (!patientChiefComplaint) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Patient Chief Complaint Not Found' })
    }

    // const chiefComplaintIds = chiefComplaint.map((complaint) => complaint._id);

    const updatedChiefComplaint = await ChiefComplaintModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updatedChiefComplaint) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Chief Complaint Not Found' })
    }

    return res.status(httpStatus.OK).json({
      msg: 'Chief Complaint Updated Successfully',
      data: updatedChiefComplaint
    })
  } catch (error) {
    console.error(error)
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error', error })
  }
}

const deleteCheifcomplaintByIds = async (req, res) => {
  try {
    const { ids } = req.body // Expecting { ids: [ '67a4a417fe001e6c0038eb7e' ] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert IDs to ObjectId with 'new' keyword
    const objectIdArray = ids.map(id => new mongoose.Types.ObjectId(id))

    // Deleting documents
    const result = await ChiefComplaintModel.deleteMany({
      _id: { $in: objectIdArray }
    })

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: 'No Chief Complaint found with the provided IDs' })
    }

    res
      .status(200)
      .json({ msg: 'Chief Complaint deleted successfully', result })
  } catch (err) {
    console.error('Error deleting Chief Complaint:', err.message)
    res.status(500).json({
      error: 'Error in deleting Chief Complaint',
      details: err.message
    })
  }
}
const deletePainChiefComplaintById = async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert IDs to ObjectId if necessary
    const objectIdArray = ids.map(id => mongoose.Types.ObjectId(id))

    // Deleting documents
    const result = await PainChiefComplaintModel.deleteMany({
      _id: { $in: objectIdArray }
    })

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: 'No Chief Complaint found with the provided IDs' })
    }

    res
      .status(200)
      .json({ msg: 'Chief Complaint deleted successfully', result })
  } catch (err) {
    console.error('Error deleting Chief Complaint:', err.message)
    res.status(500).json({
      error: 'Error in deleting Chief Complaint',
      details: err.message
    })
  }
}

const deleteSingleChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params // Expecting a single ID in request params

    if (!id) {
      return res.status(400).json({ msg: 'ID is required' })
    }

    // Convert ID to ObjectId if necessary
    const objectId = new mongoose.Types.ObjectId(id)

    // Deleting the document
    const result = await ChiefComplaintModel.findByIdAndDelete(objectId)

    if (!result) {
      return res.status(404).json({ msg: 'Chief Complaint not found' })
    }

    res
      .status(200)
      .json({ msg: 'Chief Complaint deleted successfully', result })
  } catch (err) {
    console.error('Error deleting Chief Complaint:', err.message)
    res.status(500).json({
      error: 'Error in deleting Chief Complaint',
      details: err.message
    })
  }
}
const deleteSinglePainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params // Expecting a single ID in request params

    if (!id) {
      return res.status(400).json({ msg: 'ID is required' })
    }
    // Convert ID to ObjectId if necessary
    const objectId = new mongoose.Types.ObjectId(id)

    // Deleting the document
    const result = await PainChiefComplaintModel.findByIdAndDelete(objectId)

    if (!result) {
      return res.status(404).json({ msg: 'Chief Complaint not found' })
    }

    res
      .status(200)
      .json({ msg: 'Chief Complaint deleted successfully', result })
  } catch (err) {
    console.error('Error deleting Chief Complaint:', err.message)
    res.status(500).json({
      error: 'Error in deleting Chief Complaint',
      details: err.message
    })
  }
}

// Present Illness History Complaints
const createPresentIllnessHistory = async (req, res) => {
  try {
    const newPresentIllnessHistory = new PresentIllnessHistoryModel({
      ...req.body
    })
    const savedPresentIllnessHistory = await newPresentIllnessHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Present Illness HistoryModel Added Successfully ',
      data: savedPresentIllnessHistory
    })
  } catch (error) {
    console.error('Error storing Present Illness HistoryModel:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllPresentIllnessHistory = async (req, res) => {
  try {
    const PresentIllnessHistory = await PresentIllnessHistoryModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: PresentIllnessHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateObjectivePresentIllnessHistory = async (req, res) => {
  try {
    const { id } = req.params
    const { objective } = req.body
    const PresentIllnessHistory = await PresentIllnessHistoryModel.findById(id)
    PresentIllnessHistory.objective.push(...objective)
    const newcPresentIllnessHistory = await PresentIllnessHistory.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Present Illness History Updated Objective Successfully ',
      data: newcPresentIllnessHistory
    })
  } catch (error) {
    console.error('Error storing Present Illness History Objective:', error)
    res.status(400).json({ error: error.message })
  }
}

const updatePresentIllnessHistory = async (req, res) => {
  try {
    const presentIllness = await PresentIllnessHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!presentIllness) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Present Illness History Not Found' })
    }
    return res.status(httpStatus.OK).json({
      msg: 'Present Illness History Updated Successfully',
      presentIllness
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Present Illness History Not Found', error })
  }
}

const deletePresentIllnessHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    const objectIdArray = ids.map(id => id.toString())

    const result = await PresentIllnessHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: 'No Present Illness History found with the provided IDs'
      })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Present Illness History deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Present Illness History',
      details: err.message
    })
  }
}

const GetMostPresentIllnessHistory = async (req, res) => {
  try {
    const { id } = req.params
    const PresentIllnessHistory = await PresentIllnessHistoryModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: PresentIllnessHistory })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Provisional Diagnosis
const createProvisionalDiagnosis = async (req, res) => {
  try {
    const newProvisionalDiagnosis = new ProvisionalDiagnosisModel({
      ...req.body
    })
    const savedProvisionalDiagnosis = await newProvisionalDiagnosis.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Provisional Diagnosis Added Successfully ',
      data: savedProvisionalDiagnosis
    })
  } catch (error) {
    console.error('Error storing Provisional Diagnosis:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllProvisionalDiagnosis = async (req, res) => {
  try {
    const ProvisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: ProvisionalDiagnosis })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateProvisionalDiagnosisById = async (req, res) => {
  try {
    const ProvisionalDiagnosis =
      await ProvisionalDiagnosisModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
    return res.status(httpStatus.OK).json({
      msg: 'Provisional Diagnosis  Updated Successfully',
      ProvisionalDiagnosis
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Provisional Diagnosis Not Found', error })
  }
}

const deleteProvisionalDiagnosisByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the ProvisionalDiagnosis with the provided IDs
    const result = await ProvisionalDiagnosisModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Provisional Diagnosis found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Provisional Diagnosis deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Provisional Diagnosis',
      details: err.message
    })
  }
}

const GetMostProvisionalDiagnosis = async (req, res) => {
  try {
    // const { id } = req.params;
    const ProvisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      delete: false
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: ProvisionalDiagnosis })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const importJson = async (req, res) => {
  try {
    const diagnosis = req.body.diagnosis
    const newdiagnosis = diagnosis.map(
      diagnosis => new ProvisionalDiagnosisModel(diagnosis)
    )

    await ProvisionalDiagnosisModel.insertMany(newdiagnosis)

    res
      .status(httpStatus.OK)
      .json({ msg: 'diagnosis imported successfully', newdiagnosis })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in importing medicines', details: error.message })
  }
}

// Final Diagnosis
const createFinalDiagnosis = async (req, res) => {
  try {
    const newFinalDiagnosis = new FinalDiagnosisModel({
      ...req.body
    })
    const savedFinalDiagnosis = await newFinalDiagnosis.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Final Diagnosis Added Successfully ',
      data: savedFinalDiagnosis
    })
  } catch (error) {
    console.error('Error storing Final Diagnosis:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllFinalDiagnosis = async (req, res) => {
  try {
    const FinalDiagnosis = await FinalDiagnosisModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: FinalDiagnosis })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateFinalDiagnosisById = async (req, res) => {
  try {
    const FinalDiagnosis = await FinalDiagnosisModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Final Diagnosis  Updated Successfully', FinalDiagnosis })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Final Diagnosis Not Found', error })
  }
}

const deleteFinalDiagnosisByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the FinalDiagnosis with the provided IDs
    const result = await FinalDiagnosisModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Final Diagnosis found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Final Diagnosis deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Final Diagnosis',
      details: err.message
    })
  }
}

const GetMostFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params
    const FinalDiagnosis = await FinalDiagnosisModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: FinalDiagnosis })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Risk Factor
const createRiskFactor = async (req, res) => {
  try {
    const newRiskFactor = new RiskFactorModel({ ...req.body })
    const savedRiskFactor = await newRiskFactor.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Risk Factor Added Successfully ', data: savedRiskFactor })
  } catch (error) {
    console.error('Error storing Risk Factor:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllRiskFactor = async (req, res) => {
  try {
    const RiskFactor = await RiskFactorModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: RiskFactor })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostRiskFactor = async (req, res) => {
  try {
    const { id } = req.params
    const RiskFactor = await RiskFactorModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(20) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: RiskFactor })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// OPD MENU
const getOpdMenu = async (req, res) => {
  try {
    const userId = req.user.adminId
    const existingAdmin = await AdminModel.findOne({ _id: userId })
    const refId = existingAdmin.refId.toString()
    const newOpdMenu = await OPDMenuModel.find({
      consultantId: refId,
      delete: false
    })
    res.status(httpStatus.OK).json({ data: newOpdMenu })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updatedOPDMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { menu, printMenu } = req.body
    const newOpdMenu = await OPDMenuModel.findOneAndUpdate(
      { consultantId: id },
      { $set: { menu: menu, printMenu: printMenu } },
      { new: true }
    )
    res
      .status(httpStatus.OK)
      .json({ msg: 'OPD Menu Updated.', data: newOpdMenu })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Local Examination
const createLocalExamination = async (req, res) => {
  try {
    const newLocalExamination = new LocalExaminationModel({ ...req.body })
    const savedLocalExamination = await newLocalExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Local Examination Added Successfully ',
      data: savedLocalExamination
    })
  } catch (error) {
    console.error('Error storing Risk Factor:', error)
    res.status(400).json({ error: error.message })
  }
}
const updateDiagramInLocalExamination = async (req, res) => {
  try {
    const { id } = req.params // Get the document ID
    const { diagram } = req.body // Extract diagram from request body

    if (!diagram) {
      return res.status(400).json({ error: 'Diagram data is required' })
    }

    const updateLocalDiagram = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $set: { 'exam.diagram': diagram } }, // Update only the exam.diagram field
      { new: true }
    )

    if (!updateLocalDiagram) {
      return res.status(404).json({ error: 'Local Examination not found' })
    }

    res.status(200).json({
      msg: 'Diagram Updated Successfully',
      data: updateLocalDiagram
    })
  } catch (error) {
    console.error('Error updating diagram:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
const updateDiagramInLocalExaminationDelete = async (req, res) => {
  try {
    const { id } = req.params // Get the document ID

    const updateLocalDiagram = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $set: { 'exam.diagram': '' } }, // Update only the exam.diagram field
      { new: true }
    )

    if (!updateLocalDiagram) {
      return res.status(404).json({ error: 'Local Examination not found' })
    }

    res.status(200).json({
      msg: 'Diagram Updated Successfully',
      data: updateLocalDiagram
    })
  } catch (error) {
    console.error('Error updating diagram:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getAllLocalExamination = async (req, res) => {
  try {
    const LocalExamination = await LocalExaminationModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: LocalExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateLocalExamination = async (req, res) => {
  try {
    const { id } = req.params
    const { subDisorder } = req.body
    const LocalExamination = await LocalExaminationModel.findById(id)
    LocalExamination.exam.subDisorder.push(...subDisorder)
    const newLocalExamination = await LocalExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Local Examination  Updated Successfully ',
      data: newLocalExamination
    })
  } catch (error) {
    console.error('Error updating Local examination:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateLocalExaminationById = async (req, res) => {
  try {
    const LocalExamination = await LocalExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'Local Examination  Updated Successfully',
      LocalExamination
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Local Examination Not Found', error })
  }
}

const deleteLocalExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the LocalExamination with the provided IDs
    const result = await LocalExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Local Examination found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Local Examination deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Local Examination',
      details: err.message
    })
  }
}

const GetMostUsedLocalExamination = async (req, res) => {
  try {
    const { id } = req.params

    const LocalExamination = await LocalExaminationModel.find({
      delete: false,
      departmentId: id
    }).sort({ createdAt: -1 })
    LocalExamination.forEach(exam => {
      exam.exam.subDisorder.reverse()
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15)
    })

    res.status(httpStatus.OK).json({ data: LocalExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const deleteLocalExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body // Assuming IDs are sent in the request body

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = deleteIds.map(id => new mongoose.Types.ObjectId(id)) // Ensure ObjectId format

    // Find the LocalExamination document by ID
    const result = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { 'exam.subDisorder': { _id: { $in: objectIdArray } } } },
      { new: true, multi: true } // Return the updated document
    )
    // Check if any subDisorders were actually deleted
    // if (result.exam.subDisorder.length === 0) {
    //   return res.status(httpStatus.NOT_FOUND).json({ msg: "No Local Examination subDisorder found with the provided IDs" });
    // }
    res.status(httpStatus.OK).json({
      msg: 'Local Examination subDisorder deleted successfully',
      result
    })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Local Examination subDisorder',
      details: err.message
    })
  }
}

const updateLocalExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params // Extract objectId and subDisorderId from params
    const updateData = req.body // The update data should be provided in the request body

    // Perform the update operation
    const result = await LocalExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        'exam.subDisorder._id': subDisorderId
      },
      {
        $set: { 'exam.subDisorder.$': updateData }
      },
      {
        new: true // Return the updated document
      }
    )

    // if (!result) {
    //   return res
    //     .status(httpStatus.NOT_FOUND)
    //     .json({ msg: "Local Examination or SubDisorder not found" });
    // }

    res
      .status(httpStatus.OK)
      .json({ msg: 'SubDisorder updated successfully', data: result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in updating Local Examination subDisorder',
      details: err.message
    })
  }
}

// General Examination
const getModelByActiveTab = activeTab => {
  switch (activeTab) {
    case 0:
      return GeneralExaminationModel
    case 1:
      return LocalExaminationModel
    case 2:
      return SystematicExaminationModel
    default:
      return null
  }
}

const deleteExaminationInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params // Extract from request body
    const { secondIndex, thirdIndex, innerDataIndexes, activeTab } =
      req.body.ids

    if (
      typeof secondIndex !== 'number' ||
      typeof thirdIndex !== 'number' ||
      !Array.isArray(innerDataIndexes) ||
      typeof activeTab !== 'number'
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const Model = getModelByActiveTab(activeTab) // Get model based on activeTab
    if (!Model) {
      return res.status(400).json({ msg: 'Invalid activeTab', success: false })
    }

    const examination = await Model.findById(id)
    if (!examination) {
      return res.status(404).json({ msg: 'Examination not found' })
    }

    const subdisorder = examination.exam?.subDisorder?.[secondIndex]
    if (!subdisorder) {
      return res
        .status(400)
        .json({ msg: 'Invalid second index', success: false })
    }

    const objectiveItem = subdisorder.objective?.[thirdIndex]
    if (!objectiveItem || !Array.isArray(objectiveItem.innerData)) {
      return res
        .status(400)
        .json({ msg: 'Invalid third index', success: false })
    }

    // Sort and remove elements in descending order to avoid index shifting
    const sortedIndexes = innerDataIndexes.sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1)
      }
    })

    examination.markModified('exam.subDisorder')
    await examination.save()

    res.status(200).json({
      msg: 'InnerData entries deleted successfully',
      updatedData: examination,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting innerData entries',
      details: err.message,
      success: false
    })
  }
}

const deleteExaminationObjectives = async (req, res) => {
  try {
    const { id } = req.params // Extract ID from request params
    const { secondIndex, thirdIndex, activeTab } = req.body.ids

    if (
      typeof secondIndex !== 'number' ||
      !Array.isArray(thirdIndex) || // Ensure thirdIndex is an array
      typeof activeTab !== 'number'
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const Model = getModelByActiveTab(activeTab) // Get model based on activeTab
    if (!Model) {
      return res.status(400).json({ msg: 'Invalid activeTab', success: false })
    }

    const examination = await Model.findById(id)
    if (!examination) {
      return res.status(404).json({ msg: 'Examination not found' })
    }

    const subdisorder = examination.exam?.subDisorder?.[secondIndex]
    if (!subdisorder || !Array.isArray(subdisorder.objective)) {
      return res
        .status(400)
        .json({
          msg: 'Invalid second index or no objectives found',
          success: false
        })
    }

    // Sort the indexes in descending order to prevent index shifting issues
    const sortedIndexes = thirdIndex.sort((a, b) => b - a)

    sortedIndexes.forEach(index => {
      if (index >= 0 && index < subdisorder.objective.length) {
        subdisorder.objective.splice(index, 1)
      }
    })

    examination.markModified('exam.subDisorder')
    await examination.save()

    res.status(200).json({
      msg: 'Objectives deleted successfully',
      updatedData: examination,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error deleting objectives',
      details: err.message,
      success: false
    })
  }
}

const editExaminationDiagram = async (req, res) => {
  try {
    const { id } = req.params
    const { activeTab, diagram } = req.body // Extract activeTab and diagram from request body
    if (typeof activeTab !== 'number' || !diagram) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const Model = getModelByActiveTab(activeTab) // Get model based on activeTab
    if (!Model) {
      return res.status(400).json({ msg: 'Invalid activeTab', success: false })
    }

    const examination = await Model.findById(id)
    if (!examination) {
      return res.status(404).json({ msg: 'Examination not found' })
    }

    // Update only the `diagram` field inside `exam`
    examination.exam.diagram = diagram

    examination.markModified('exam.diagram')
    await examination.save()

    res.status(200).json({
      msg: 'Diagram updated successfully',
      updatedData: examination,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating diagram',
      details: err.message,
      success: false
    })
  }
}

const editExaminationInnerDataEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { activeTab, secondIndex, thirdIndex, innerDataIndex, data } =
      req.body // Extract from request body

    if (
      typeof secondIndex !== 'number' ||
      typeof thirdIndex !== 'number' ||
      typeof innerDataIndex !== 'number' ||
      typeof activeTab !== 'number' ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const Model = getModelByActiveTab(activeTab) // Get model based on activeTab
    if (!Model) {
      return res.status(400).json({ msg: 'Invalid activeTab', success: false })
    }

    const examination = await Model.findById(id)
    if (!examination) {
      return res.status(404).json({ msg: 'Examination not found' })
    }

    const subdisorder = examination.exam?.subDisorder?.[secondIndex]
    if (!subdisorder) {
      return res
        .status(400)
        .json({ msg: 'Invalid second index', success: false })
    }

    const objectiveItem = subdisorder.objective?.[thirdIndex]
    if (!objectiveItem || !Array.isArray(objectiveItem.innerData)) {
      return res
        .status(400)
        .json({ msg: 'Invalid third index', success: false })
    }

    if (
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid innerData index', success: false })
    }

    objectiveItem.innerData[innerDataIndex].data = data

    examination.markModified('exam.subDisorder')
    await examination.save()

    res.status(200).json({
      msg: 'InnerData entry updated successfully',
      updatedData: examination,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating innerData entry',
      details: err.message,
      success: false
    })
  }
}

const editExaminationObjectiveDataLayer3 = async (req, res) => {
  try {
    const { id } = req.params
    const { activeTab, secondIndex, thirdIndex, data } = req.body // Extract from request body

    if (
      typeof secondIndex !== 'number' ||
      typeof thirdIndex !== 'number' || // Added missing validation
      typeof activeTab !== 'number' ||
      typeof data !== 'string' // Ensure data is a string
    ) {
      return res
        .status(400)
        .json({ msg: 'Invalid request data', success: false })
    }

    const Model = getModelByActiveTab(activeTab) // Get model based on activeTab
    if (!Model) {
      return res.status(400).json({ msg: 'Invalid activeTab', success: false })
    }

    const examination = await Model.findById(id)
    if (!examination) {
      return res.status(404).json({ msg: 'Examination not found' })
    }

    const subdisorder = examination.exam?.subDisorder?.[secondIndex]
    if (!subdisorder) {
      return res
        .status(400)
        .json({ msg: 'Invalid second index', success: false })
    }

    // Check if the objective exists
    if (!subdisorder.objective || !subdisorder.objective[thirdIndex]) {
      return res
        .status(400)
        .json({ msg: 'Invalid third index', success: false })
    }

    // Update the `data` field for the specified objective index
    subdisorder.objective[thirdIndex].data = data // Update data

    // Mark the modified path correctly
    examination.markModified('exam.subDisorder')

    await examination.save()

    res.status(200).json({
      msg: 'Objective data updated successfully',
      updatedData: examination,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error updating objective data',
      details: err.message,
      success: false
    })
  }
}

const createGeneralExamination = async (req, res) => {
  try {
    const newGeneralExamination = new GeneralExaminationModel({ ...req.body })
    const savedGeneralExamination = await newGeneralExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'General Examination Added Successfully ',
      data: savedGeneralExamination
    })
  } catch (error) {
    console.error('Error storing Risk Factor:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllGeneralExamination = async (req, res) => {
  try {
    const GeneralExamination = await GeneralExaminationModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: GeneralExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateGeneralExamination = async (req, res) => {
  try {
    const { id } = req.params
    const { subDisorder } = req.body
    const GeneralExamination = await GeneralExaminationModel.findById(id)
    GeneralExamination.exam.subDisorder.push(...subDisorder)
    const newGeneralExamination = await GeneralExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'General Examination  Updated Successfully ',
      data: newGeneralExamination
    })
  } catch (error) {
    console.error('Error updating General examination:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateGeneralExaminationById = async (req, res) => {
  try {
    const GeneralExamination = await GeneralExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'General Examination  Updated Successfully',
      GeneralExamination
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'General Examination Not Found', error })
  }
}

const deleteGeneralExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the GeneralExamination with the provided IDs
    const result = await GeneralExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No General Examination found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'General Examination deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting General Examination',
      details: err.message
    })
  }
}

const GetMostUsedGeneralExamination = async (req, res) => {
  try {
    const { id } = req.params

    const GeneralExamination = await GeneralExaminationModel.find({
      delete: false,
      departmentId: id
    }).sort({ createdAt: -1 })
    GeneralExamination.forEach(exam => {
      exam.exam.subDisorder.reverse()
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15)
    })

    res.status(httpStatus.OK).json({ data: GeneralExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const deleteGeneralExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body // Assuming IDs are sent in the request body

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = deleteIds.map(id => new mongoose.Types.ObjectId(id)) // Ensure ObjectId format

    // Find the GeneralExamination document by ID
    const result = await GeneralExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { 'exam.subDisorder': { _id: { $in: objectIdArray } } } },
      { new: true, multi: true } // Return the updated document
    )
    // Check if any subDisorders were actually deleted
    // if (result.exam.subDisorder.length === 0) {
    //   return res.status(httpStatus.NOT_FOUND).json({ msg: "No General Examination subDisorder found with the provided IDs" });
    // }
    res.status(httpStatus.OK).json({
      msg: 'General Examination subDisorder deleted successfully',
      result
    })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting General Examination subDisorder',
      details: err.message
    })
  }
}

const updateGeneralExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params // Extract objectId and subDisorderId from params
    const updateData = req.body // The update data should be provided in the request body

    // Perform the update operation
    const result = await GeneralExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        'exam.subDisorder._id': subDisorderId
      },
      {
        $set: { 'exam.subDisorder.$': updateData }
      },
      {
        new: true // Return the updated document
      }
    )

    // if (!result) {
    //   return res
    //     .status(httpStatus.NOT_FOUND)
    //     .json({ msg: "Local Examination or SubDisorder not found" });
    // }

    res
      .status(httpStatus.OK)
      .json({ msg: 'SubDisorder updated successfully', data: result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in updating Local Examination subDisorder',
      details: err.message
    })
  }
}

// Systematic Examination
const createSystematicExamination = async (req, res) => {
  try {
    const newSystematicExamination = new SystematicExaminationModel({
      ...req.body
    })
    const savedSystematicExamination = await newSystematicExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Systematic Examination Added Successfully ',
      data: savedSystematicExamination
    })
  } catch (error) {
    console.error('Error storing Systematic Examination:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllSystematicExamination = async (req, res) => {
  try {
    const SystematicExamination = await SystematicExaminationModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: SystematicExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params
    const { subDisorder } = req.body
    const SystematicExamination = await SystematicExaminationModel.findById(id)
    SystematicExamination.exam.subDisorder.push(...subDisorder)
    const newSystematicExamination = await SystematicExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Systematic Examination  Updated Successfully ',
      data: newSystematicExamination
    })
  } catch (error) {
    console.error('Error updating systematic examination:', error)
    res.status(400).json({ error: error.message })
  }
}

const updateAllSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params
    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      )
    res.status(httpStatus.CREATED).json({
      msg: 'Systematic Examination  Updated Successfully ',
      data: updatedSystematicExamination
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateDiagramInSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params // Get the document ID
    const { diagram } = req.body // Extract diagram from request body

    if (!diagram) {
      return res.status(400).json({ error: 'Diagram data is required' })
    }

    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { $set: { 'exam.diagram': diagram } }, // Update only the exam.diagram field
        { new: true }
      )

    if (!updatedSystematicExamination) {
      return res.status(404).json({ error: 'Systematic Examination not found' })
    }

    res.status(200).json({
      msg: 'Diagram Updated Successfully',
      data: updatedSystematicExamination
    })
  } catch (error) {
    console.error('Error updating diagram:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
const updateDiagramInSystematicExaminationDelete = async (req, res) => {
  try {
    const { id } = req.params // Get the document ID

    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { $set: { 'exam.diagram': '' } }, // Update only the exam.diagram field
        { new: true }
      )

    if (!updatedSystematicExamination) {
      return res.status(404).json({ error: 'Systematic Examination not found' })
    }

    res.status(200).json({
      msg: 'Diagram deleted Successfully',
      data: updatedSystematicExamination
    })
  } catch (error) {
    console.error('Error updating diagram:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const deleteSystematicExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the SystematicExamination with the provided IDs
    const result = await SystematicExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Systematic Examination found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Systematic Examination deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Systematic Examination',
      details: err.message
    })
  }
}

const GetMostUsedSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params

    const SystematicExamination = await SystematicExaminationModel.find({
      delete: false,
      departmentId: id
    }).sort({ createdAt: -1 })
    SystematicExamination.forEach(exam => {
      exam.exam.subDisorder.reverse()
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15)
    })

    res.status(httpStatus.OK).json({ data: SystematicExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const deleteSystematicExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body // Assuming IDs are sent in the request body

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = deleteIds.map(id => new mongoose.Types.ObjectId(id)) // Ensure ObjectId format

    // Find the SystematicExamination document by ID
    const result = await SystematicExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { 'exam.subDisorder': { _id: { $in: objectIdArray } } } },
      { new: true, multi: true } // Return the updated document
    )
    // Check if any subDisorders were actually deleted
    // if (result.exam.subDisorder.length === 0) {
    //   return res.status(httpStatus.NOT_FOUND).json({ msg: "No Systematic ExaminationModel subDisorder found with the provided IDs" });
    // }
    res.status(httpStatus.OK).json({
      msg: 'Systematic ExaminationModel subDisorder deleted successfully',
      result
    })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Systematic ExaminationModel subDisorder',
      details: err.message
    })
  }
}

const updateSystematicExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params // Extract objectId and subDisorderId from params
    const updateData = req.body // The update data should be provided in the request body

    // Perform the update operation
    const result = await SystematicExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        'exam.subDisorder._id': subDisorderId
      },
      {
        $set: { 'exam.subDisorder.$': updateData }
      },
      {
        new: true // Return the updated document
      }
    )

    // if (!result) {
    //   return res
    //     .status(httpStatus.NOT_FOUND)
    //     .json({ msg: "Local Examination or SubDisorder not found" });
    // }

    res
      .status(httpStatus.OK)
      .json({ msg: 'SubDisorder updated successfully', data: result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in updating Local Examination subDisorder',
      details: err.message
    })
  }
}

// Other Examination
const createOtherExamination = async (req, res) => {
  try {
    const newOtherExamination = new OtherExaminationModel({ ...req.body })
    const savedOtherExamination = await newOtherExamination.save()
    res.status(httpStatus.CREATED).json({
      msg: 'Other Examination Added Successfully ',
      data: savedOtherExamination
    })
  } catch (error) {
    console.error('Error storing Risk Factor:', error)
    res.status(400).json({ error: error.message })
  }
}

const getAllOtherExamination = async (req, res) => {
  try {
    const OtherExamination = await OtherExaminationModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: OtherExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateOtherExaminationById = async (req, res) => {
  try {
    const OtherExamination = await OtherExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    return res.status(httpStatus.OK).json({
      msg: 'Other Examination  Updated Successfully',
      OtherExamination
    })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Other Examination Not Found', error })
  }
}

const deleteOtherExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body // Assuming IDs are sent in the request body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Invalid or missing IDs array' })
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()) // No 'new' keyword required here

    // Delete the OtherExamination with the provided IDs
    const result = await OtherExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false
    })

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'No Other Examination found with the provided IDs' })
    }

    res
      .status(httpStatus.OK)
      .json({ msg: 'Other Examination deleted successfully', result })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error in deleting Other Examination',
      details: err.message
    })
  }
}

const GetMostUsedOtherExamination = async (req, res) => {
  try {
    const { id } = req.params
    const OtherExamination = await OtherExaminationModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ createdAt: -1 })
      .limit(15)
    res.status(httpStatus.OK).json({ data: OtherExamination })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// for patient procedure
const GetMostUsedSurgeryPackage = async (req, res) => {
  try {
    const { id } = req.params
    const surgeryPackage = await SurgeryPackageModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: surgeryPackage })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// for lab radiology pathology
const GetMostUsedRadiologyInvest = async (req, res) => {
  try {
    const { id } = req.params
    const RadiologyInvest = await InvestigationRadiologyMasterModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: RadiologyInvest })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const GetMostUsedPathologyInvest = async (req, res) => {
  try {
    const { id } = req.params
    const PathologygyInvest = await InvestigationPathologyMasterModel.find({
      delete: false,
      departmentId: id
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: PathologygyInvest })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// for all patent data to print and patient history
const getAllPatientData = async (req, res) => {
  try {
    const { patientId } = req.params
    const OPDAll = await OPDModel.find({
      patientId: patientId,
      confirmAppointment: true
    })
    if (!OPDAll || OPDAll.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Patient data not found' })
    }

    const patientData = []
    for (const opd of OPDAll) {
      const currentDate = new Date(opd.createdAt).toISOString().split('T')[0] // Format date as ISO string

      const chiefComplaintAll = await PatientChiefComplaintModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const provisionalDiagnosisAll =
        await PatientProvisionalDiagnosisModel.find({
          patientId: opd._id.toString(),
          createdAt: { $gte: currentDate }
        })
      const procedureAll = await PatientProcedureModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const instructionAll = await PatientInstructionModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const vitalsAll = await PatientVitalsModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const labRadiologyAll = await PatientLabRadiologyModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const examinationAll = await PatientExaminationModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const historyAll = await PatientHistroyModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const presentIllnessAll = await PatientPresentIllnessHistoryModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const glassPrescriptionAll = await PatientGlassPrescriptionModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const followUpAll = await PatientFollowUpModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const finalDiagnosisAll = await PatientFinalDiagnosisModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate }
      })
      const medicalPrescriptionAll = await PatientMedicalPrescriptionModel.find(
        {
          patientId: opd._id.toString(),
          createdAt: { $gte: currentDate }
        }
      ) // You may need to fetch medical prescriptions

      patientData.push({
        chiefComplaint: chiefComplaintAll,
        provisionalDiagnosis: provisionalDiagnosisAll,
        procedure: procedureAll,
        instruction: instructionAll,
        vitals: vitalsAll,
        labRadiology: labRadiologyAll,
        examination: examinationAll,
        history: historyAll,
        presentIllness: presentIllnessAll,
        glassPrescription: glassPrescriptionAll,
        followUp: followUpAll, // You may need to fetch surgery packages
        finalDiagnosis: finalDiagnosisAll,
        medicalPrescription: medicalPrescriptionAll,
        consultant: opd.consultant,
        consultantId: opd.consultantId,
        createdAt: currentDate
      })
    }
    res.status(httpStatus.OK).json({
      patientData: patientData
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getAllPatientdataToPrint = async (req, res) => {
  try {
    const { patientId, consultantId } = req.params

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const chiefComplaintAll = await PatientChiefComplaintModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const provisionalDiagnosisAll = await PatientProvisionalDiagnosisModel.find(
      {
        patientId: patientId,
        consultantId: consultantId,
        createdAt: { $gte: currentDate }
      }
    )
    const procedureAll = await PatientProcedureModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const instructionAll = await PatientInstructionModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const vitalsAll = await PatientVitalsModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const labRadiologyAll = await PatientLabRadiologyModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const examinationAll = await PatientExaminationModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const historyAll = await PatientHistroyModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const presentIllnessAll = await PatientPresentIllnessHistoryModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const glassPrescriptionAll = await PatientGlassPrescriptionModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const followUpAll = await PatientFollowUpModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })
    const finalDiagnosisAll = await PatientFinalDiagnosisModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate }
    })

    const medicalPrescriptionAll =
      await EmergencyPatientMedicalPrescriptionModel.find({
        patientId: patientId,
        consultantId: consultantId,
        createdAt: { $gte: currentDate }
      })

    res.status(httpStatus.OK).json({
      patientData: [
        {
          chiefComplaint: chiefComplaintAll,
          provisionalDiagnosis: provisionalDiagnosisAll,
          procedure: procedureAll,
          instruction: instructionAll,
          vitals: vitalsAll,
          labRadiology: labRadiologyAll,
          examination: examinationAll,
          history: historyAll,
          presentIllness: presentIllnessAll,
          glassPrescription: glassPrescriptionAll,
          followUp: followUpAll, // You may need to fetch surgery packages
          finalDiagnosis: finalDiagnosisAll,
          medicalPrescription: medicalPrescriptionAll
        }
      ]
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const generateInvoiceNumber = async () => {
  let invoiceNumber = await InvoiceNoModel.findOne()

  if (!invoiceNumber) {
    invoiceNumber = new InvoiceNoModel({ invoiceNo: '1' })
  } else {
    const incrementedInvoiceNo = (
      parseInt(invoiceNumber.invoiceNo) + 1
    ).toString()
    invoiceNumber.invoiceNo = incrementedInvoiceNo
  }

  await invoiceNumber.save()
  return invoiceNumber.invoiceNo
}

// const createOPDBilling = async (req, res) => {
//   try {
//     const { opdId, paidAmount, charges, discountCharges, finalAmount } = req.body;
//     const opd = await OPDModel.findById(opdId);
//     if (!opd) {
//       return res.status(httpStatus.NOT_FOUND).json({ error: "OPD not found" });
//     }
//     const totalPaidAmount = opd.paidAmount + paidAmount;

//     if (totalPaidAmount >= finalAmount) {
//       const updatedOpd = await OPDModel.findByIdAndUpdate(
//         opdId,
//         {
//           billingStatus: "Paid",
//           totalAmount: charges,
//           discountAmount: discountCharges,
//           finalAmount: finalAmount,
//           paidAmount: totalPaidAmount,
//           confirmAppointment: true,
//         },
//         { new: true }
//       );
//     } else if (totalPaidAmount > 0) {
//       const updatedOpd = await OPDModel.findByIdAndUpdate(
//         opdId,
//         {
//           billingStatus: "Partially_Paid",
//           totalAmount: charges,
//           discountAmount: discountCharges,
//           finalAmount: finalAmount,
//           paidAmount: totalPaidAmount,
//         },
//         { new: true }
//       );
//     } else if (totalPaidAmount === 0) {
//       const updatedOpd = await OPDModel.findByIdAndUpdate(
//         opdId,
//         {
//           billingStatus: "Non_Paid",
//           totalAmount: charges,
//           discountAmount: discountCharges,
//           finalAmount: finalAmount,
//           paidAmount: totalPaidAmount,
//         },
//         { new: true }
//       );
//     }

//     const invoiceNumber = await generateInvoiceNumber();
//     const opdbilling = new OPDBillingModel({ ...req.body, invoiceNo: invoiceNumber });

//     const servicesType = opdbilling.services.map((service) => service.type);
//     const servicesId = opdbilling.services.map((service) => service.refId);
//     if (servicesType.includes("Services")) {
//       const serviceDetails = await ServiceDetailsModel.find({
//         _id: { $in: servicesId },
//       });
//       serviceDetails.forEach((service) => {
//         const newserviceDetails = opdbilling.services.find(
//           (p) => p.refId === service._id.toString()
//         );
//         if (newserviceDetails) {
//           service.count = (service.count || 0) + 1;
//         }
//       });
//       await Promise.all(serviceDetails.map((service) => service.save()));
//     } else if (servicesType.includes("Investigation")) {
//       const Investigation = await ServiceDetailsModel.find({
//         _id: { $in: servicesId },
//       });
//       Investigation.forEach((invest) => {
//         const newinvestigation = opdbilling.services.find(
//           (p) => p.refId === invest._id.toString()
//         );
//         if (newinvestigation) {
//           invest.count = (invest.count || 0) + 1;
//         }
//       });
//       await Promise.all(Investigation.map((invest) => invest.save()));
//     } else if (servicesType.includes("OPD Package")) {
//       const opdPackage = await OPDPackageModel.find({
//         _id: { $in: servicesId },
//       });
//       opdPackage.forEach((opdp) => {
//         const newopdp = opdbilling.services.find(
//           (p) => p.refId === opdp._id.toString()
//         );
//         if (newopdp) {
//           opdp.count = (opdp.count || 0) + 1;
//         }
//       });
//       await Promise.all(opdPackage.map((opdp) => opdp.save()));
//     }
//     const savedopdbilling = await opdbilling.save();
//     res
//       .status(httpStatus.OK)
//       .json({ msg: "OPD Billing created successfully", data: savedopdbilling });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Internal server error", error });
//   }
// };

const createOPDBilling = async (req, res) => {
  try {
    const { opdId, paidAmount, charges, discountCharges, finalAmount } =
      req.body
    const opd = await OpdPatientModel.findById(opdId)

    if (!opd) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'OPD not found' })
    }

    const totalPaidAmount = opd.paidAmount + paidAmount

    // Always update the billing status based on the totalPaidAmount
    let billingStatus = 'Non_Paid' // Default status
    if (totalPaidAmount >= finalAmount) {
      billingStatus = 'Paid'
    } else if (totalPaidAmount > 0) {
      billingStatus = 'Partially_Paid'
    }

    // Update OPD document
    await OpdPatientModel.findByIdAndUpdate(
      opdId,
      {
        billingStatus,
        totalAmount: charges,
        discountAmount: discountCharges,
        finalAmount: finalAmount,
        paidAmount: totalPaidAmount,
        confirmAppointment: billingStatus === 'Paid' // only confirm if fully paid
      },
      { new: true }
    )

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber()

    // Create OPD Billing record
    const opdbilling = new OPDBillingModel({
      ...req.body,
      invoiceNo: invoiceNumber
    })

    const servicesType = opdbilling.services.map(service => service.type)
    const servicesId = opdbilling.services.map(service => service.refId)

    // Handle updates to service counts (Services, Investigation, or OPD Package)
    const updateServiceCount = async (serviceType, serviceModel) => {
      const services = await serviceModel.find({ _id: { $in: servicesId } })
      services.forEach(service => {
        const newserviceDetails = opdbilling.services.find(
          p => p.refId === service._id.toString()
        )
        if (newserviceDetails) {
          service.count = (service.count || 0) + 1
        }
      })
      await Promise.all(services.map(service => service.save()))
    }

    if (servicesType.includes('Services')) {
      await updateServiceCount('Services', ServiceDetailsModel)
    } else if (servicesType.includes('Investigation')) {
      await updateServiceCount('Investigation', ServiceDetailsModel)
    } else if (servicesType.includes('OPD Package')) {
      await updateServiceCount('OPD Package', OPDPackageModel)
    }

    // Save the OPD Billing record
    const savedOpdBilling = await opdbilling.save()

    res
      .status(httpStatus.OK)
      .json({ msg: 'OPD Billing created successfully', data: savedOpdBilling })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error', error })
  }
}

const getOPDBilling = async (req, res) => {
  try {
    const { patientId, opdId } = req.params
    const billingData = []
    const opdbilling = await OPDBillingModel.find({
      opdId: opdId,
      delete: false
    })
    const opd = await OPDModel.find({ patientId: patientId, delete: false })
    if (!opd) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'OPD not found' })
    }
    billingData.push({ opdbilling: opdbilling ?? null }, { opd: opd })

    res
      .status(httpStatus.OK)
      .json({ msg: 'OPD Billing found', data: billingData })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getMostUsedServiceDetails = async (req, res) => {
  try {
    const { departmentId, patientPayeeId } = req.params

    // Fetch service details
    const serviceDetails = await ServiceDetailsModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      whichService: 'Service',
      patientType: 'Regular',
      patientEncounter: 'OPD'
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(20) // Limit the response to 20 results

    // Fetch investigation details
    const investigationDetails = await ServiceDetailsModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      whichService: { $ne: 'Service' }, // Not equal to 'Service'
      patientType: 'Regular',
      patientEncounter: 'OPD'
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(20) // Limit the response to 20 results

    // Fetch OPD package details
    const opdDetails = await OPDPackageModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      patientType: 'Regular',
      patientEncounter: 'OPD'
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30) // Limit the response to 30 results

    res.status(httpStatus.OK).json({
      msg: 'Most Used Service Details found',
      data: {
        services: serviceDetails,
        investigation: investigationDetails,
        OPD: opdDetails
      }
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// opd patient count by consultant

const getPatientCountByConsultant = async (req, res) => {
  try {
    const user = await AdminModel.findById(req.user.adminId)
    if (user.role == 'doctor') {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      const totalPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        createdAt: { $gte: currentDate }
      })

      const checkPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        status: 'out',
        createdAt: { $gte: currentDate }
      })

      const watingPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        status: 'pending',
        createdAt: { $gte: currentDate }
      })

      const patientCount = await Promise.all([
        totalPatients,
        checkPatients,
        watingPatients
      ])

      res.status(httpStatus.OK).json({
        msg: 'Patient Count found',
        data: {
          totalPatients: patientCount[0],
          checkPatients: patientCount[1],
          watingPatients: patientCount[2]
        }
      })
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'You are not authorized to access this route' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

module.exports = {
  // opd registration
  createOpdRegistion,
  updateOpdRegistion,
  changeConfirmAppointmentStatus,
  changeCancelAppointmentStatus,
  getAllOpdRegistration,
  getCountByConsultant,
  getOPDRegistrationResponse,
  getOPDRegistrationBYBilling,
  changePatientInStatus,

  //Medical Problem
  createMedicalProblem,
  getAllMedicalProblem,
  updateMedicalProblem,
  deleteMedicalProblemById,
  GetMostUsedMedicalProblem,
  createFamilyHistoryProblem,
  getAllFamilyHistoryProblems,
  updateFamilyHistoryProblem,
  deleteFamilyHistoryProblems,
  getMostUsedFamilyProblems,

  //Drug History
  createDrugHistory,
  getAllDrugHistory,
  updateDrugHistory,
  deleteDrugHistoryById,
  GetMostUsedDrugHistory,

  // Drug Allergy
  createDrugAllergy,
  getAllDrugAllergy,
  updateDrugAllergyById,
  deleteDrugAllergyByIds,
  GetMostUsedDrugAllergy,

  // Food Allergy
  createFoodAllergy,
  getAllFoodAllergy,
  updateFoodAllergyById,
  deleteFoodAllergyByIds,
  GetMostUsedFoodAllergy,

  // General Allergy
  createGeneralAllergy,
  getAllGeneralAllergy,
  updateGeneralAllergyById,
  deleteGeneralAllergyByIds,
  GetMostUsedGeneralAllergy,

  // Family Member
  createFamilyMember,
  getAllFamilyMember,
  GetMostUsedFamilyMember,
  deleteFamilyMember,

  // Life Style
  createLifeStyle,
  getAllLifeStyle,
  updateLifeStyleById,
  deleteLifeStyleByIds,
  GetMostUsedLifeStyle,
  updateObjectiveLifeStyle,
  editLifeStyleObjectiveInnerDataEntry,
  deleteLifeStyleObjectiveInnerDataEntriesByIndex,
  deleteLifeStyleObjectiveEntriesByIndex,
  updateLifeStyleObjectiveEntryByIndex,

  // Gynac History
  createGynacHistory,
  getAllGynacHistory,
  GetMostUsedGynacHistory,
  updateGynacHistoryById,
  deleteGynacHistoryByIds,
  updateObjectiveGynacHistory,
  deleteGynacObjectiveEntriesByIndex,
  updateGynacObjectiveEntryByIndex,
  deleteGynacObjectiveInnerDataEntriesByIndex,
  editGynacObjectiveInnerDataEntry,

  // Obstetric History
  createObstetricHistory,
  getAllObstetricHistory,
  GetMostUsedObstetricHistory,
  updateObstetricHistoryById,
  deleteObstetricHistoryByIds,
  updateObjectiveObstetricHistory,
  deleteObstetricObjectiveEntriesByIndex,
  updateObstetricObjectiveEntryByIndex,

  // Other History
  createOtherHistory,
  getAllOtherHistory,
  GetMostUsedOtherHistory,
  updateOtherHistoryById,
  deleteOtherHistoryByIds,
  deleteOtherObjectiveEntriesByIndex,
  deleteOtherObjectiveInnerDataEntriesByIndex,
  editOtherObjectiveInnerDataEntry,
  updateOtherObjectiveEntryByIndex,
  updateObjectiveOtherHistory,

  // Nutritional History
  createNutritionalHistory,
  getAllNutritionalHistory,
  GetMostUsedNutritionalHistory,
  updateNutritionalHistoryById,
  deleteNutritionalHistoryByIds,
  updateObjectiveNutritionalHistory,
  updateNutritionalObjectiveEntryByIndex,
  deleteNutritionalObjectiveEntriesByIndex,
  deleteNutritionalObjectiveInnerDataEntriesByIndex,
  editNutritionalObjectiveInnerDataEntry,
  deletePediatricObjectiveInnerDataEntriesByIndex,
  editPediatricObjectiveInnerDataEntry,
  deleteObstetricObjectiveInnerDataEntriesByIndex,
  editObstetricObjectiveInnerDataEntry,

  // Pediatric History
  createPediatricHistory,
  getAllPediatricHistory,
  GetMostUsedPediatricHistory,
  updatePediatricHistoryById,
  deletePediatricHistoryByIds,
  updateObjectivePediatricHistory,
  deletePediatricObjectiveEntriesByIndex,
  updatePediatricObjectiveEntryByIndex,

  // Procedure
  createProcedure,
  getAllProcedure,
  updateProcedureById,
  deleteProcedureByIds,
  GetMostUsedProcedure,

  // Instruction
  createInstruction,
  getAllInstruction,
  updateInstructionById,
  deleteInstructionByIds,
  GetMostInstruction,

  // Chief Complaints
  createChiefComplaint,
  getAllChiefComplaint,
  updateCheifcomplaint,
  updateDescriptionCheifcomplaint,
  updateRelevingFactors,
  updateSinceCheifcomplaint,
  updatePainDuration,
  updateTreatmentCheifcomplaint,
  updateLocationCheifcomplaint,
  GetMostCheifcomplaint,
  updateQualityPain,
  updateNatureOfPain,
  updateAggregatingFactors,
  updatePainLocationCheifcomplaint,
  updateCheifcomplaintById,
  deleteCheifcomplaintByIds,
  deleteSingleChiefComplaint,
  createPainChiefComplaint,
  getAllPainChiefComplaint,
  deleteSinglePainChiefComplaint,
  // Present Illness History
  createPresentIllnessHistory,
  getAllPresentIllnessHistory,
  updateObjectivePresentIllnessHistory,
  updatePresentIllnessHistory,
  deletePresentIllnessHistoryByIds,
  GetMostPresentIllnessHistory,

  // Provisional Diagnosis
  createProvisionalDiagnosis,
  getAllProvisionalDiagnosis,
  updateProvisionalDiagnosisById,
  deleteProvisionalDiagnosisByIds,
  GetMostProvisionalDiagnosis,
  importJson,

  // Final Diagnosis
  createFinalDiagnosis,
  getAllFinalDiagnosis,
  updateFinalDiagnosisById,
  deleteFinalDiagnosisByIds,
  GetMostFinalDiagnosis,

  // Risk Factor
  createRiskFactor,
  getAllRiskFactor,
  GetMostRiskFactor,

  // OPD Menu
  getOpdMenu,
  updatedOPDMenu,

  // Local Examination
  updateDiagramInLocalExamination,
  updateDiagramInLocalExaminationDelete,
  createLocalExamination,
  getAllLocalExamination,
  updateLocalExamination,
  updateLocalExaminationById,
  deleteLocalExaminationByIds,
  GetMostUsedLocalExamination,
  deleteLocalExaminationSubDisorderByIds,
  updateLocalExaminationSubDisorderById,

  // General Examination
  editExaminationInnerDataEntry,
  editExaminationObjectiveDataLayer3,
  deleteExaminationInnerDataEntriesByIndex,
  deleteExaminationObjectives,
  editExaminationDiagram,
  createGeneralExamination,
  getAllGeneralExamination,
  updateGeneralExamination,
  updateGeneralExaminationById,
  deleteGeneralExaminationByIds,
  GetMostUsedGeneralExamination,
  deleteGeneralExaminationSubDisorderByIds,
  updateGeneralExaminationSubDisorderById,

  // Systematic Examination
  createSystematicExamination,
  getAllSystematicExamination,
  updateSystematicExamination,
  updateAllSystematicExamination,
  updateDiagramInSystematicExamination,
  deleteSystematicExaminationByIds,
  GetMostUsedSystematicExamination,
  deleteSystematicExaminationSubDisorderByIds,
  updateSystematicExaminationSubDisorderById,
  updateDiagramInSystematicExaminationDelete,

  // Other Examination
  createOtherExamination,
  getAllOtherExamination,
  updateOtherExaminationById,
  deleteOtherExaminationByIds,
  GetMostUsedOtherExamination,

  // for patient procedure
  GetMostUsedSurgeryPackage,

  // for lab radiology pathology
  GetMostUsedRadiologyInvest,
  GetMostUsedPathologyInvest,

  getAllPatientData,
  getAllPatientdataToPrint,

  // opd billing
  createOPDBilling,
  getOPDBilling,
  getMostUsedServiceDetails,

  // opd patient count by consultant
  getPatientCountByConsultant,
  updateLifeStyleByIdForLastLayer
}
