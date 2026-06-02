const express = require("express");
const { handleToken } = require("../../utils/handleToken");
const notificationRouter = express.Router();
const {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  getNotificationsPatient
} = require("../../controllers/Notification/Notification");

notificationRouter.post("/consultant", handleToken, createNotification);
notificationRouter.get(
  "/consultant/:consultantId",
  handleToken,
  getNotifications
);
notificationRouter.get("/patient/:id", handleToken, getNotificationsPatient);
notificationRouter.put(
  "/consultant-status/:id",
  handleToken,
  updateNotificationStatus
);

module.exports = notificationRouter;
