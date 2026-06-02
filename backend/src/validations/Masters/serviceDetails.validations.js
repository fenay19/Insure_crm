const Joi = require("joi");
const httpStatus = require("http-status");

const serviceDetailsMasterValidation = Joi.object({
  count: Joi.number().default(0),
  // patientPayee: Joi.string().required(),
  // patientPayeeId: Joi.string(),
  // empanelment:Joi.string().allow(''),
  // payeeCategory : Joi.string(),
  // payeeCategoryId : Joi.string(),
  patientEncounter: Joi.required(),
  detailServiceName: Joi.string().required(),
  serviceGroupOrBillGroup: Joi.string(),
  serviceGroupOrBillGroupId: Joi.string().allow(""),
  serviceCode: Joi.string().required(),
  ledger: Joi.string().allow(""),
  ledgerId: Joi.string().allow(""),
  subLedger: Joi.string().allow(""),
  subLedgerId: Joi.string().allow(""),
  alternateServiceName: Joi.string().allow(""),
  department: Joi.required(),
  departmentId: Joi.required(),
  status: Joi.string().required(),
  whichService: Joi.string().allow(""),
  investigationId: Joi.string().allow(""),
  cash: Joi.number().default(0),
  CGHSnabh: Joi.number().default(0),
  CGHSnonNabh: Joi.number().default(0),
  tpa: Joi.number().default(0),
  insurance: Joi.number().default(0),
  other: Joi.number().default(0),
});

const validateserviceDetailsMaster = (req, res, next) => {
  const { error } = serviceDetailsMasterValidation.validate(req.body);
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateserviceDetailsMaster };
