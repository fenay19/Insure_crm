const {
  AdminClientRegistrationModel,
  ClientRegistrationModel,
} = require("../../models/index");
const { contactModel } = require("../../models/index");
const { TypeOfClientModel } = require("../../models/index");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminModel } = require("../../models/index");
// get all client registration details
const getAllAdminClientRegistration = async (req, res) => {
  try {
    const { companyId } = req.query;

    const AdminclientRegistration = await AdminClientRegistrationModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    }).populate("contactPerson");

    console.log(
      "------------------------------------------",
      AdminclientRegistration
    );

    if (!AdminclientRegistration || AdminclientRegistration.length === 0) {
      return res.status(404).json({ message: "Client registration not found" });
    }

    // sort data from newest to oldest
    AdminclientRegistration.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // b is newer, a is older
    );

    return res
      .status(200)
      .json({ status: "true", data: AdminclientRegistration });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMonthlyClientCounts = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0=Jan

    // Determine last March
    const startYear = currentMonth >= 2 ? currentYear : currentYear - 1;
    const marchStart = new Date(startYear, 2, 1); // March 1, 00:00
    marchStart.setHours(0, 0, 0, 0);

    // Upcoming March (exclusive end)
    const marchEnd = new Date(startYear + 1, 2, 1);

    // Fetch all clients created between last March → upcoming March
    const clients = await AdminClientRegistrationModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      createdAt: { $gte: marchStart, $lt: marchEnd },
    });

    // Initialize array for 13 months
    const monthlyCounts = Array(13).fill(0);

    clients.forEach((client) => {
      const d = new Date(client.createdAt);
      const diffMonths =
        (d.getFullYear() - marchStart.getFullYear()) * 12 +
        (d.getMonth() - marchStart.getMonth());
      if (diffMonths >= 0 && diffMonths < 13) {
        monthlyCounts[diffMonths] += 1;
      }
    });

    // Month labels
    const monthLabels = [];
    for (let i = 0; i < 13; i++) {
      const date = new Date(marchStart);
      date.setMonth(marchStart.getMonth() + i);
      monthLabels.push(
        date.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }

    res.status(200).json({
      status: true,
      monthlyCounts, // [March count, April ..., next March]
      monthLabels, // ["March 2025", "April 2025", ..., "March 2026"]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdminClientRegistration = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);
    console.log("📎 Uploaded file:", req.file);

    const {
      clientName,
      officialPhoneNo,
      altPhoneNo,
      officialMailId,
      altMailId,
      emergencyContactPerson,
      emergencyContactNo,
      website,
      gstNo,
      panNo,
      officeAddress,
      pincode,
      city,
      state,

      country,
      startDate,
      endDate,
      contactPerson,
      createdBy,
    } = req.body;

    const { companyId } = req.query;

    const logo = req.file ? `/images/${req.file.filename}` : null;
    console.log("🖼️ Logo Path:", logo);

    // 📦 Validate pincode using external API
    // console.log("🌍 Validating pincode:", pincode);
    // const response = await axios.get(
    // `https://api.postalpincode.in/pincode/${pincode}`
    // );
    // const pinData = response?.data?.[0];
    // console.log("📦 Pincode API Response:", JSON.stringify(pinData, null, 2));

    // if (
    //   !pinData ||
    //   pinData.Status !== "Success" ||
    //   !pinData.PostOffice?.length
    // ) {
    //   console.warn("❌ Invalid Pincode provided:", pincode);
    //   // return res.status(400).json({ message: "Invalid Pincode" });
    // }

    // const postOfficeInfo = pinData?.PostOffice[0];
    // const validatedCity = postOfficeInfo?.District;
    // const validatedState = postOfficeInfo?.State;
    // const validatedCountry = postOfficeInfo?.Country;

    // console.log("📍 Validated location from API:", {
    //   validatedCity,
    //   validatedState,
    //   validatedCountry,
    // });

    // 🔍 Cross-check location
    // if (
    //   city.toLowerCase() !== validatedCity.toLowerCase() ||
    //   state.toLowerCase() !== validatedState.toLowerCase() ||
    //   country.toLowerCase() !== validatedCountry.toLowerCase()
    // ) {
    //   console.warn("❌ Location mismatch:", {
    //     sent: { city, state, country },
    //     expected: { validatedCity, validatedState, validatedCountry },
    //   });
    // return res.status(400).json({
    //   message: "City/State/Country doesn't match the pincode.",
    //   expected: {
    //     city: validatedCity,
    //     state: validatedState,
    //     country: validatedCountry,
    //   },
    // });
    // }

    // 📝 Create new AdminClientRegistration document
    const newAdminClientRegistration = new AdminClientRegistrationModel({
      clientName,
      officialPhoneNo,
      altPhoneNo: altPhoneNo ?? "",
      officialMailId,
      altMailId: altMailId ?? "",
      emergencyContactPerson,
      emergencyContactNo,
      website,
      gstNo,
      panNo,
      logo,
      officeAddress,
      pincode,
      city,
      companyId,
      state,
      country,
      startDate,
      endDate,
      createdBy,
      contactPerson: contactPerson?.map((person) => ({
        name: person?.name ?? "",
        department: person?.department ?? "",
        position: person?.position ?? "",
        email: person?.email ?? "",
        phone: person?.phone ?? "",
      })),
    });

    // console.log(
    //   "📝 New AdminClientRegistration object:",
    //   newAdminClientRegistration
    // );

    await newAdminClientRegistration.save();
    // console.log(
    //   "✅ AdminClientRegistration saved:",
    //   newAdminClientRegistration._id
    // );

    // Save contacts separately
    if (contactPerson?.length > 0) {
      // console.log("👥 Saving contact persons:", contactPerson.length);

      const contacts = contactPerson.map((person) => ({
        companyName: clientName,
        companyId: companyId,
        name: person?.name ?? "",
        department: person?.department ?? "",
        designation: person?.position ?? "",
        email: person?.email ?? "",
        phone: person?.phone ?? "",
      }));

      // console.log("📤 Contacts to be saved in contactModel:", contacts);

      await contactModel.create(contacts);
      // console.log("✅ Contact persons saved successfully");
    } else {
      // console.log("ℹ️ No contact persons to save.");
    }

    return res.status(201).json({
      status: true,
      message: "Client registered successfully",
      data: newAdminClientRegistration,
    });
  } catch (error) {
    console.error("🔥 Error in createAdminClientRegistration:", error);
    return res.status(500).json({
      message: "Server error while registering client.",
      error: error.message,
    });
  }
};

// client login
const AdminclientLogin = async (req, res) => {
  try {
    const values = req.body;
    const officialMailId = values.email;
    const officialPhoneNo = values.password;
    if (!officialMailId || !officialPhoneNo) {
      return res
        .status(400)
        .json({ message: "Email and phone number required" });
    }

    const client = await AdminClientRegistrationModel.findOne({
      officialMailId,
    });
    if (!client) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (client.officialPhoneNo !== officialPhoneNo) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optionally, generate a JWT token here for session management
    const token = jwt.sign(
      { id: client._id, email: client.officialMailId },
      "Bearar"
    );

    return res.status(200).json({
      status: "true",
      message: "Login successful",
      token, // Uncomment if using JWT
      role: client.role,
      client,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
};

const updateAdminClientRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      officialPhoneNo,
      altPhoneNo,
      officialMailId,
      altMailId,
      emergencyContactPerson,
      emergencyContactNo,
      website,
      gstNo,
      panNo,
      logo,
      officeAddress,
      pincode,
      city,
      state,
      country,
      startDate,
      endDate,
      contactPerson,
      locations,
    } = req.body;

    const updatedAdminClientRegistration =
      await AdminClientRegistrationModel.findByIdAndUpdate(
        id,
        {
          clientName,
          officialPhoneNo,
          altPhoneNo,
          officialMailId,
          altMailId,
          emergencyContactPerson,
          emergencyContactNo,
          website,
          gstNo,
          panNo,
          logo,
          officeAddress,
          pincode,
          city,
          state,
          country,
          startDate,
          endDate,
          contactPerson: contactPerson?.map((person) => ({
            name: person?.name ?? "",
            department: person?.department ?? "",
            position: person?.position ?? "",
            email: person?.email ?? "",
            phone: person?.phone ?? "",
          })),
          locations: {
            exportCenter: Array.isArray(locations?.exportCenter)
              ? locations.exportCenter
              : [],
            factories: Array.isArray(locations?.factories)
              ? locations.factories
              : [],
            warehouse: Array.isArray(locations?.warehouse)
              ? locations.warehouse
              : [],
            branches: Array.isArray(locations?.branches)
              ? locations.branches
              : [],
          },
        },
        { new: true, runValidators: true }
      );

    res.status(200).json({
      success: true,
      message: "Client registration updated successfully",
      data: updatedAdminClientRegistration,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update client registration",
      error: error.message,
    });
  }
};

// delete client registration
const deleteAdminClientRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdminClientRegistration =
      await AdminClientRegistrationModel.findByIdAndDelete(id);

    if (!deletedAdminClientRegistration) {
      return res.status(404).json({ message: "Client registration not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Client registration deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error deleting client registration" });
  }
};

// get client registration by id
const getAdminClientRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const AdminclientRegistration = await AdminClientRegistrationModel.findById(
      id
    )
      .populate("locations.exportCenter")
      .populate("locations.factories")
      .populate("locations.warehouse")
      .populate("locations.branches");

    if (!AdminclientRegistration) {
      return res.status(404).json({ message: "Client registration not found" });
    }

    return res
      .status(200)
      .json({ status: "true", data: AdminclientRegistration });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error fetching client registration" });
  }
};

module.exports = {
  getAllAdminClientRegistration,
  createAdminClientRegistration,
  AdminclientLogin,
  updateAdminClientRegistration,
  deleteAdminClientRegistration,
  getAdminClientRegistrationById,
  getMonthlyClientCounts,
};
