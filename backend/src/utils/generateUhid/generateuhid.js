const UHID = require("../../models/UHID.model");

let uhidId;

const generateUHID = async (uhidNo) => {
  try {
    const newUHIDDocument = new UHID({ uhid: uhidNo });
    uhidId = await newUHIDDocument.save();
    return uhidId;
  } catch (error) {
    console.error("Error in generateUHID:", error);
    throw error;
  }
};

module.exports = generateUHID;
