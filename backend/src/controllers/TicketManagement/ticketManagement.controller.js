const { default: mongoose } = require("mongoose");
const TicketManageModel = require("../../models/TicketManagement/TicketManagement.model");

// Create a new ticket
const CreateTicketManagement = async (req, res) => {
  try {
    // Find all TicketNo for numeric part generation
    const allTicket = await TicketManageModel.find({}, { TicketNo: 1 }).lean();
    let TicketNo;
    const initials = req.body.clientName.trim().toUpperCase().substring(0, 2);
    if (allTicket.length === 0) {
      TicketNo = initials + "10001";
    } else {
      // Get numeric part from all TicketNo and find max
      const allTickets = allTicket.map((item) => item.TicketNo);
      const allNumericNumbers = allTickets
        .map((item) => parseInt(item.replace(/^\D+/, ""), 10))
        .filter((num) => !isNaN(num));
      const maxNumber = allNumericNumbers.length
        ? Math.max(...allNumericNumbers)
        : 10000;
      const nextNumber = maxNumber + 1;
      TicketNo = initials + nextNumber;
    }

    const ticket = new TicketManageModel({
      TicketNo: TicketNo,
      clientName: req.body.clientName,
      phoneNumber: req.body.phoneNumber,
      product: req.body.product,
      serviceType: req.body.serviceType,
      installDate: req.body.installDate,
      expiryDate: req.body.expiryDate,
      description: req.body.description,
      urgency: req.body.urgency,
      companyId: req.query.companyId,
      AssignTo: req.body.AssignTo,
      createdBy: req.body.createdBy,
      status: "Pending", // Set default status
    });
    const savedTicket = await ticket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// Get all tickets, populating AssignTo for user-friendly display
const GetAllTicketManagement = async (req, res) => {
  try {
    const { companyId } = req.query;
    const tickets = await TicketManageModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    }).populate(
      "AssignTo",
      "basicDetails.firstName basicDetails.lastName email"
    );
    res.status(200).json(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// Get a ticket by ID, populate AssignTo
const GetTicketByID = async (req, res) => {
  try {
    const ticket = await TicketManageModel.findById(req.params.id).populate(
      "AssignTo",
      "basicDetails.firstName basicDetails.lastName email"
    );
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

// Update a ticket, optionally add to statusHistory if status is changed
const UpdateTicket = async (req, res) => {
  try {
    const ticket = await TicketManageModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // List of fields that can be updated
    const updatableFields = [
      "clientName",
      "phoneNumber",
      "product",
      "serviceType",
      "installDate",
      "expiryDate",
      "description",
      "urgency",
      "AssignTo",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // For AssignTo, ensure we only update with the ID (if it's an object, get _id)
        if (field === "AssignTo") {
          if (
            typeof req.body.AssignTo === "object" &&
            req.body.AssignTo !== null
          ) {
            ticket.AssignTo = req.body.AssignTo._id;
          } else {
            ticket.AssignTo = req.body.AssignTo;
          }
        } else {
          ticket[field] = req.body[field];
        }
      }
    });

    // Status history logic (if status is being updated)
    if (req.body.fromStatus && req.body.toStatus && req.body.user) {
      const newHistoryEntry = {
        fromStatus: req.body.fromStatus,
        toStatus: req.body.toStatus,
        comment: req.body.comment || "",
        user: req.body.user,
        timestamp: new Date(),
      };
      ticket.status = req.body.toStatus;
      ticket.statusHistory = [...(ticket.statusHistory || []), newHistoryEntry];
    }

    const updatedTicket = await ticket.save();
    // Optionally populate AssignTo for front-end display
    const populatedTicket = await TicketManageModel.findById(
      updatedTicket._id
    ).populate(
      "AssignTo",
      "basicDetails.firstName basicDetails.lastName email"
    );
    res.status(200).json(populatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

// Delete a ticket
const DeleteTicket = async (req, res) => {
  try {
    const deletedTicket = await TicketManageModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

module.exports = {
  CreateTicketManagement,
  GetAllTicketManagement,
  GetTicketByID,
  UpdateTicket,
  DeleteTicket,
};
