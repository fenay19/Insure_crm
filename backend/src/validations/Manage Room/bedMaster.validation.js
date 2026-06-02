const Joi = require('joi');
const httpStatus = require("http-status");

const bedMasterValidation = Joi.object({
    user:Joi.string(),
    roomType: Joi.string().required(),
    accountLedger: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive'),
});

const validateBedMaster = (req, res, next) => {
    const { error } = bedMasterValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {validateBedMaster};
