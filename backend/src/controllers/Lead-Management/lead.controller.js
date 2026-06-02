const mongoose = require("mongoose");
const { leadModel } = require("../../models/index");
const { prospectModel } = require("../../models/index");
const { contactModel } = require("../../models/index");
const { leadReferenceModel } = require("../../models/index");
const { ProductOrServiceCategorymodel } = require("../../models/index");
const { leadStatusModel } = require("../../models/index");
const { leadTypeModel } = require("../../models/index");
const moment = require("moment");

const createLeadController = async (req, res) => {
  try {
    // Sanitize reference fields
    [
      "Prospect",
      "Client",
      "reference",
      "productService",
      "leadstatus",
      "leadType",
      "assignTo",
    ].forEach((key) => {
      if (!req.body[key] || req.body[key] === "") req.body[key] = undefined;
    });

    const { companyId } = req.query;

    // Destructure fields, including newCompanyName for newLead case
    let {
      Prospect,
      Client,
      newCompanyName,
      // firstName,
      // middleName,
      // lastName,
      // gender,
      countryCode,
      phoneNo,
      altPhoneNo,
      email,
      altEmail,
      notes,
      address,
      pincode,
      city,
      state,
      country,
      reference,
      productService,
      leadstatus,
      leadType,
      projectValue,
      assignTo,
      contact = [],
      followups = [],
      leadCategory,
      companyName,
    } = req.body;

    // Validation: required fields
    const requiredFields = [
      // "firstName",
      // "lastName",
      // "gender",
      // "countryCode",
      "phoneNo",
      // "email",
      // "address",
      // "pincode",
      // "city",
      // "state",
      // "country",
      // "reference",
      // "productService",
      // "leadstatus",
      // "leadType",
      // "assignTo",
      // "projectValue",
    ];

    if (leadCategory === "newLead") {
      if (!newCompanyName || newCompanyName.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "newCompanyName is required for new leads.",
        });
      }
    } else if (leadCategory === "prospect") {
      if (!Prospect) {
        return res.status(400).json({
          success: false,
          error: "Prospect is required for prospect leads.",
        });
      }
    } else if (leadCategory === "client") {
      if (!Client) {
        return res.status(400).json({
          success: false,
          error: "Client is required for client leads.",
        });
      }
    }

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ success: false, error: `${field} is required.` });
      }
    }

    // Prepare lead data
    const leadData = {
      Prospect: leadCategory === "prospect" ? Prospect : undefined,
      Client: leadCategory === "client" ? Client : undefined,
      newCompanyName: leadCategory === "newLead" ? newCompanyName : undefined,
      companyName,
      // firstName,
      // middleName,
      // lastName,
      // gender,
      countryCode,
      companyId,
      phoneNo,
      altPhoneNo,
      email,
      altEmail,
      notes,
      address,
      pincode,
      city,
      state,
      country,
      reference,
      productService,
      leadstatus,
      leadType,
      projectValue,
      assignTo,
      contact,
      followups,
      leadCategory,
    };

    const newLead = new leadModel(leadData);
    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: savedLead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getLeadController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { empId } = req.params;

    // console.log(empId);

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid companyId is required" });
    }

    // base filter
    let filter = { companyId: new mongoose.Types.ObjectId(companyId) };

    // empId param (optional)
    if (empId && mongoose.Types.ObjectId.isValid(empId)) {
      filter.assignTo = new mongoose.Types.ObjectId(empId);
    }

    const leads = await leadModel
      .find(filter)
      .populate("Prospect", "companyName")
      .populate("Client")
      .populate("reference", "LeadReference")
      .populate("productService", "subProductName")
      .populate("leadstatus")
      .populate("leadType", "LeadType")
      .populate(
        "assignTo",
        "basicDetails.firstName basicDetails.lastName basicDetails.email"
      );

    res.status(200).json({
      success: true,
      total: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getLeadStatusChartData = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { empId } = req.params;

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid companyId is required" });
    }
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Base filter
    let filter = {
      companyId: new mongoose.Types.ObjectId(companyId),
      // createdAt: {
      //   $gte: startOfMonth,
      //   $lt: endOfMonth,
      // },
    };

    // Optional employee filter
    if (empId && mongoose.Types.ObjectId.isValid(empId)) {
      filter.assignTo = new mongoose.Types.ObjectId(empId);
    }

    // Fetch all leads with populated leadstatus
    const leads = await leadModel
      .find(filter)
      .populate("leadstatus")
      .populate("reference", "LeadReference"); // populate only needed fields

    // Aggregate status counts
    const statusMap = {};
    const rstatusMap = {};
    leads.forEach((lead) => {
      if (lead.reference) {
        const { LeadReference, _id } = lead.reference;
        if (!rstatusMap[_id]) {
          rstatusMap[_id] = {
            rname: LeadReference,
            rcount: 0,
          };
        }
        rstatusMap[_id].rcount += 1;
      }
      if (lead.leadstatus) {
        const { LeadStatus, colorCode, _id } = lead.leadstatus;
        if (!statusMap[_id]) {
          statusMap[_id] = {
            name: LeadStatus,
            color: colorCode,
            count: 0,
          };
        }
        statusMap[_id].count += 1;
      }
    });

    // Prepare arrays
    const labels = Object.values(statusMap).map((s) => s.name);
    const rlabels = Object.values(rstatusMap).map((s) => s.rname);
    const colors = Object.values(statusMap).map((s) => s.color);
    const counts = Object.values(statusMap).map((s) => s.count);
    const rcounts = Object.values(rstatusMap).map((s) => s.rcount);

    res.status(200).json({
      success: true,
      labels,
      rlabels,
      colors,
      counts,
      rcounts,
    });
  } catch (error) {
    console.error("Get Lead Status Chart Data Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getLeadControllerById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await leadModel
      .findById(id)
      .populate("Prospect", "companyName")
      .populate("reference", "LeadReference")
      .populate("productService", "productName")
      .populate("leadstatus", "LeadStatus") // <-- fixed field name
      .populate("leadType", "LeadType")
      .populate(
        "assignTo",
        "basicDetails.firstName basicDetails.lastName basicDetails.email"
      );

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get Lead Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// update lead data
const updateLeadController = async (req, res) => {
  try {
    const leadId = req.params.id;
    let updateData = { ...req.body };

    if (!leadId || !mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: "Valid Lead ID is required" });
    }

    // Clean reference fields: remove or set to undefined if falsy or empty string.
    [
      "Prospect",
      "Client",
      "reference",
      "productService",
      "leadstatus",
      "leadType",
      "assignTo",
    ].forEach((key) => {
      if (
        updateData.hasOwnProperty(key) &&
        (!updateData[key] || updateData[key] === "")
      ) {
        updateData[key] = undefined;
      }
    });

    // Update only provided fields; $set ensures only changed fields are updated.
    const updatedLead = await leadModel
      .findByIdAndUpdate(
        leadId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .populate("Prospect", "companyName")
      .populate("Client", "companyName clientName")
      .populate("reference", "LeadReference")
      .populate("productService", "productName")
      .populate("leadstatus", "LeadStatus colorCode")
      .populate("leadType", "LeadType")
      .populate(
        "assignTo",
        "basicDetails.firstName basicDetails.lastName basicDetails.email"
      );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating lead",
      error: error.message,
    });
  }
};

