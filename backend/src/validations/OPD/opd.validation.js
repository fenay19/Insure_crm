const Joi = require('joi');
const httpStatus = require("http-status")
const mongoose = require('mongoose');

const opdRegSchemaValidation = Joi.object({
    user: Joi.string().allow(''),
    tokenNumber: Joi.string().allow(''),
    opdNumber: Joi.string().allow(''),
    uhid: Joi.string().required(),
    opdRegType: Joi.string().required(),
    patientname: Joi.string().required(),
    patientId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    // patientType: Joi.string().required(),
    thirdPartyName: Joi.string().allow(''),
    govermentCompany: Joi.string().allow(''),
    cooprateCompany: Joi.string().allow(''),
    patientPayee: Joi.string().required(),
    patientPayeeId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    insuranceCompany: Joi.string().allow(''),
    department: Joi.string().required(),
    departmentId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    consultant: Joi.string().required(),
    consultantId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    speciality: Joi.string().allow(''),
    pkgType: Joi.string().allow(''),
    pkgValidity: Joi.string().allow(''),
    referBy: Joi.string().allow(''),
    refferName: Joi.string().allow(''),
    refferMobile: Joi.string().allow(''),
    marketingCommunity: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    patientIn : Joi.boolean().default(false),
    billingStatus: Joi.string().valid('Non_Paid', 'Paid', 'Partially_Paid').default('Non_Paid'),
    whoBookId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).allow(''),
    whoBookName: Joi.string().allow(''),
    confirmAppointment: Joi.boolean().default(false),
    cancelAppointment: Joi.boolean().default(false),
    status: Joi.string().valid('pending', 'out').default('pending')
});

  

module.exports = opdRegSchemaValidation;
