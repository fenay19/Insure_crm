const Joi = require('joi');
const httpStatus = require("http-status")

const registerAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateAdminRegister = (req, res, next) => {
  const { error } = registerAdminSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
  }
  next();
};

const validateAdminLogin = (req, res, next) => {
  const { error } = loginAdminSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateAdminRegister,
  validateAdminLogin,
};
