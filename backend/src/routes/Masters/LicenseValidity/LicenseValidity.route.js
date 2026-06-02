const express = require("express");
const licenseValidityRouter = express.Router();
const { licenseValidityControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

licenseValidityRouter.get(
  "/",
  licenseValidityControllers.getLicenseValidityController
);
licenseValidityRouter.post(
  "/",
  licenseValidityControllers.postLicenseValidityController
);
licenseValidityRouter.put(
  "/:id",
  licenseValidityControllers.updateLicenseValidityController
);
licenseValidityRouter.delete(
  "/:id",
  licenseValidityControllers.deleteLicenseValidityController
);

module.exports = licenseValidityRouter;
