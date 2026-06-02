const { Schema, model } = require("mongoose");

const ageGroupSchema = new Schema(
  {
    age: {
      type: String,
      trim: true,
      required: true,
    },
    group: {
      type: String,
      trim: true,
      required: true,
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

const ageGroupModel = model("Clinical-AgeGroup", ageGroupSchema);
module.exports = ageGroupModel;
