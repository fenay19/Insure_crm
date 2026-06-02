const mongoose = require("mongoose");

const referBySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: false,
    },
    referBy: {
      type: String,
      required: false,
    },
    refferName: {
        type:String,
        required: false,
    },
    refferMobile: {
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

const referBy = mongoose.model("ReferBy", referBySchema);

module.exports = referBy;
