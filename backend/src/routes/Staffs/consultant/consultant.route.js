const express = require('express');
const consultantRouter = express.Router();
const { consultantController } = require('../../../controllers');
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

consultantRouter.post('/',upload.fields([
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
]),handleToken,consultantController.createDoctorInSteps);

consultantRouter.post('/import', handleToken, consultantController.bulkImport);

consultantRouter.get('/', handleToken,consultantController.getAllConsultants);

consultantRouter.get('/:id', handleToken,consultantController.getConsultantById);
consultantRouter.get('/department/:id', handleToken,consultantController.getConsultantByDepartment);
consultantRouter.put('/:id', handleToken,consultantController.updateConsultantById);

consultantRouter.put('/delete/:id', handleToken,consultantController.markConsultantAsDeleted);
consultantRouter.put('/system-right/:id', handleToken,consultantController.createSystemRights);
consultantRouter.put('/',upload.fields([
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
]),handleToken,consultantController.updateUploadedDocuments);

module.exports = consultantRouter;
