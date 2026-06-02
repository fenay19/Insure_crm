const Joi = require('joi');
const httpStatus = require("http-status");

const addDesignationSchema = Joi.object({
    designationName: Joi.string().required(),
    designationCode: Joi.number().allow(''),
    description: Joi.string().allow(''),
    empRole: Joi.string().allow(''),
    empRoleId: Joi.string().allow(''),
    designationFunction: Joi.object({
        clinical: Joi.boolean().default(false),
        administrative: Joi.boolean().default(false),
        finance: Joi.boolean().default(false),
    }).required(),
});

const validateDesignation = (req, res, next) => {
    const { error } = addDesignationSchema.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateDesignation;
