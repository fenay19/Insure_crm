const express = require('express')
const SupportRouter = express.Router()
const { handleToken } = require('../../../utils/handleToken')
const { SupportController } = require('../../../controllers')
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

SupportRouter.post(
  '/basicDetails',
  upload.single('profilePhoto'),
  SupportController.createBasicDetails
)

SupportRouter.put(
    '/basicDetails/:id',
    upload.single('profilePhoto'),
    SupportController.updateBasicDetails
)

SupportRouter.put(
    '/pastEmploymentDetails/:id',
    SupportController.updatePastEmploymentDetails
)

SupportRouter.put(
    '/employmentDetails/:id',
    SupportController.updateEmploymentDetails
)

SupportRouter.put(
    '/documents/:id',
    upload.any(),
    SupportController.updateDocuments
)

SupportRouter.put(
    '/hrFinance/:id',
    upload.single('cancelCheck'),
    SupportController.updateHrFinanceDetails
)

SupportRouter.get('/', SupportController.getAllSupportData)
SupportRouter.get('/:id', SupportController.getSupportById)
SupportRouter.get('/supportData/reportTo', SupportController.getSupportForReportTo)

SupportRouter.get('/supportData/getEmployeeCode', SupportController.generateEmpCode)

SupportRouter.put('/delete/:id', SupportController.deleteSupport)

module.exports = SupportRouter


