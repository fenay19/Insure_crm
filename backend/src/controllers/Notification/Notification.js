// notification.controller.js
const Notification = require("../../models/Notification/Notification");
const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
const { emitPatientApprovedRequest } = require("../../utils/socket");

const createNotification = async (req, res) => {
  try {
    const { patientId, consultantId } = req.body;
    const notification = await Notification.create(req.body);

    const updatedPatient = await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId }, // Match by custom field
      { consultantNotificationId: consultantId },
      { new: true }
    );

    const socketId = global.onlineUsers?.get(consultantId);
    if (socketId && global.io) {
      const channel = `notification-${consultantId}`;
      global.io.to(socketId).emit(channel, notification);
    }

    res.status(201).json({ notification, updatedPatient });
  } catch (error) {
    console.error("❌ Notification creation failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { consultantId } = req.params;

    if (!consultantId) {
      return res.status(400).json({ message: "Consultant ID is required" });
    }

    const notifications = await Notification.find({
      $or: [{ consultantId }, { patientId: consultantId }],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getNotificationsPatient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const notifications = await Notification.find({ patientId: id });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params; // notification ID
    if (!id) {
      return res.status(400).json({ message: "Notification ID is required." });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true, isApproved: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // 🔥 Emit to consultant
    const patientId = updatedNotification.patientId;
    const patientInfo = await OpdPatientModel.findOne({ patientId });
    console.log(patientInfo);
    emitPatientApprovedRequest(updatedNotification);

    res.status(200).json({
      message: "Notification updated successfully.",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("❌ Failed to update notification:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  getNotificationsPatient,
};
