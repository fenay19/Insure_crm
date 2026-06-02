// const Joi = require('joi');
// const httpStatus = require("http-status");

// // Define Joi validation schema
// const companySetupValidation = Joi.object({
//   hospitalName: Joi.string().required().messages({
//     'string.empty': 'Hospital Name is required',
//   }),
//   hospitalAddress: Joi.string().required().messages({
//     'string.empty': 'Hospital Address is required',
//   }),
//   Pincode: Joi.string()
//     .length(6)
//     .pattern(/^[0-9]+$/)
//     .required()
//     .messages({
//       'string.empty': 'Pincode is required',
//       'string.length': 'Pincode must be exactly 6 digits',
//       'string.pattern.base': 'Pincode must only contain numbers',
//     }),
//   City: Joi.string().required().messages({
//     'string.empty': 'City is required',
//   }),
//   District: Joi.string().required().messages({
//     'string.empty': 'District is required',
//   }),
//   State: Joi.string().required().messages({
//     'string.empty': 'State is required',
//   }),
//   email: Joi.string().email().required().messages({
//     'string.empty': 'Email is required',
//     'string.email': 'Invalid email format',
//   }),
//   mobileNumber: Joi.string()
//     .length(10)
//     .pattern(/^[0-9]+$/)
//     .required()
//     .messages({
//       'string.empty': 'Mobile Number is required',
//       'string.length': 'Mobile Number must be exactly 10 digits',
//       'string.pattern.base': 'Mobile Number must only contain numbers',
//     }),
//   landlineNumber: Joi.string().allow('').messages({
//     'string.empty': 'Landline Number is required',
//   }),
//   website: Joi.string().uri().required().messages({
//     'string.empty': 'Website is required',
//     'string.uri': 'Invalid URL format',
//   }),
//   gst: Joi.string()
//     .pattern(
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
//     )
//     .allow('')
//     .messages({
//       'string.pattern.base': 'Invalid GST format',
//     }),
//   isPharmacy: Joi.boolean().default(false),
//   isPrimary: Joi.string().valid('true', 'false').required().messages({
//     'any.only': 'isPrimary must be either true or false',
//     'string.empty': 'isPrimary is required',
//   }),
  
//   // ✅ Add missing fields here
//   hospitalRegistrationNumber: Joi.string().allow('').messages({
//     'string.base': 'Invalid Hospital Registration Number'
//   }),

//   branchDetails: Joi.any() // You can further validate this 
// });

// // Validation middleware
// const validateCompanySetup = (req, res, next) => {
//   // Validate body fields
//   const { error } = companySetupValidation.validate(req.body, { abortEarly: false });

//   if (error) {
//     const errorMessages = error.details.map((err) => err.message);
//     return res
//       .status(httpStatus.BAD_REQUEST)
//       .json({ message: 'Validation Error', details: errorMessages });
//   }

//   // Validate file uploads
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   const files = req.files;
//   if (files) {
//     if (files.hospitalLogo) {
//       if (!allowedMimeTypes.includes(files.hospitalLogo[0].mimetype)) {
//         return res
//           .status(httpStatus.BAD_REQUEST)
//           .json({ message: 'Invalid hospital logo file type' });
//       }
//     }
//     if (files.headerImage) {
//       if (!allowedMimeTypes.includes(files.headerImage[0].mimetype)) {
//         return res
//           .status(httpStatus.BAD_REQUEST)
//           .json({ message: 'Invalid header image file type' });
//       }
//     }
//     if (files.footerImage) {
//       if (!allowedMimeTypes.includes(files.footerImage[0].mimetype)) {
//         return res
//           .status(httpStatus.BAD_REQUEST)
//           .json({ message: 'Invalid footer image file type' });
//       }
//     }
//   }

//   next();
// };

// module.exports = {
//   validateCompanySetup,
//   companySetupValidation
// };


const Joi = require('joi');
const httpStatus = require("http-status");

// Define Joi validation schema
const companySetupValidation = Joi.object({
  hospitalName: Joi.string().required().messages({
    'string.empty': 'Hospital Name is required.',
  }),
  hospitalAddress: Joi.string().required().messages({
    'string.empty': 'Hospital Address is required.',
  }),
  Pincode: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Pincode is required.',
      'string.length': 'Pincode must be exactly 6 digits.',
      'string.pattern.base': 'Pincode must contain only numbers.',
    }),
  City: Joi.string().required().messages({
    'string.empty': 'City is required.',
  }),
  District: Joi.string().required().messages({
    'string.empty': 'District is required.',
  }),
  State: Joi.string().required().messages({
    'string.empty': 'State is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Please enter a valid email address.',
  }),
  mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Mobile Number is required.',
      'string.length': 'Mobile Number must be exactly 10 digits.',
      'string.pattern.base': 'Mobile Number must contain only numbers.',
    }),
  landlineNumber: Joi.string().allow('').messages({
    'string.empty': 'Landline Number cannot be empty.',
  }),
  website: Joi.string().uri().required().messages({
    'string.empty': 'Website is required.',
    'string.uri': 'Please enter a valid URL.',
  }),
  gst: Joi.string()
    .pattern(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
    )
    .allow('')
    .messages({
      'string.pattern.base': 'Invalid GST format. Please follow the correct 15-character format.',
    }),
  isPharmacy: Joi.boolean().default(false),
  isPrimary: Joi.string().valid('true', 'false').required().messages({
    'any.only': 'isPrimary must be either "true" or "false".',
    'string.empty': 'isPrimary field is required.',
  }),
  hospitalRegistrationNumber: Joi.string().allow('').messages({
    'string.base': 'Invalid Hospital Registration Number.',
  }),
  branchDetails: Joi.any() // Optional: Add branch details validation if needed
});

// Validation middleware
const validateCompanySetup = (req, res, next) => {
  const { error } = companySetupValidation.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({
        message: 'Validation failed. Please correct the following fields:',
        details: errorMessages
      });
  }

  // File validation
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const files = req.files;

  if (files) {
    if (files.hospitalLogo && !allowedMimeTypes.includes(files.hospitalLogo[0].mimetype)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Invalid hospital logo format. Only JPG, JPEG, or PNG files are allowed.' });
    }

    if (files.headerImage && !allowedMimeTypes.includes(files.headerImage[0].mimetype)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Invalid header image format. Only JPG, JPEG, or PNG files are allowed.' });
    }

    if (files.footerImage && !allowedMimeTypes.includes(files.footerImage[0].mimetype)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Invalid footer image format. Only JPG, JPEG, or PNG files are allowed.' });
    }
  }

  next();
};

module.exports = {
  validateCompanySetup,
  companySetupValidation
};
