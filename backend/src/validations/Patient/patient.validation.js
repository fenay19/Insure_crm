const Joi = require('joi');
const httpStatus = require("http-status");

const patientRegistrationSchema = Joi.object({
    user: Joi.string(),
    prefix: Joi.string().allow(''),
    prefixId: Joi.string(),
    patientname: Joi.string().allow(''),
    age: Joi.string().allow(''),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    contact: Joi.string().allow(''),
    address: Joi.string().allow(''),
    country: Joi.string().allow(''),
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
    pincode: Joi.string().allow(''),
});

function validatePatient(req, res, next) {
    const { error } = patientRegistrationSchema.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
}

module.exports = {validatePatient}
