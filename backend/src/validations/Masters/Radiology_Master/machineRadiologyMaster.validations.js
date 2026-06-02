const Joi = require('joi');
const httpStatus = require("http-status");

const machineRadiologyMasterValidations = Joi.object({
    machineName: Joi.string().required(),
    methodName: Joi.string().required(),
    department: Joi.string().required(),
    departmentId: Joi.string(),
    make: Joi.string(),
    modelNumber: Joi.string(),
    serialNumber: Joi.string()
});

const validateMachineRadiologyMaster = (req, res, next) => {
    const {error} = machineRadiologyMasterValidations.validate(req.body)
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
}

module.exports = { validateMachineRadiologyMaster }