const express = require('express');
const insCompanyRouter = express.Router();
const { insCompanyControllers } = require("../../../controllers/index")
const { handleToken } = require("../../../utils/handleToken");  

insCompanyRouter.get('/', insCompanyControllers.getInsCompanyController);
insCompanyRouter.post('/', insCompanyControllers.postInsCompanyController);
insCompanyRouter.put('/:id', insCompanyControllers.putInsCompanyController)
insCompanyRouter.delete('/:id', insCompanyControllers.deleteInsCompanyController)


module.exports = insCompanyRouter