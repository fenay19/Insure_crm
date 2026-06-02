const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: false,
    },
    
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RouteModel = mongoose.model("routeMaster", RouteSchema);

module.exports = RouteModel;
