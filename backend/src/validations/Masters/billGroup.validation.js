const Joi = require('joi');
const httpStatus = require("http-status")

const billGroupValidation = Joi.object({
  user: Joi.string(),
  billGroupName: Joi.string().required(),
  billGroupCode: Joi.string().required(),
  ledger: Joi.string(),
  ledgerId: Joi.string(),
  subLedger: Joi.string(),
  subLedgerId: Joi.string(),
  description: Joi.string().allow(''),
  forAll: Joi.boolean(),
  status: Joi.string().valid('active', 'inactive'),
});

const validateBillGroup = (req, res, next) => {
    const { error } = billGroupValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {validateBillGroup}