const deleteLeadController = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await leadModel.findByIdAndDelete(id);

    if (!lead) {
      return res
        .status(404)
        .json({ status: false, message: "Error while deleting lead by id" });
    }

    return res
      .status(200)
      .json({ status: true, message: `Lead data deleted ${id}` });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting lead",
      error: error.message,
    });
  }
};

const createFollowUpController = async (req, res) => {
  const { leadId, followupDate, followupTime, leadstatus, comment } = req.body;

  try {
    const lead = await leadModel.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // create follow-up
    const newFollowUp = { followupDate, followupTime, leadstatus, comment };
    lead.followups.push(newFollowUp);

    // update main lead status too
    lead.leadstatus = leadstatus;

    await lead.save();

    res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      data: lead.followups,
    });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({ message: "Failed to add follow-up" });
  }
};

// Get all follow-ups for all leads (flattened)
const getFollowUpController = async (req, res) => {
  try {
    const leads = await leadModel.find({}, "followups");
    const allFollowups = leads.flatMap((lead) =>
      (lead.followups || []).map((f) => ({
        ...f.toObject(),
        leadId: lead._id,
      }))
    );
    res.status(200).json({ success: true, data: allFollowups });
  } catch (err) {
    console.error("Error fetching follow-ups:", err);
    res.status(500).json({ message: "Failed to fetch follow-ups" });
  }
};

// Get follow-ups for a specific lead by leadId
const getFollowUpByLeadIdController = async (req, res) => {
  const { leadId } = req.params;

  try {
    const lead = await leadModel.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ success: true, data: lead.followups || [] });
  } catch (error) {
    console.error("Error fetching follow-ups by lead:", error);
    res.status(500).json({ message: "Failed to get follow-ups" });
  }
};

