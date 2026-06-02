const Joi = require('joi');
const httpStatus = require("http-status")

// Validation schema using Joi
const departmentSetupValidations = Joi.object({
  departmentName: Joi.string().required(),
  departmentCode: Joi.string().required(),
  departmentType: Joi.string().required(),
  serviceLedger: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').required(),
  departmentFunction: Joi.object({
    isLab: Joi.boolean(),
    isPharmacy: Joi.boolean(),
    isSpeciality: Joi.boolean(),
    isRadiology: Joi.boolean(),
    Other: Joi.boolean(),
  }),
});

module.exports = departmentSetupValidations