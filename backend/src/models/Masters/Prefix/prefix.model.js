const mongoose = require("mongoose");

const prefixSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    prefix: {
      type: String,
      required: true,
      // unique:true
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
    versionKey: false, // You should be aware of the  to disable the __v field created by mongoose
  }
);

const Prefix = mongoose.model("Prefix", prefixSchema);

module.exports = Prefix;
