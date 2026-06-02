const express = require('express');
const pincodeRouter = express.Router();
const { pincodeController } = require('../controllers');
const {handleToken} = require('../utils/handleToken'); 

pincodeRouter.get('/', handleToken,pincodeController.getAllPincodes);
pincodeRouter.get('/:pincode', handleToken,pincodeController.getPincode);
pincodeRouter.post('/insert', handleToken,pincodeController.insertCountry);

module.exports = pincodeRouter