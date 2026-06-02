const express = require('express');
const employeeRouter = express.Router();
const { employeeController } = require('../../../controllers');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const {handleToken} = require('../../../utils/handleToken'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${file.fieldname}-${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

employeeRouter.post('/',upload.fields([
    { name: 'aadharCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'passbook', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'joining', maxCount: 1 },
    { name: 'revealing', maxCount: 1 },
    { name: 'SSC', maxCount: 1 },
    { name: 'HSC', maxCount: 1 },
    { name: 'graduation', maxCount: 1 },
    { name: 'postGraduation', maxCount: 1 },
    { name: 'other', maxCount: 1 },
    { name: 'sign', maxCount: 1 }
]),handleToken, employeeController.createAdminInSteps);

employeeRouter.post('/import', handleToken, employeeController.bulkImport);

employeeRouter.get('/',handleToken, employeeController.getAllAdmins);

employeeRouter.get('/:id', handleToken,employeeController.getAdminById);

employeeRouter.put('/:id', handleToken,employeeController.updateAdminById);

employeeRouter.put('/delete/:id', handleToken,employeeController.markAdminAsDeleted);

employeeRouter.put('/',upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'passbook', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'joining', maxCount: 1 },
  { name: 'revealing', maxCount: 1 },
  { name: 'SSC', maxCount: 1 },
  { name: 'HSC', maxCount: 1 },
  { name: 'graduation', maxCount: 1 },
  { name: 'postGraduation', maxCount: 1 },
  { name: 'other', maxCount: 1 },
  { name: 'sign', maxCount: 1 }
]),handleToken, employeeController.updateUploadedDocuments);

module.exports = employeeRouter;
