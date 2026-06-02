const Joi = require('joi');
const httpStatus = require("http-status")

const appointmentSchedulingSchema = Joi.object({
    user: Joi.string(),
    doctorName: Joi.string().required(),
    doctorId: Joi.string().required(),
    departmentName: Joi.string().required(),
    // departmentId: Joi.string().required(),
    // startTime: Joi.string().required(),
    // endTime: Joi.string().required(),
    // timeInterval: Joi.string().required(),
    // scheduling: Joi.string().required(),
    // date: Joi.date().required(),
    status:Joi.string(),
});

const validateApointment = (req, res, next) => {
    const { error } = appointmentSchedulingSchema.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateApointment }
