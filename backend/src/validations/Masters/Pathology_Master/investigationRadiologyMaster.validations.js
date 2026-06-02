const Joi = require('joi');
const httpStatus = require("http-status");

const investigationPathologyMasterValidations = Joi.object({
    
    testName: Joi.string().required(),
    testCode : Joi.string(),
    department: Joi.string().required(),
    departmentId: Joi.string(),
    machineName: Joi.string().allow(''),
    machineId: Joi.string().allow(''),
    unit: Joi.string(),
    unitId: Joi.string(),
    specimen: Joi.string(),
    specimenId: Joi.string(),
    formula : Joi.string().allow(''),
    testType: Joi.string(),
    testDetail: Joi.array().items({
        minTestRange :Joi.string().allow(''),
        maxTestRange :Joi.string().allow(''),
        gender: Joi.string().allow(''),
        ageRange:Joi.string().allow(''),
    }),
    description : Joi.string(),
    // parameters: Joi.object().keys({
    //     thirdparameters: Joi.object(),
    // }),
});

const validateInvestigationPathologyMaster = (req, res, next) => {
    const {error} = investigationPathologyMasterValidations.validate(req.body)
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
}

module.exports = { validateInvestigationPathologyMaster }