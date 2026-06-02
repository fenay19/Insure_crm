const Joi = require('joi');
const httpStatus = require("http-status")

const prefixMasterValidation = Joi.object({
    prefix: Joi.string().required(),
  })
const validatePrefixMaster = (req, res, next) => {
    const { error } = prefixMasterValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validatePrefixMaster };