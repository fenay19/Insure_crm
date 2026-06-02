const { InvoiceModel } = require("../../models/index");
const mongoose = require("mongoose");
const axios = require("axios");
const { calculateInvoiceTotals } = require("./calculateInvoice");
const AdminModel = require("../../models/admin.model");

const createInvoice = async (req, res) => {
  try {
    const {
      gstType,
      clientId,
      clientName,
      RecieptNo,
      invoiceNumber,
      date,
      clientGst,
      clientEmail,
      clientAddress,
      clientPincode,
      clientState,
      clientCity,
      clientCountry,
      products,
      subTotal,
      discount,
      discountType,
      discountAmount,
      totalAmount,
      roundUp,
      igstPercent,
      igstAmount,
      cgstIgstPercentage,
      cgstIgstAmount,
      sgstPercentage,
      sgstAmount,
      selectedBankId,
    } = req.body;

    const { companyId } = req.query;

    console.log("invoice daata is", req.body);

    // Validate required fields
    if (
      !gstType ||
      !clientName ||
      !RecieptNo ||
      !invoiceNumber ||
      !date ||
      !clientEmail ||
      !clientAddress ||
      !clientPincode ||
      !clientState ||
      !clientCity ||
      !clientCountry ||
      !products ||
      !subTotal ||
      !totalAmount ||
      !selectedBankId ||
      !companyId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const isInvoiceNumberExists = await InvoiceModel.findOne({
      invoiceNumber: invoiceNumber,
      companyId: companyId,
    });

    if (isInvoiceNumberExists) {
      return res
        .status(400)
        .json({ message: "Invoice number must be unique", status: false });
    }
    const newInvoice = new InvoiceModel({
      gstType,
      clientId,
      clientName,
      RecieptNo,
      invoiceNumber,
      date,
      clientGst,
      clientEmail,
      clientAddress,
      clientPincode,
      clientState,
      clientCity,
      clientCountry,
      products,
      subTotal,
      discount,
      discountType,
      discountAmount,
      totalAmount,
      roundUp,
      igstPercent,
      companyId,
      igstAmount,
      cgstIgstPercentage,
      cgstIgstAmount,
      sgstPercentage,
      sgstAmount,
      selectedBankId,
    });

    const savedInvoice = await newInvoice.save();
    console.log("saved invoice data is", savedInvoice);
    res.status(200).json({
      message: "Invoice created successfully",
      status: true,
      data: savedInvoice,
    });
  } catch (error) {
    console.error("Create Invoice Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllInvoice = async (req, res) => {
  try {
    const { companyId } = req.query;
    const invoices = await InvoiceModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    }).populate({
      path: "selectedBankId",
      model: "BankDetails",
    });
    res.status(200).json({
      message: "Invoices fetched successfully",
      status: true,
      invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({
      message: "Invoice deleted successfully",
      status: true,
      deletedInvoice,
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Error deleting invoice", error });
  }
};
const getInvoiceById = async (req, res) => {
  try {
    console.log("getInvoiceById called with params:", req.params);
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }
    const invoice = await InvoiceModel.findById(id).populate({
      path: "selectedBankId",
      model: "BankDetails",
    });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res
      .status(200)
      .json({ message: "Invoice fetched successfully", status: true, invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Error fetching invoice", error });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Invoice ID to update:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid invoice ID:", id);
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const {
      clientId,
      clientName,
      invoiceNumber,
      date,
      clientGst,
      clientEmail,
      clientAddress,
      clientPincode,
      clientState,
      clientCity,
      clientCountry,
      products,
      subTotal,
      discount,
      discountType,
      discountAmount,
      totalAmount,
      roundUp,
      igstPercent,
      igstAmount,
      cgstIgstPercentage,
      cgstIgstAmount,
      sgstPercentage,
      sgstAmount,
      selectedBankId,
      paymentDetails,
    } = req.body;

    console.log("Request body:", req.body);

    const updateData = {
      clientId,
      clientName,
      invoiceNumber,
      date,
      clientGst,
      clientEmail,
      clientAddress,
      clientPincode,
      clientState,
      clientCity,
      clientCountry,
      products,
      subTotal,
      discount,
      discountType,
      discountAmount,
      totalAmount,
      roundUp,
      igstPercent,
      igstAmount,
      cgstIgstPercentage,
      cgstIgstAmount,
      sgstPercentage,
      sgstAmount,
      selectedBankId,
    };

    let updatedInvoice;

    if (paymentDetails && typeof paymentDetails === "object") {
      console.log("Updating invoice with payment details:", paymentDetails);

      const normalizedPayment = {
        ...paymentDetails,
        paidAmount: Number(paymentDetails.paidAmount) || 0,
      };
      console.log("Normalized payment details:", normalizedPayment);

      updatedInvoice = await InvoiceModel.findByIdAndUpdate(
        id,
        {
          $push: { history: normalizedPayment },
          $set: { paymentDetails: normalizedPayment },
        },
        { new: true }
      );

      if (!updatedInvoice) {
        console.log("Invoice not found after payment update:", id);
        return res.status(404).json({ message: "Invoice not found" });
      }

      const totalPaid = updatedInvoice.history.reduce(
        (sum, p) => sum + Number(p.paidAmount || 0),
        0
      );
      console.log("Total paid so far:", totalPaid);

      const roundValue = Number(updatedInvoice.roundUp) || 0;
      console.log("Invoice roundUp value:", roundValue);

      let newStatus = "unpaid";
      const totalPaidFixed = Number(totalPaid.toFixed(2));
      const roundValueFixed = Number(roundValue.toFixed(2));

      if (totalPaidFixed >= roundValueFixed && roundValueFixed > 0) {
        newStatus = "paid";
      } else if (totalPaidFixed > 0 && totalPaidFixed < roundValueFixed) {
        newStatus = "pending";
      }
      console.log("Calculated new invoice status:", newStatus);

      updatedInvoice.totalPaidAmount = totalPaid;
      updatedInvoice.status = newStatus;

      await updatedInvoice.save();
      console.log("Updated invoice after payment save:", updatedInvoice);
    } else {
      console.log("Updating invoice without payment details");
      updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      console.log("Updated invoice:", updatedInvoice);
    }

    if (!updatedInvoice) {
      console.log("Invoice not found at final check:", id);
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      status: true,
      updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Error updating invoice", error });
  }
};

const getMonthlyInvoiceSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    // ✅ Current month summary (paid/pending/unpaid)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const invoices = await InvoiceModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      // date: {
      // $gte: startOfMonth,
      // $lt: endOfMonth,
      // },
    });

    const summary = {
      paid: 0,
      pending: 0,
      unpaid: 0,
    };

    invoices.forEach((invoice) => {
      if (invoice.status === "paid") summary.paid++;
      else if (invoice.status === "pending") summary.pending++;
      else if (invoice.status === "unpaid") summary.unpaid++;
    });

    // ✅ Yearly (April → March, 12 months)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Last April
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const aprilStart = new Date(startYear, 3, 1);
    aprilStart.setHours(0, 0, 0, 0);

    // Upcoming April (exclusive end)
    const aprilEnd = new Date(startYear + 1, 3, 1);

    // Fetch invoices from last April → upcoming March
    const yearInvoices = await InvoiceModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      date: { $gte: aprilStart, $lt: aprilEnd },
    });

    // Initialize arrays
    const monthlyTotals = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);
    const monthlyPaidTotals = Array(12).fill(0); // ✅ New array

    console.log(yearInvoices);

    yearInvoices.forEach((invoice) => {
      const d = new Date(invoice.date);
      const diffMonths =
        (d.getFullYear() - aprilStart.getFullYear()) * 12 +
        (d.getMonth() - aprilStart.getMonth());

      if (diffMonths >= 0 && diffMonths < 12) {
        monthlyTotals[diffMonths] += invoice.totalAmount || 0;
        monthlyCounts[diffMonths] += 1;

        // ✅ Add paid amount if status is "paid"
        // if (invoice.status === "paid") {
        monthlyPaidTotals[diffMonths] += invoice.totalPaidAmount || 0;
        // }
      }
    });

    // ✅ Month labels for frontend mapping
    const monthLabels = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(aprilStart);
      date.setMonth(aprilStart.getMonth() + i);
      monthLabels.push(
        date.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }

    res.status(200).json({
      message: "Monthly invoice summary fetched successfully",
      status: true,
      summary,
      monthlyTotals, // total invoice amounts per month
      monthlyCounts, // number of invoices per month
      monthlyPaidTotals, // ✅ total paid amounts per month
      monthLabels, // ["April 2025", ..., "March 2026"]
    });
  } catch (error) {
    console.error("Error fetching monthly invoice summary:", error);
    res.status(500).json({
      message: "Error fetching monthly invoice summary",
      error: error.message,
    });
  }
};

