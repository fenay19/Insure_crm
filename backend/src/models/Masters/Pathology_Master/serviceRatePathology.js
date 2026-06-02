const mongoose = require("mongoose");
const serviceRatePathologySchema = new mongoose.Schema({
  newCode: {
    type: String,
  },
  rate: {
    type: String,
  },
  category: {
    type: String,
  },
  pathologyId: {
    type: mongoose.Types.ObjectId,
    ref: "InvestigationPathologyMaster",
  },
});

const ServiceRatePathologyModel = mongoose.model(
  "serviceRatePathologySchema",
  serviceRatePathologySchema
);
module.exports = ServiceRatePathologyModel;
