const Joi = require('joi');
const httpStatus = require("http-status");

const roomTypeValidation = Joi.object({
  user:Joi.string(),
  roomType: Joi.string().required(),
  description: Joi.string().allow(''),
  ledger: Joi.string().allow(''),
  ledgerId: Joi.string().allow(''),
  subLedger: Joi.string().allow(''),
  subLedgerId: Joi.string().allow(''),
  totalBedNo: Joi.number().allow(''),
  floorNumber: Joi.string().allow(''),
  status: Joi.string().valid('active', 'inactive'),
});

const validateRoomType = (req, res, next) => {
    const { error } = roomTypeValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {validateRoomType};
