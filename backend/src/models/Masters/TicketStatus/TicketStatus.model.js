const mongoose = require("mongoose");

const ticketStatusSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    TicketStatus: { type: String, required: true },
    shortForm: { type: String, required: true },
    colorCode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ticketStatusModel = mongoose.model("ticketStatus", ticketStatusSchema);
module.exports = ticketStatusModel;
