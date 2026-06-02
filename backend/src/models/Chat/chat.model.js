const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    // users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", 
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    
  },
  {
    timestamps: true,
  }
);
const MessageModel = mongoose.model("Messages", MessageSchema);
module.exports = MessageModel;