const express = require('express')

const NewConsultantRouter = express.Router()

const { handleToken } = require('../../../utils/handleToken')

const { ConsultantsController } = require('../../../controllers')

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

NewConsultantRouter.post(
  '/basicDetails',
  upload.single('profilePhoto'),
  ConsultantsController.createBasicDetails
)

NewConsultantRouter.put(
  '/basicDetails/:id',
  upload.single('profilePhoto'),
  ConsultantsController.updateBasicDetails
)

NewConsultantRouter.put(
  '/pastEmploymentDetails/:id',
  ConsultantsController.updatePastEmploymentDetails
)

NewConsultantRouter.put(
  '/employmentDetails/:id',
  ConsultantsController.updateEmploymentDetails
)

NewConsultantRouter.put(
  '/qualification/:id',
  ConsultantsController.updateQualification
)

NewConsultantRouter.put(
  '/additionalDetails/:id',
  ConsultantsController.updateAdditionalDetails
)

NewConsultantRouter.put(
  '/documents/:id',
  upload.any(),
  ConsultantsController.updateDocuments
)

NewConsultantRouter.put(
  '/hrFinance/:id',
  upload.single('cancelCheck'),
  ConsultantsController.updateHrFinanceDetails
)

NewConsultantRouter.get(
  '/',
  ConsultantsController.getAllConsultantData
)

NewConsultantRouter.get(
  '/:id',
  ConsultantsController.getConsultantById
)

NewConsultantRouter.get('/consultantData/reportTo', ConsultantsController.getConsultantForReportTo)
NewConsultantRouter.get('/consultantData/getEmployeeCode', ConsultantsController.generateEmpCode)


NewConsultantRouter.put('/delete/:id', ConsultantsController.deleteConsultant)
NewConsultantRouter.put('/system-right/:id', handleToken,ConsultantsController.createSystemRights);
module.exports = NewConsultantRouter