// Update a follow-up by its _id
const updateFollowUpController = async (req, res) => {
  const followUpId = req.params.id;
  const { followupDate, followupTime, leadstatus, comment } = req.body;

  try {
    const lead = await leadModel.findOne({ "followups._id": followUpId });
    if (!lead) return res.status(404).json({ message: "Follow-up not found" });

    const followUp = lead.followups.id(followUpId);
    if (!followUp)
      return res.status(404).json({ message: "Follow-up not found in array" });

    if (followupDate !== undefined) followUp.followupDate = followupDate;
    if (followupTime !== undefined) followUp.followupTime = followupTime;
    if (leadstatus !== undefined) followUp.leadstatus = leadstatus;
    if (comment !== undefined) followUp.comment = comment.trim();

    await lead.save();
    res
      .status(200)
      .json({ success: true, message: "Follow-up updated", data: followUp });
  } catch (err) {
    console.error("Error updating follow-up:", err);
    res.status(500).json({ message: "Failed to update follow-up" });
  }
};

// Delete a follow-up by its _id
const deleteFollowUpController = async (req, res) => {
  const followUpId = req.params.id;

  try {
    const lead = await leadModel.findOne({ "followups._id": followUpId });
    if (!lead) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    lead.followups = lead.followups.filter(
      (f) => f._id.toString() !== followUpId
    );
    await lead.save();

    res
      .status(200)
      .json({ success: true, message: "Follow-up deleted successfully" });
  } catch (err) {
    console.error("Error deleting follow-up:", err);
    res.status(500).json({ message: "Failed to delete follow-up" });
  }
};

