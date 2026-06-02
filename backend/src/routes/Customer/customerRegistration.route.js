const express = require('express');
const customerRegistrationRouter = express.Router();
const upload = require('../../utils/multer');
const { customerRegistrationController } = require('../../controllers/index');  
// const { handleToken } = require('../../utils/handleToken');

// customerRegistrationRouter.get(
//   "/cardsinfo",
//   handleToken,
//   customerRegistrationController.cardsInfo
// );


customerRegistrationRouter.get(
  '/',
  customerRegistrationController.getAllCustomerRegistration
);

customerRegistrationRouter.post(
  '/',
  // handleToken,
  // upload.single('logo'),
  customerRegistrationController.createCustomerRegistration
);

module.exports = customerRegistrationRouter;