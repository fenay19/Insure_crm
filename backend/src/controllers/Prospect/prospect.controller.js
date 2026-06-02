const { default: mongoose } = require("mongoose");
const { prospectModel } = require("../../models/index");
const { contactModel } = require("../../models/index");

//todo: create new propspect or company
const createProspectController = async (req, res) => {
  try {
    const notesHtml = req.body.notes;
    const plainText = notesHtml.replace(/<[^>]+>/g, "").trim();

    const {
      companyName,
      phoneNo,
      dateOfIncorporation,
      network,
      address,
      pincode,
      city,
      state,
      country,
      contacts, // optional
    } = req.body;

    const { companyId } = req.query;

    const newProspectData = {
      companyName,
      phoneNo,
      dateOfIncorporation,
      network,
      address,
      companyId,
      pincode,
      city,
      state,
      country,
      notes: plainText,
      contacts: [],
    };

    // Save prospect first (without contacts)
    const newProspect = new prospectModel(newProspectData);
    const savedProspect = await newProspect.save();

    // Now handle contacts
    if (Array.isArray(contacts) && contacts.length > 0) {
      const updatedContacts = [];

      for (let contact of contacts) {
        const createdContact = await contactModel.create({
          companyName: companyName,
          companyId: companyId,
          name: contact.name,
          email: contact.email,
          designation: contact.designation,
          phone: contact.phone,
          department: contact.dept,
        });

        updatedContacts.push({
          ...contact,
          contactId: createdContact._id,
        });
      }

      // Save contactIds into prospect
      savedProspect.contacts = updatedContacts;
      await savedProspect.save();
    }

    res.status(201).json({ status: "true", data: savedProspect });
  } catch (err) {
    console.error("❌ Error creating prospect:", err.message);
    res.status(400).json({ status: "false", error: err.message });
  }
};

// const createProspectController = async (req, res) => {
//   console.log("Incoming Prospect Data:", req.body);

//   try {
//     // Destructure all fields
//     const notesHtml=req.body.notes;
//     const plainText = notesHtml.replace(/<[^>]+>/g, '').trim();
//     const {
//       companyName,
//       phoneNo,
//       dateOfIncorporation,
//       network,
//       address,
//       pincode,
//       city,
//       state,
//       country,
//       contacts, // optional
//     } = req.body;

//     // Prepare newProspectData object
//     const newProspectData = {
//       companyName,
//       phoneNo,
//       dateOfIncorporation,
//       network,
//       address,
//       pincode,
//       city,
//       state,
//       country,
//       notes:plainText,
//       contacts, // optional
//     };
//     // Add contacts only if it's a valid array,
//     if (Array.isArray(contacts) && contacts.length > 0) {
//       newProspectData.contacts = contacts;
//     }

//     // Save to DB
//     const newProspect = new prospectModel(newProspectData);
//     const savedProspect = await newProspect.save();

//     res.status(201).json({ status: "true", data: savedProspect });
//   } catch (err) {
//     console.error("Error creating prospect:", err.message);
//     res.status(400).json({ status: "false", error: err.message });
//   }
// };

const getProspectController = async (req, res) => {
  try {
    // const prospects = await prospectModel.find();
    const { companyId } = req.query;

    // console.log("----------company", companyId);

    const prospects = await prospectModel
      .find({ companyId: new mongoose.Types.ObjectId(companyId) })
      .sort({ createdAt: -1 });

    if (!prospects || prospects.length === 0) {
      return res
        .status(404)
        .json({ status: "true", message: "No prospects data found" });
    }

    return res.status(200).json({ status: "true", data: prospects });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

const getByIdProspectController = async (req, res) => {
  console.log("getting controller");
  try {
    const prospect = await prospectModel.findById(req.params.id);
    if (!prospect) {
      return res
        .status(404)
        .json({ status: "false", message: "Prospect not found" });
    }
    res.status(200).json({ status: "true", data: prospect });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

//todo:
const updateProspectController = async (req, res) => {
  try {
    const updatedProspect = await prospectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProspect) {
      return res
        .status(404)
        .json({ status: "false", message: "Company not found" });
    }

    // Handle updating linked contacts in /api/contact
    if (req.body.contacts && Array.isArray(req.body.contacts)) {
      for (let contact of req.body.contacts) {
        if (contact.contactId) {
          await contactModel.findByIdAndUpdate(contact.contactId, {
            companyName: updatedProspect.companyName,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            designation: contact.designation,
            department: contact.dept,
          });
        }
      }
    }

    res.status(200).json({ status: "true", data: updatedProspect });
  } catch (err) {
    console.error("❌ Error updating prospect:", err);
    res.status(400).json({ status: "false", error: err.message });
  }
};

// const updateProspectController = async (req, res) => {
//   try {
//     const updatedProspect = await prospectModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedProspect) {
//       return res.status(404).json({ status: "false", message: "Company not found" });
//     }
//     res.status(200).json({ status: "true", data: updatedProspect });
//   } catch (err) {
//     console.error("❌ Error updating prospect:", err);
//     res.status(400).json({ status: "false", error: err.message });
//   }
// };

const deleteProspectController = async (req, res) => {
  try {
    const deletedProspect = await prospectModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProspect) {
      return res.status(404).json({ error: "Prospect not found" });
    }
    res.status(200).json({
      status: "true",
      message: `Prospect with id: ${req.params.id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

module.exports = {
  createProspectController,
  getProspectController,
  getByIdProspectController,
  updateProspectController,
  deleteProspectController,
};
