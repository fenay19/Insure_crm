const Joi = require('joi');
const httpStatus = require("http-status")

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        role: Joi.string()
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
};
