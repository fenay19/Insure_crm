const express = require("express");
const AdminclientRegistrationRouter = express.Router();
const upload = require("../../utils/multer");

const { AdminClientRegistration } = require("../../controllers/index");
const { handleToken } = require("../../utils/handleToken");

AdminclientRegistrationRouter.get(
  "/",
  handleToken,
  AdminClientRegistration.getAllAdminClientRegistration
);
AdminclientRegistrationRouter.get(
  "/status",
  AdminClientRegistration.getMonthlyClientCounts
);
// upload.single('logo')
AdminclientRegistrationRouter.post(
  "/",
  handleToken,
  upload.single("logo"),
  AdminClientRegistration.createAdminClientRegistration
);
// clientLogin

AdminclientRegistrationRouter.post(
  "/login",
  AdminClientRegistration.AdminclientLogin
);
// upload.single('logo')
AdminclientRegistrationRouter.put(
  "/:id",
  handleToken,
  upload.single("logo"),
  AdminClientRegistration.updateAdminClientRegistration
);
AdminclientRegistrationRouter.delete(
  "/:id",
  handleToken,
  AdminClientRegistration.deleteAdminClientRegistration
);
AdminclientRegistrationRouter.get(
  "/:id",
  handleToken,
  AdminClientRegistration.getAdminClientRegistrationById
);

module.exports = AdminclientRegistrationRouter;
