const express = require('express')
const { handleToken } = require('../../../utils/handleToken')

const MedicalOfficerRouter = express.Router()

const { MedicalOfficerController } = require('../../../controllers')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images')
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({ storage })

MedicalOfficerRouter.post(
  '/basicDetails',
  upload.single('profilePhoto'),
  MedicalOfficerController.createBasicDetails
)

MedicalOfficerRouter.put(
  '/basicDetails/:id',
  upload.single('profilePhoto'),
  MedicalOfficerController.updateBasicDetails
)

MedicalOfficerRouter.put(
  '/pastEmploymentDetails/:id',
  MedicalOfficerController.updatePastEmploymentDetails
)

MedicalOfficerRouter.put(
  '/employmentDetails/:id',
  MedicalOfficerController.updateEmploymentDetails
)

MedicalOfficerRouter.put(
  '/qualification/:id',
  MedicalOfficerController.updateQualification
)

MedicalOfficerRouter.put(
  '/additionalDetails/:id',
  MedicalOfficerController.updateAdditionalDetails
)

MedicalOfficerRouter.put(
  '/documents/:id',
  upload.any(),
  MedicalOfficerController.updateDocuments
)

MedicalOfficerRouter.put(
  '/hrFinance/:id',
  upload.single('cancelCheck'),
  MedicalOfficerController.updateHrFinanceDetails
)

MedicalOfficerRouter.get(
  '/',
  MedicalOfficerController.getAllMedicalOfficers
)

MedicalOfficerRouter.get(
  '/:id',
  MedicalOfficerController.getMedicalOfficerDataById
)

MedicalOfficerRouter.get(
  '/medicalOfficerData/reportTo',
  MedicalOfficerController.getMedicalOfficerDataForReportTo
)

MedicalOfficerRouter.get(
  '/medicalOfficerData/getEmployeeCode',
  MedicalOfficerController.generateEmpCode
)


MedicalOfficerRouter.put('/delete/:id',MedicalOfficerController.deleteMedicalOfficer)
MedicalOfficerRouter.put('/system-right/:id',MedicalOfficerController.createSystemRights);


module.exports = MedicalOfficerRouter
