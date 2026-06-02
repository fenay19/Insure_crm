const express = require('express');
const superAdminRouter = express.Router();
const { superAdminController } = require('../controllers/index');
const { handleToken, verifyToken} = require('../utils/handleToken'); 

superAdminRouter.get("/",handleToken,  superAdminController.getSuperAdmin); 

superAdminRouter.post('/register',  superAdminController.register);

superAdminRouter.post('/login',  superAdminController.login); 

superAdminRouter.put("/:id",handleToken, superAdminController.updateSuperAdmin);

superAdminRouter.delete("/:id", handleToken, superAdminController.deleteSuperAdmin); 

module.exports = superAdminRouter;

// optional  

// adminRouter.post(
//   '/notification',
//   [body('message').notEmpty().withMessage('Notification message is required')],
//   adminController.createOrUpdateLoginNotification
// );
// adminRouter.get('/notification', adminController.getLoginNotificationMessage);

// adminRouter.post(
//   '/subscription-notification',
//   [body('message').notEmpty().withMessage('Notification message is required')],
//   adminController.createSubscriptionNotification
// );
// adminRouter.get('/subscription-notification', adminController.getSubsNotificationMessage);


