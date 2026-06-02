const Joi = require('joi');
const httpStatus = require("http-status")

const surgeryPackageMasterValidation = Joi.object({
    SurgeryName: Joi.string().required(),
    surgeryCode: Joi.string().required(),
    surgeryType: Joi.string().required(),
    surgeryMode: Joi.string().required(),
    department:  Joi.string().allow(''),
    departmentId: Joi.string().allow(''),
    status: Joi.string().required(),
});

const validatesurgeryPackageMaster = (req, res, next) => {
    const { error } = surgeryPackageMasterValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validatesurgeryPackageMaster };