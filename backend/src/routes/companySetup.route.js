const express = require('express');
const companySetupRouter = express.Router();
const { companyController } = require('../controllers');
const { validateCompanySetup } = require('../validations/companySetup.validation');
const { handleToken } = require('../utils/handleToken');

const multer = require('multer');
const path = require('path');

// Use memoryStorage instead of diskStorage to store files in memory as Buffer objects
const storage = multer.memoryStorage();

// File filter to allow only specific types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false);
  }
};

// Set up multer with memoryStorage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 2MB
});

// Route to add company details, including files (hospitalLogo, headerImage, footerImage)
companySetupRouter.post(
  '/',
  upload.fields([
    { name: 'hospitalLogo', maxCount: 1 },
    { name: 'headerImage', maxCount: 1 },
    { name: 'footerImage', maxCount: 1 }
  ]),
  handleToken, // Token validation middleware
  validateCompanySetup, // Input validation middleware
  companyController.addCompanyDetails // Controller to handle adding company details
);

// Route to get company details
companySetupRouter.get(
  '/',
  handleToken, // Token validation middleware
  companyController.getCompanySetupDetails // Controller to handle fetching company details
);

// Route to update company setup details, including file updates
companySetupRouter.put(
  '/:id',
  handleToken, // Token validation middleware
  upload.fields([
    { name: 'hospitalLogo', maxCount: 1 },
    { name: 'headerImage', maxCount: 1 },
    { name: 'footerImage', maxCount: 1 }
  ]),
  companyController.updateCompanySetupDetails // Controller to handle updating company details
);

module.exports = companySetupRouter;
