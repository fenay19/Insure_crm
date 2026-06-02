const Joi = require('joi');
const httpStatus = require("http-status")
const partyMasterValidation = Joi.object({
    partyName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    contact: Joi.string().min(10).required(),
    gst: Joi.string().min(15).required(),
    pan: Joi.string().min(10).required(),
    tan: Joi.string().min(10).required(),
    bankName: Joi.string().required(),
    bankAccountNo: Joi.string().required(),
    ifsc: Joi.string().required(),
});

const validatePartyMaster = (req, res, next) => {
    const { error } = partyMasterValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validatePartyMaster };