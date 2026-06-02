const { Notification } = require("../models");
const { firebase } = require("../config/firebase");
require("firebase/auth");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendOtpToUser = async (phoneNumber) => {
  const provider = new firebase.auth.PhoneAuthProvider();
  provider.verifyPhoneNumber(phoneNumber);

  return true;
};

const sendNotification = async (userId, message) => {
  const addNotification = await Notification.create({
    userId,
    notification: message,
  });

  return addNotification;
};

module.exports = {
  generateOTP,
  sendOtpToUser,
  sendNotification,
};