const deleteInvoiceHistory = async (req, res) => {
  try {
    const { invoiceId, historyId } = req.params;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(invoiceId) ||
      !mongoose.Types.ObjectId.isValid(historyId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid invoiceId or historyId" });
    }

    // Pull the history item from the array
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      invoiceId,
      { $pull: { history: { _id: historyId } } },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Recalculate totalPaidAmount
    const totalPaid = updatedInvoice.history.reduce(
      (sum, h) => sum + (Number(h.paidAmount) || 0),
      0
    );

    // Update totalPaidAmount and status
    let newStatus = "unpaid";
    const roundValue = Number(updatedInvoice.roundUp) || 0;

    if (totalPaid >= roundValue && roundValue > 0) newStatus = "paid";
    else if (totalPaid > 0 && totalPaid < roundValue) newStatus = "pending";

    updatedInvoice.totalPaidAmount = totalPaid;
    updatedInvoice.status = newStatus;
    await updatedInvoice.save();

    res.status(200).json({
      message: "History entry deleted successfully",
      status: true,
      updatedInvoice,
    });
  } catch (error) {
    console.error("Error deleting history entry:", error);
    res.status(500).json({
      message: "Error deleting history entry",
      error: error.message,
    });
  }
};

const InvoiceCardsValue = async (req, res) => {
  try {
    const { companyId } = req.query;

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const totalInvoices = await InvoiceModel.countDocuments({
      companyId: companyObjectId,
    });

    const totalRoundUp = await InvoiceModel.aggregate([
      {
        $match: { companyId: companyObjectId },
      },
      {
        $group: {
          _id: null,
          sum: { $sum: "$roundUp" },
        },
      },
    ]);

    const totalPaidAmount = await InvoiceModel.aggregate([
      {
        $match: { companyId: companyObjectId },
      },
      {
        $group: {
          _id: null,
          sum: { $sum: "$totalPaidAmount" },
        },
      },
    ]);

    return res.status(200).json({
      totalInvoices,
      totalRoundUp: totalRoundUp[0]?.sum || 0,
      totalPaidAmount: totalPaidAmount[0]?.sum || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getInvoicesPerDay = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { month } = req.body; // example: "Nov-2025"

    if (!companyId || !month) {
      return res.status(400).json({
        message: "companyId and month are required",
      });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // --- Extract Month + Year ---
    const [monthName, yearStr] = month.split("-");
    const year = parseInt(yearStr);

    const monthMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    const monthNumber = monthMap[monthName];
    if (!monthNumber) {
      return res.status(400).json({ message: "Invalid month format" });
    }

    // Start & End of Month
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    // --- Group Invoices by Day ---
    const invoicesPerDay = await InvoiceModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Prepare Output Array (0 for each day) ---
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const dailyArray = Array(daysInMonth).fill(0);

    invoicesPerDay.forEach((item) => {
      dailyArray[item._id - 1] = item.count;
    });

    return res.json({
      xLabels: Array.from({ length: daysInMonth }, (_, i) => i + 1), // [1...31]
      seriesData: dailyArray, // [0, 5, 2, 0, ...]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

const getInvoicesPerMonth = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { year } = req.body; // e.g. "2028-2029"

    if (!companyId || !year) {
      return res.status(400).json({
        message: "companyId and year are required",
      });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Extract FY start year
    const [startYearStr] = year.split("-");
    const startYear = parseInt(startYearStr); // 2028

    // Financial year range: Apr 2028 → Mar 2029
    const startDate = new Date(startYear, 3, 1); // April 1st
    const endDate = new Date(startYear + 1, 3, 1); // April next year

    const invoicesPerMonth = await InvoiceModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // FY month order: Apr → Mar
    const monthLabels = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    const monthlyArray = Array(12).fill(0);

    invoicesPerMonth.forEach((item) => {
      let monthIndex = item._id - 1; // Mongo months: 1–12

      // Convert Jan–Mar to FY positions
      if (monthIndex < 3) {
        monthIndex += 9; // Jan=9, Feb=10, Mar=11
      } else {
        monthIndex -= 3; // Apr=0
      }

      monthlyArray[monthIndex] = item.count;
    });

    return res.json({
      xLabels: monthLabels,
      seriesData: monthlyArray,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
      error: err,
    });
  }
};

const getDailyInvoiceValue = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { month } = req.body; // "Nov-2025"

    if (!companyId || !month) {
      return res
        .status(400)
        .json({ message: "companyId and month are required" });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const [monthName, yearStr] = month.split("-");
    const year = parseInt(yearStr);

    const monthMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    const monthNumber = monthMap[monthName];
    if (!monthNumber)
      return res.status(400).json({ message: "Invalid month format" });

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    // --- SUM OF roundUp per day ---
    const valuePerDay = await InvoiceModel.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          totalValue: { $sum: "$roundUp" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const dailyArray = Array(daysInMonth).fill(0);

    valuePerDay.forEach((item) => {
      dailyArray[item._id - 1] = item.totalValue;
    });

    return res.json({
      xLabels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      seriesData: dailyArray,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

const getMonthlyInvoiceValue = async (req, res) => {
  try {
    const { companyId } = req.query; // from query
    const { financialYear } = req.body; // "2028-2029"

    if (!companyId || !financialYear) {
      return res.status(400).json({
        message: "companyId and financialYear are required",
      });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Extract years
    const [startYearStr, endYearStr] = financialYear.split("-");
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);

    // Financial year months map
    const fyMonths = [
      { month: 3, year: startYear }, // Apr
      { month: 4, year: startYear }, // May
      { month: 5, year: startYear }, // Jun
      { month: 6, year: startYear },
      { month: 7, year: startYear },
      { month: 8, year: startYear },
      { month: 9, year: startYear },
      { month: 10, year: startYear },
      { month: 11, year: startYear },
      { month: 0, year: endYear }, // Jan
      { month: 1, year: endYear }, // Feb
      { month: 2, year: endYear }, // Mar
    ];

    // Prepare result
    const values = [];

    for (const m of fyMonths) {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month + 1, 1);

      const data = await InvoiceModel.aggregate([
        {
          $match: {
            companyId: companyObjectId,
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$roundUp" },
          },
        },
      ]);

      values.push(data[0]?.totalValue || 0);
    }

    return res.json({
      xLabels: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ],
      seriesData: values,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /invoice/status-summary?companyId=123
const getInvoiceStatusSummary = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { month } = req.body; // format: "Nov-2025"

    if (!companyId || !month) {
      return res.status(400).json({
        success: false,
        message: "companyId (query) and month (body) are required",
      });
    }

    // Convert "Nov-2025" → month number
    const [monthStr, year] = month.split("-");
    const monthNumber = new Date(`${monthStr} 1, ${year}`).getMonth(); // 0–11

    // Start & end of selected month
    const start = new Date(year, monthNumber, 1);
    const end = new Date(year, monthNumber + 1, 1);

    const matchFilter = {
      companyId,
      date: { $gte: start, $lt: end }, // <--- use 'date' field here
    };

    const paid = await InvoiceModel.countDocuments({
      ...matchFilter,
      status: "paid",
    });
    const unpaid = await InvoiceModel.countDocuments({
      ...matchFilter,
      status: "unpaid",
    });
    const pending = await InvoiceModel.countDocuments({
      ...matchFilter,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      data: {
        paid,
        unpaid,
        pending, // frontend shows this as "Partially Paid"
      },
    });
  } catch (err) {
    console.error("STATUS SUMMARY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice status summary",
    });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { fy } = req.body; // e.g., "2028-2029"

    if (!companyId || !fy) {
      return res.status(400).json({ message: "companyId and fy are required" });
    }

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // --- Extract FY start & end year ---
    const [startYearStr, endYearStr] = fy.split("-");
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);

    // --- Define months in financial year Apr → Mar ---
    const monthOrder = [
      { month: 4, label: "Apr", year: startYear },
      { month: 5, label: "May", year: startYear },
      { month: 6, label: "Jun", year: startYear },
      { month: 7, label: "Jul", year: startYear },
      { month: 8, label: "Aug", year: startYear },
      { month: 9, label: "Sep", year: startYear },
      { month: 10, label: "Oct", year: startYear },
      { month: 11, label: "Nov", year: startYear },
      { month: 12, label: "Dec", year: startYear },
      { month: 1, label: "Jan", year: endYear },
      { month: 2, label: "Feb", year: endYear },
      { month: 3, label: "Mar", year: endYear },
    ];

    const revenuePerMonth = {};

    for (let m of monthOrder) {
      const startDate = new Date(m.year, m.month - 1, 1);
      const endDate = new Date(m.year, m.month, 1);

      const result = await InvoiceModel.aggregate([
        {
          $match: {
            companyId: companyObjectId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$roundUp" },
          },
        },
      ]);

      revenuePerMonth[m.label] = result[0]?.total || 0;
    }

    return res.json(revenuePerMonth);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const cardsInfo = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ status: false, message: "companyId is required" });
    }

    // Count invoices

    const noOfInvoices = await InvoiceModel.countDocuments({ companyId });

    const noOfUsers = await AdminModel.countDocuments();

    // Sum of roundUp field
    // Sum of roundUp and totalAmount fields
    const sumResult = await InvoiceModel.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          totalRoundUp: { $sum: "$roundUp" },
          totalAmount: { $sum: "$totalAmount" }, // including GST
        },
      },
    ]);

    const totalRoundUp = sumResult[0]?.totalRoundUp || 0;
    const totalAmount = sumResult[0]?.totalAmount || 0;

    return res.status(200).json({
      status: true,
      noOfInvoices,
      totalRoundUp,
      totalAmount,
      noOfUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

module.exports = {
  createInvoice,
  getAllInvoice,
  deleteInvoice,
  getInvoiceById,
  updateInvoice,
  getMonthlyInvoiceSummary,
  deleteInvoiceHistory,
  InvoiceCardsValue,
  getInvoicesPerDay,
  getInvoicesPerMonth,
  getDailyInvoiceValue,
  getMonthlyInvoiceValue,
  getInvoiceStatusSummary,
  getMonthlyRevenue,
  cardsInfo,
};