const getDailyLeadsChartData = async (req, res) => {
  try {
    const { month, year } = req.body;
    const { companyId } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ success: false, message: "companyId is required" });
    }

    const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    // Convert companyId string to ObjectId
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Aggregate leads for selected month
    const leads = await leadModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalLeads: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Prepare chart data with all days in the month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const chartData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const record = leads.find((l) => l._id === day);
      return { day, totalLeads: record ? record.totalLeads : 0 };
    });

    // Prepare dropdown months (only months with leads for this company)
    const months = await leadModel.aggregate([
      { $match: { companyId: companyObjectId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const monthList = months.map((m) => ({
      label: `${moment()
        .month(m._id.month - 1)
        .format("MMMM")} ${m._id.year}`,
      value: { month: m._id.month, year: m._id.year },
    }));

    res.status(200).json({ success: true, chartData, months: monthList });
  } catch (error) {
    console.error("Error in getDailyLeadsChartData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyLeadsChartData = async (req, res) => {
  try {
    const { year } = req.body;
    const { companyId } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ success: false, message: "companyId is required" });
    }

    const selectedYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Aggregate leads for each month of the year
    const leads = await leadModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalLeads: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Prepare chart data for all 12 months
    const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const record = leads.find((l) => l._id.month === monthNum);
      return record ? record.totalLeads : 0;
    });

    res.status(200).json({
      success: true,
      chartData,
    });
  } catch (error) {
    console.error("Error in getMonthlyLeadsChartData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductLeadsMonths = async (req, res) => {
  try {
    const { companyId } = req.query;
    if (!companyId) {
      return res
        .status(400)
        .json({ success: false, message: "companyId is required" });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const months = await leadModel.aggregate([
      { $match: { companyId: companyObjectId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const monthList = months.map((m) => ({
      label: `${moment()
        .month(m._id.month - 1)
        .format("MMMM")} ${m._id.year}`,
      value: { month: m._id.month, year: m._id.year },
    }));

    res.status(200).json({ success: true, months: monthList });
  } catch (error) {
    console.error("Error in getProductLeadsMonths:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductLeads = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("Query params:", req.query);

    const { month, year } = req.body;
    const { companyId } = req.query;

    if (!companyId) {
      console.error("companyId is missing");
      return res
        .status(400)
        .json({ success: false, message: "companyId is required" });
    }

    const selectedMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();
    // console.log(
    // "Selected Month:",
    // selectedMonth,
    // "Selected Year:",
    // selectedYear
    // );

    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    // console.log("Company ObjectId:", companyObjectId);

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
    // console.log("Start Date:", startDate, "End Date:", endDate);

    // Aggregate leads with productService populated
    const leads = await leadModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "subproductcategories", // collection name for SubProductCategory
          localField: "productService",
          foreignField: "_id",
          as: "productServiceData",
        },
      },
      {
        $unwind: {
          path: "$productServiceData",
          preserveNullAndEmptyArrays: false, // only include leads with productService
        },
      },
      {
        $group: {
          _id: "$productServiceData.subProductName",
          totalLeads: { $sum: 1 },
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    // console.log("Aggregated leads:", leads);

    // Sample leads for debugging
    const sampleLeads = await leadModel
      .find({
        companyId: companyObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("productService", "subProductName");

    // console.log("Sample leads with productService:", sampleLeads);

    const subProducts = leads.map((l) => l._id);
    const leadsCount = leads.map((l) => l.totalLeads);
    // console.log("SubProducts:", subProducts);
    // console.log("LeadsCount:", leadsCount);

    const monthLabel = `${moment()
      .month(selectedMonth - 1)
      .format("MMMM")} ${selectedYear}`;
    // console.log("Month Label:", monthLabel);

    res
      .status(200)
      .json({ success: true, monthLabel, subProducts, leadsCount });
  } catch (error) {
    console.error("Error in getProductLeads:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const leadBan = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    // Check if status is valid
    if (!["LS", "LW"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'LS' or 'LW'.",
      });
    }

    // Find and update the lead
    const updatedLead = await leadModel.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Lead status updated to "${status}".`,
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error in leadBan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ GET reference-wise leads count
const getReferenceWiseLeads = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { month } = req.body;

    console.log("📩 Incoming request for Reference-wise Leads");
    console.log("➡️ Query Params:", { companyId, month });

    if (!companyId) {
      console.warn("⚠️ Missing companyId in query");
      return res
        .status(400)
        .json({ success: false, message: "companyId is required" });
    }

    // ✅ Map month names to numeric index
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    // ✅ Apply date filter if month is provided
    let dateFilter = {};
    if (month && monthMap[month] !== undefined) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, monthMap[month], 1);
      const endDate = new Date(year, monthMap[month] + 1, 1);
      dateFilter = { createdAt: { $gte: startDate, $lt: endDate } };

      console.log("📅 Date Filter Applied:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } else if (month) {
      console.warn("⚠️ Invalid month provided:", month);
    } else {
      console.log("📅 No month filter applied (fetching all data)");
    }

    // ✅ Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$reference",
          totalLeads: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "leadreferences",
          localField: "_id",
          foreignField: "_id",
          as: "referenceDetails",
        },
      },
      {
        $unwind: {
          path: "$referenceDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          referenceName: {
            $ifNull: ["$referenceDetails.LeadReference", "Unspecified"],
          },
          totalLeads: 1,
        },
      },
    ];

    console.log("🧩 Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    // ✅ Execute aggregation
    const data = await leadModel.aggregate(pipeline);

    console.log(`✅ Found ${data.length} reference-wise lead records`);
    console.log(data);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching reference-wise leads:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getLeadWonLostChartData = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { empId } = req.params;

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid companyId is required" });
    }

    // Base filter
    const filter = {
      companyId: new mongoose.Types.ObjectId(companyId),
      status: { $in: ["LW", "LS"] },
    };

    // Optional: employee filter
    if (empId && mongoose.Types.ObjectId.isValid(empId)) {
      filter.assignTo = new mongoose.Types.ObjectId(empId);
    }

    // Get current date and calculate the last 12 months range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    filter.updatedAt = { $gte: startDate, $lte: endDate };

    // Aggregate by month
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ];

    const results = await leadModel.aggregate(pipeline);

    // Create month labels (last 12 months)
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(
        d.toLocaleString("default", { month: "short", year: "2-digit" })
      );
    }

    // Initialize counts
    const wonCounts = new Array(12).fill(0);
    const lostCounts = new Array(12).fill(0);

    results.forEach((item) => {
      const { year, month, status } = item._id;
      const monthLabel = new Date(year, month - 1, 1).toLocaleString(
        "default",
        {
          month: "short",
          year: "2-digit",
        }
      );

      const index = months.indexOf(monthLabel);
      if (index !== -1) {
        if (status === "LW") wonCounts[index] += item.count;
        if (status === "LS") lostCounts[index] += item.count;
      }
    });

    res.status(200).json({
      success: true,
      labels: months,
      datasets: [
        { label: "Leads Won", data: wonCounts, color: "#4CAF50" },
        { label: "Leads Lost", data: lostCounts, color: "#F44336" },
      ],
    });
  } catch (error) {
    console.error("Get Lead Won/Lost Chart Data Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createLeadController,
  getLeadController,
  updateLeadController,
  deleteLeadController,
  createFollowUpController,
  getFollowUpController,
  getFollowUpByLeadIdController,
  updateFollowUpController,
  getLeadStatusChartData,
  deleteFollowUpController,
  getLeadControllerById,
  getDailyLeadsChartData,
  getMonthlyLeadsChartData,
  getProductLeads,
  getProductLeadsMonths,
  leadBan,
  getReferenceWiseLeads,
  getLeadWonLostChartData,
};
