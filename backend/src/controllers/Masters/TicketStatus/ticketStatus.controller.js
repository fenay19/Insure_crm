const { default: mongoose } = require("mongoose");
const { ticketStatusModel } = require("../../../models/index");

const getTicketStatusController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const ticketStatuses = await ticketStatusModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!ticketStatuses || ticketStatuses.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No ticket statuses found" });
    }
    // sort data from newest to oldest
    ticketStatuses.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ status: "true", data: ticketStatuses });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching ticket statuses", error.message],
    });
  }
};

const postTicketStatusController = async (req, res) => {
  try {
    const { TicketStatus, shortForm, colorCode } = req.body;
    const { companyId } = req.query;

    if (!TicketStatus || !shortForm || !colorCode) {
      return res.status(400).json({
        status: "false",
        message: "All fields (TicketStatus, shortForm, colorCode) are required",
      });
    }

    const newTicketStatus = new ticketStatusModel({
      TicketStatus,
      shortForm,
      colorCode,
      companyId,
    });
    await newTicketStatus.save();

    res.status(201).json({ status: "true", data: newTicketStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating ticket status", error.message],
    });
  }
};

const putTicketStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const { TicketStatus, shortForm, colorCode } = req.body;

    const updatedTicketStatus = await ticketStatusModel.findByIdAndUpdate(
      id,
      { TicketStatus, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedTicketStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket status not found" });
    }

    res.status(200).json({ status: "true", data: updatedTicketStatus });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating ticket status", error.message],
    });
  }
};

const deleteTicketStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTicketStatus = await ticketStatusModel.findByIdAndDelete(id);

    if (!deleteTicketStatus) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket status not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Ticket status deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting ticket status", error.message],
    });
  }
};

module.exports = {
  getTicketStatusController,
  postTicketStatusController,
  putTicketStatusController,
  deleteTicketStatusController,
};
