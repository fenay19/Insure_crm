const Joi = require('joi');
const httpStatus = require("http-status");

const investigationRadiologyMasterValidations = Joi.object({
    department: Joi.string().required(),
    departmentId: Joi.string(),
    testName: Joi.string().required(),
    machineName: Joi.string().allow(''),
    machineId: Joi.string().allow(''),
    testType: Joi.string(),
    testRange: Joi.string(),
    description: Joi.array()
});

const validateInvestigationRadiologyMaster = (req, res, next) => {
    const {error} = investigationRadiologyMasterValidations.validate(req.body)
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
}

module.exports = { validateInvestigationRadiologyMaster }