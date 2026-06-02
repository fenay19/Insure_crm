const express = require('express')
const AdministrativeRouter = express.Router()
const { handleToken } = require('../../../utils/handleToken')
const { AdministrativeController } = require('../../../controllers')
const multer = require('multer')
const { Administrative } = require('../../../models')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images')
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

console.log(__dirname)
const upload = multer({ storage })

AdministrativeRouter.post(
  '/basicDetails',
  handleToken,
  upload.single('profilePhoto'),
  AdministrativeController.createBasicDetails
)

//todo: for staff login
AdministrativeRouter.post(
  '/staff-login',
  AdministrativeController.loginStaff
)

AdministrativeRouter.put(
  '/basicDetails/:id',
  handleToken,
  upload.single('profilePhoto'),
  AdministrativeController.updateBasicDetails
)

AdministrativeRouter.put(
  '/pastEmploymentDetails/:id',
  handleToken,
  AdministrativeController.updatePastEmploymentDetails
)

AdministrativeRouter.put(
  '/employmentDetails/:id',
  handleToken,
  AdministrativeController.updateEmploymentDetails
)

AdministrativeRouter.put(
  '/documents/:id',
  handleToken,
  upload.any(),
  AdministrativeController.updateDocuments
)

// PUT route for creating or updating education
AdministrativeRouter.put(
  '/education/:id', handleToken, upload.none(),
  AdministrativeController.createOrUpdateEducation
);

AdministrativeRouter.put(
  '/hrFinance/:id', handleToken,
  upload.single('cancelCheck'),
  AdministrativeController.updateHrFinanceDetails
)

AdministrativeRouter.put(
  '/SalaryAndWages/:id', handleToken,
  AdministrativeController.updateSalaryAndWagesDetails
)

AdministrativeRouter.put(
  '/systemRights/:id', handleToken,
  AdministrativeController.updateSystemRights
)

//todo: generate emp code
AdministrativeRouter.get('/generate-employee-code', AdministrativeController.generateEmployeeCode)


AdministrativeRouter.get('/', handleToken, AdministrativeController.getAllAdministrativeData)
AdministrativeRouter.get('/:id', handleToken, AdministrativeController.getAdministrativeById)
AdministrativeRouter.get(
  '/administrativeData/reportTo', handleToken,
  AdministrativeController.getAdministrativeForReportTo
)
AdministrativeRouter.get(
  '/administrativeData/getEmployeeCode', 
  AdministrativeController.generateEmpCode
)


AdministrativeRouter.put('/delete/:id', handleToken, AdministrativeController.deleteAdministrative)

module.exports = AdministrativeRouter
