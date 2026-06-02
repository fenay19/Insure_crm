const { model, Schema } = require("mongoose");

const visionOptionsSchema = new Schema(
  {
    vision: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: ["unaided", "corrected", "pinhole",'nearVision'],
    },
    eye: {
      type: String,
      trim: true,
      enum: ["RE", "LE"],
    },
  },
  { timestamps: true }
);

const VisionOptions = model("visionOption", visionOptionsSchema);

module.exports = VisionOptions;
