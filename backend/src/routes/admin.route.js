const express = require("express");
const adminRouter = express.Router();
const { adminController } = require("../controllers");
const {
  validateAdminRegister,
  validateAdminLogin,
} = require("../validations/admin.validation");
const { handleToken } = require("../utils/handleToken");

adminRouter.get("/", adminController.getAllAdmin);

adminRouter.post(
  "/register",
  validateAdminRegister,
  adminController.registerAdmin
);

adminRouter.post("/login", validateAdminLogin, adminController.loginAdmin);

adminRouter.get("/blocked", handleToken, adminController.getBlockedAdmin);

adminRouter.put("/block", handleToken, adminController.blockAdmin);

adminRouter.put("/unblock", handleToken, adminController.unblockAdmin);

adminRouter.get("/:id", handleToken, adminController.getAdmin);

adminRouter.delete("/:id", handleToken, adminController.deleteAdmin);

adminRouter.get("/user/system-rights/:id", adminController.getSystemRights);

adminRouter.post("/auth/send-otp", adminController.verifyAndSendOtp);

adminRouter.get(
  "/fetch-user-suspension-status/:id",
  handleToken,
  adminController.fetchUserSuspensionStatus
);

adminRouter.post(
  "/update-user-suspension-status",
  handleToken,
  adminController.updateUserSuspensionStatus
);

adminRouter.get("/user-rights/:id", adminController.getSystemRightsById);

//todo: change password
adminRouter.post(
  "/change-password",
  handleToken,
  adminController.changePassword
);

adminRouter.post("/reset-password", adminController.resetPasswordWithOtp);

module.exports = adminRouter;
