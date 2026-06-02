const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    count:{
        type: Number,
        required: false,
        default: 0,
    },
    department: {
        type: Array,
        default: [],
    },
    genericName: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    brandName: {
        type: String,
        required: false,
    },
    dose: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    route:{
      type: String,
    },
    flag:{
      type: Boolean,
      default: false,
    },
    instruction:{
      type: String,
      required: false,
    },
    relatedDrug:{
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

const MedicinesModel = mongoose.model("medicines", medicineSchema);

module.exports = MedicinesModel;
