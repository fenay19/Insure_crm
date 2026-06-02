const Joi = require('joi');
const httpStatus = require("http-status")
const productMasterValidation = Joi.object({
    productName: Joi.string().required(),
    brandName: Joi.string().required(),
    productId:Joi.string().required(),
    sku: Joi.string().required(),
    hsn: Joi.string().required(),
    unit: Joi.string().required(),
    category: Joi.string().required(),
    store: Joi.string().required(),
    productType: Joi.string().required(),
    party: Joi.string(),
    partyId: Joi.string(),
    purchase: Joi.string().required(),
    sales: Joi.string().required(),
    consumption: Joi.string().required(),
    purchaseGST: Joi.string().required(),
    salesGST: Joi.string().required(),
    genericName: Joi.string().required(),
    sheduledDrug: Joi.string().required()
});

const validateProductMaster = (req, res, next) => {
    const { error } = productMasterValidation.validate(req.body);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateProductMaster };