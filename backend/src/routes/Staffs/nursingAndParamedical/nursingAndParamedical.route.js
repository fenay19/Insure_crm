const express = require('express')
const NursingAndParamedicalRouter = express.Router()
const { handleToken } = require('../../../utils/handleToken')
const { NursingAndParamedicalController } = require('../../../controllers')
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

NursingAndParamedicalRouter.post(
  '/basicDetails',
  upload.single('profilePhoto'),
  NursingAndParamedicalController.createBasicDetails
)

NursingAndParamedicalRouter.put(
  '/basicDetails/:id',
  upload.single('profilePhoto'),
  NursingAndParamedicalController.updateBasicDetails
)

NursingAndParamedicalRouter.put(
  '/pastEmploymentDetails/:id',
  NursingAndParamedicalController.updatePastEmploymentDetails
)

NursingAndParamedicalRouter.put(
  '/employmentDetails/:id',
  NursingAndParamedicalController.updateEmploymentDetails
)

NursingAndParamedicalRouter.put(
  '/qualification/:id',
  NursingAndParamedicalController.updateQualification
)

NursingAndParamedicalRouter.put(
  '/additionalDetails/:id',
  NursingAndParamedicalController.updateAdditionalDetails
)

NursingAndParamedicalRouter.put(
  '/documents/:id',
  upload.any(),
  NursingAndParamedicalController.updateDocuments
)

NursingAndParamedicalRouter.put(
  '/hrFinance/:id',
  upload.single('cancelCheck'),
  NursingAndParamedicalController.updateHrFinanceDetails
)

NursingAndParamedicalRouter.get(
  '/',
  NursingAndParamedicalController.getAllNursingAndTechnicianData
)

NursingAndParamedicalRouter.get(
  '/:id',
  NursingAndParamedicalController.getNursingAndTechnicianById
)

NursingAndParamedicalRouter.get('/nursingAndParamedicalData/reportTo', NursingAndParamedicalController.getNursingAndParamedicalForReportTo)
NursingAndParamedicalRouter.get('/nursingAndParamedicalData/getEmployeeCode', NursingAndParamedicalController.generateEmpCode)

NursingAndParamedicalRouter.put('/delete/:id', NursingAndParamedicalController.deleteNursingAndParamedical)
NursingAndParamedicalRouter.put('/system-right/:id', handleToken,NursingAndParamedicalController.createSystemRights);


module.exports = NursingAndParamedicalRouter
