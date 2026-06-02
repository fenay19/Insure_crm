const mongoose = require("mongoose");
const { policyDetailModel } = require("../../models/index");
const { insDepartmentModel } = require("../../models/index");
const { insCompanyModel } = require("../../models/index");
const ProductOrServiceCategorymodel = require("../../models/Masters/ProductOrServiceCategory/ProductOrServiceCategory.model");
const { brokerageRateModel } = require("../../models/index");
const { GstPercentageModel } = require("../../models/index");
const { fuelTypeModel } = require("../../models/index");
const financialYearModel = require("../../models/Masters/FinacialYear/FinancialYear.model");

const csv = require("csvtojson");
const XLSX = require("xlsx");
const path = require("path");
const { Parser: CsvParser } = require("json2csv");

//get the count of policies
const getPolicyCount = async (req, res) => {
  try {
    console.log("count contrioller initiated  ");
    // const { companyId } = req.query;
    // companyId: new mongoose.Types.ObjectId(companyId),

    const count = await policyDetailModel.countDocuments({});

    console.log("response ", count);

    if (count === 0) {
      return res.status(404).json({ message: "No policy details found" });
    }

    return res.status(200).json({ status: "true", count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get policy details by FY
const getPolicyDetailByFY = async (req, res) => {
  try {
    // console.log("API connected... ");
    const { financialYear } = req.query;

    const policyDetail = await policyDetailModel
      .find({
        financialYear: new mongoose.Types.ObjectId(financialYear),
      })
      .populate("insDepartment")
      .populate("insCompany");
    // .populate("ProductOrServiceCategory");

    // .populate("financialYear");

    // console.log("------------------------------------------", policyDetail);

    if (!policyDetail || policyDetail.length === 0) {
      return res.status(404).json({ message: "policy detail not found" });
    }

    // sort data from newest to oldest
    policyDetail.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // b is newer, a is older
    );

    return res.status(200).json({ status: "true", data: policyDetail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get policy details
const getPolicyDetail = async (req, res) => {
  try {
    const { financialYear } = req.query;
    // const { companyId } = req.query;

    const clearFY = financialYear?.toString().substring(0, 24);
    const query = {};

    if (
      clearFY &&
      clearFY.length === 24 &&
      mongoose.Types.ObjectId.isValid(clearFY)
    ) {
      query.financialYear = new mongoose.Types.ObjectId(clearFY);
    }

    if (query) {
      const policyDetail = await policyDetailModel
        .find(query)
        .populate("insDepartment")
        .populate("insCompany")
        .sort({ createdAt: -1 });
      // .populate("ProductOrServiceCategory");
      // .populate("financialYear");

      // console.log("------------------------------------------", policyDetail);

      if (!policyDetail || policyDetail.length === 0) {
        return res.status(404).json({ message: "policy detail not found" });
      }

      // // sort data from newest to oldest
      // policyDetail.sort(
      //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // b is newer, a is older
      // );

      return res.status(200).json({ status: "true", data: policyDetail });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get policy detail by precise policy number (for PDF Extractor renewal matching)
const getPolicyDetailByPolicyNumber = async (req, res) => {
  try {
    const { policyNumber } = req.params;

    if (!policyNumber) {
      return res.status(400).json({ message: "Policy number is required" });
    }

    const policyDetail = await policyDetailModel
      .findOne({ policyNumber: policyNumber })
      .populate("insDepartment")
      .populate("insCompany")
      .populate("financialYear")
      .populate("branchCode")
      .populate("brokerName")
      .populate("branchBroker")
      .populate("subProduct")
      .populate("customerGroup")
      .populate("subCustomerGroup")
      .populate("retailCustomer")
      .populate("prefix")
      .populate("product")
      .populate("incoterms")
      .populate("endorsementReason")
      .populate("rateOnOtherTerr")
      .populate("rateOnTerr")
      .populate("riskCode")
      .populate("fuelType")
      .populate("otherAddon");

    if (!policyDetail) {
      return res.status(404).json({ message: "Policy detail not found" });
    }

    return res.status(200).json({ status: "true", data: policyDetail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postPolicyDetail = async (req, res) => {
  try {
    // console.log("📥 Incoming request body:", req.body);

    const {
      financialYear,
      clientType,
      retailCustomer,
      customerGroup,
      subCustomerGroup,
      checkSubGroup,
      branchCode,
      branchName,
      prefix,
      cutomerName,
      mobile,
      email,
      insurerName,
      gstNo,
      showNominee,
      nomineeName,
      nomineeRelation,
      insDepartment,
      product,
      subProduct,
      insCompany,
      brokerName,
      branchBroker,
      tpPolicyDuration,
      tpStartDate,
      tpEndDate,
      tpPremium,
      tpGst,
      tpGstAmount,
      tpAmount,
      odPolicyDuration,
      odStartDate,
      odEndDate,
      odPremium,
      odGst,
      odGstAmount,
      odAmount,
      policyNumber,
      renewalDate,
      sumInsured,
      renewable,
      numberOfInstallments,
      livesCover,
      nextInstallmentDate,
      policyDuration,
      startDate,
      endDate,
      riskCode,
      otherAddon,
      terrirism,
      netPremium,
      CGST,
      SGST,
      IGST,
      UGST,
      gst,
      gstAmount,
      totalAmount,
      siteLocation,
      occupation,
      retroActive,
      incoterms,
      marineClause,
      terrorism,
      permiumOtherThanTerrorism,
      vehicleMake,
      vehicleModel,
      vehicleSubModel,
      vehicleNumber,
      engineNumber,
      monthYearOfRegn,
      fuelType,
      yearOfManufacturing,
      chassisNumber,
      endorsementName,
      endorsementReason,
      endorsementPolicyNumber,
      endorStartDate,
      endorEndDate,
      endorsementTerrorism,
      endorsementOtherTerrorism,
      endorsementNetPremium,
      paymentMode,
      etotalAmount,
      paidAmount,
      chequeNo,
      transactionDate,
      posMisRef,
      bqpCode,
      rateOnOtherTerr,
      amountOnOtherTerr,
      rateOnTerr,
      amountOnTerr,
      odBrokerageRate,
      odBrokerageAmount,
      tpBrokerageRate,
      tpBrokerageAmount,
      brokerageGst,
      totalBrokerageAmount,
      totalBrokerageGst,
      totalBrokerageAmountincGst,
    } = req.body;

    const { companyId } = req.query;

    // 📝 Create new AdminClientRegistration document
    const newPolicyDetail = new policyDetailModel({
      financialYear: req.body.financialYear || undefined,
      clientType: req.body.clientType || undefined,
      retailCustomer: req.body.retailCustomer || undefined,
      customerGroup: req.body.customerGroup || undefined,
      subCustomerGroup: req.body.subCustomerGroup || undefined,
      checkSubGroup: req.body.checkSubGroup || undefined,
      branchCode: req.body.branchCode || undefined,
      branchName: req.body.branchName || undefined,
      prefix: req.body.prefix || undefined,
      cutomerName,
      mobile,
      email,
      insurerName,
      gstNo,
      showNominee,
      nomineeName,
      nomineeRelation,
      insDepartment: req.body.insDepartment || undefined,
      product: req.body.product || undefined,
      subProduct: req.body.subProduct || undefined,
      insCompany: req.body.insCompany || undefined,
      brokerName: req.body.brokerName || undefined,
      branchBroker: req.body.branchBroker || undefined,
      tpPolicyDuration,
      tpStartDate,
      tpEndDate,
      tpPremium,
      tpGst,
      tpGstAmount,
      tpAmount,
      odPolicyDuration,
      odStartDate,
      odEndDate,
      odPremium,
      odGst,
      odGstAmount,
      odAmount,
      policyNumber,
      renewalDate,
      sumInsured,
      renewable,
      numberOfInstallments,
      livesCover,
      nextInstallmentDate,
      policyDuration,
      startDate,
      endDate,
      riskCode: req.body.riskCode || undefined,
      otherAddon: req.body.otherAddon || undefined,
      terrirism,
      netPremium,
      CGST,
      SGST,
      IGST,
      UGST,
      gst,
      gstAmount,
      totalAmount,
      siteLocation,
      occupation,
      retroActive,
      incoterms: req.body.incoterms || undefined,
      marineClause: req.body.marineClause || undefined,
      terrorism,
      permiumOtherThanTerrorism,
      vehicleMake,
      vehicleModel,
      vehicleSubModel,
      vehicleNumber,
      engineNumber,
      monthYearOfRegn,
      fuelType: req.body.fuelType || undefined,
      yearOfManufacturing,
      chassisNumber,
      endorsementName,
      endorsementReason: req.body.endorsementReason || undefined,
      endorsementPolicyNumber,
      endorStartDate,
      endorEndDate,
      endorsementTerrorism,
      endorsementOtherTerrorism,
      endorsementNetPremium,
      paymentMode,
      etotalAmount,
      paidAmount,
      chequeNo,
      transactionDate,
      posMisRef,
      bqpCode,
      rateOnOtherTerr: req.body.rateOnOtherTerr || undefined,
      amountOnOtherTerr,
      rateOnTerr: req.body.rateOnTerr || undefined,
      amountOnTerr,
      odBrokerageRate: req.body.odBrokerageRate || undefined,
      odBrokerageAmount,
      tpBrokerageRate: req.body.tpBrokerageRate || undefined,
      tpBrokerageAmount,
      brokerageGst: req.body.brokerageGst || undefined,
      totalBrokerageAmount,
      totalBrokerageGst,
      totalBrokerageAmountincGst,
      companyId,
    });

    await newPolicyDetail.save();

    return res.status(201).json({
      status: true,
      message: "Policy registered successfully",
      data: newPolicyDetail,
    });
  } catch (error) {
    console.error("🔥 Error in postPolicyDetail:", error);
    return res.status(500).json({
      message: "Server error while registering policy.",
      error: error.message,
    });
  }
};

const getPolicyDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await policyDetailModel.findById(id);
    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Policy not found" });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error("Get policy by ID Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// update policy data
const updatePolicyDetail = async (req, res) => {
  try {
    const policyId = req.params.id;
    let updateData = { ...req.body };

    if (!policyId || !mongoose.Types.ObjectId.isValid(policyId)) {
      return res.status(400).json({ message: "Valid Policy ID is required" });
    }
    // Update only provided fields; $set ensures only changed fields are updated.
    const updatedPolicyDetail = await policyDetailModel.findByIdAndUpdate(
      policyId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedPolicyDetail) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      data: updatedPolicyDetail,
    });
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating policy",
      error: error.message,
    });
  }
};

// delete policy Detail
const deletePolicyDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPolicyDetail = await policyDetailModel.findByIdAndDelete(id);

    if (!deletedPolicyDetail) {
      return res.status(404).json({ message: "Policy Details not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Policy Details deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting Policy Details" });
  }
};

const importCsv = async (req, res) => {
  try {
    console.log("=== IMPORT CSV START ===");
    console.log(
      "File received:",
      req.file?.originalname,
      "Path:",
      req.file?.path,
      "Size:",
      req.file?.size,
    );
    if (!req.file?.path)
      return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    // console.log("EXTENSION ", ext);

    let rows = [];
    if (ext === ".csv") {
      rows = await csv().fromFile(req.file.path);
    } else if (ext === ".xlsx" || ext === ".xls") {
      const wb = XLSX.readFile(req.file.path);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    console.log(
      "ROWS PARSED:",
      rows.length,
      "| First row keys:",
      rows.length > 0 ? Object.keys(rows[0]) : "NO ROWS",
    );
    console.log(
      "First row sample:",
      rows.length > 0 ? JSON.stringify(rows[0]).substring(0, 500) : "EMPTY",
    );

    const toLowerSafe = (val) => {
      // Strips whitespace, tabs, newlines, and common punctuation like _ . -
      return typeof val === "string" 
        ? val.toLowerCase().replace(/[\s\t\n_.-]+/g, "") 
        : val;
    };

    const insDepartments = await insDepartmentModel.find(
      {},
      { _id: 1, insDepartment: 1 },
    );

    const departmentMap = insDepartments.reduce((map, dept) => {
      map[toLowerSafe(dept.insDepartment)] = dept._id;
      return map;
    }, {});

    const insCompany = await insCompanyModel.find(
      {},
      { _id: 1, insCompany: 1 },
    );

    const gsts = await GstPercentageModel.find({
      isDeleted: false,
    });

    const gstMap = gsts.reduce((map, gst) => {
      map[String(gst.value)] = gst._id; // value is GST percentage
      return map;
    }, {});

    const brokerageRates = await brokerageRateModel.find({});

    const brokerageRateMap = brokerageRates.reduce((map, rate) => {
      map[String(rate.brokerageRate).trim()] = rate._id;
      return map;
    }, {});

    const fuelTypes = await fuelTypeModel.find({});

    const fuelTypeMap = fuelTypes.reduce((map, fuel) => {
      map[toLowerSafe(fuel.fuelType).trim()] = fuel._id;
      return map;
    }, {});

    const companyList = insCompany.map((c) => ({
      key: c.insCompany ? String(toLowerSafe(c.insCompany)).slice(0, 4) : "",
      _id: c._id,
      name: c.insCompany,
    }));

    const products = await ProductOrServiceCategorymodel.find({});

    // --- Look up all financial years and build a map: "2025-2026" → ObjectId ---
    const allFYs = await financialYearModel.find({});
    const fyMap = allFYs.reduce((map, fy) => {
      const fromYear = new Date(fy.fromDate).getFullYear();
      const toYear = new Date(fy.toDate).getFullYear();
      map[`${fromYear}-${toYear}`] = fy._id;
      return map;
    }, {});
    console.log("FY MAP:", fyMap);

    // Use companyId from query string (sent by frontend), or fallback to hardcoded
    const resolvedCompanyId = new mongoose.Types.ObjectId(
      req.query.companyId || "68ca95091d6a9cc2b96ae263",
    );

    const excelDateToJSDate = (excelDate) => {
      if (!excelDate) return null;
      // If it's a number (Excel serial date)
      if (!isNaN(excelDate) && typeof excelDate === "number") {
        return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
      }
      // If it's a string date like "12/05/2023" or "2023-05-12"
      if (typeof excelDate === "string" && excelDate.trim()) {
        const parsed = new Date(excelDate);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    };

    const policyDetailsArray = rows.map((row) => ({
      financialYear: fyMap[row["Financial Year"]] || null,
      companyId: resolvedCompanyId,
      branchCode: new mongoose.Types.ObjectId("695386ca12bb6dd679ffa330"),
      branchName: "NAGPUR",
      brokerName: new mongoose.Types.ObjectId("6964ceed36ec87f56adc1332"),
      branchBroker: new mongoose.Types.ObjectId("6964b3a4b2343d2e611ea796"),
      cutomerName: row["Customer Name"]?.trim() || "",
      clientType: toLowerSafe(row["Client Type"]), // RETAIL → retail
      mobile: row["Mobile"] || "",
      email: row["Email"] || "",
      renewable: row["Renewable"],
      vehicleModel: row["Vehicle Make"] || "",
      policyNumber: String(row["Policy Number"] || "").trim(),
      numberOfInstallments: String(row["Number Of Installments"] || "").trim(),
      livesCover: String(row["Lives Covered"] || "").trim(),
      nextInstallmentDate:
        excelDateToJSDate(row["Next Installment Date"]) || null,
      siteLocation: String(row["Site Location"] || "").trim(),

      tpPremium: Number(row["TP Premium"]) || 0,
      tpGstAmount: Number(row["TP GST Amount"]) || 0,
      tpAmount: Number(row["TP Amount"]) || 0,
      odPremium: Number(row["OD Premium"]) || 0,
      odGstAmount: Number(row["OD GST Amount"]) || 0,
      odAmount: Number(row["OD Amount"]) || 0,
      terrorism: Number(row["Terrorism"]) || 0,
      permiumOtherThanTerrorism:
        Number(row["Premium Other Than Terrorism"]) || 0,
      netPremium: Number(row["Net Premium"]) || 0,
      gstAmount: Number(row["GST Amount"]) || 0,
      totalAmount: Number(row["Total Amount"]) || 0,
      sumInsured: Number(row["Sum Insured"]) || 0,
      renewalDate: excelDateToJSDate(row["Renewal Date"]) || "",
      insDepartment:
        departmentMap[toLowerSafe(row["Insurance Department"])] || "",

      product:
        products.find(
          (p) => toLowerSafe(p.productName) === toLowerSafe(row["Product"]),
        )?._id || "",

      insCompany:
        companyList.find(
          (c) => c.key === String(toLowerSafe(row["Insurance Company"]) || "").slice(0, 4),
        )?._id || "",

      insurerName:
        companyList.find(
          (c) => c.key === String(toLowerSafe(row["Insurance Company"]) || "").slice(0, 4),
        )?.name || row["Insurance Company"],

      tpGst: gstMap[row["TP GST"]] || "",
      odGst: gstMap[row["OD GST"]] || "",
      gst: gstMap[row["GST"]] || "",
      fuelType: fuelTypeMap[toLowerSafe(row["Fuel Type"])] || "",
      rateOnOtherTerr: brokerageRateMap[row["Rate On Other Terrorism"]] || "",
      rateOnTerr: brokerageRateMap[row["Rate On Terrorism"]] || "",
      odBrokerageRate: brokerageRateMap[row["OD Brokerage Rate"]] || "",
      tpBrokerageRate: brokerageRateMap[row["TP Brokerage Rate"]] || "",

      tpStartDate: excelDateToJSDate(row["TP Start Date"]) || "",
      odStartDate: excelDateToJSDate(row["OD Start Date"]) || "",
      startDate: excelDateToJSDate(row["Start Date"]) || "",
      tpEndDate: excelDateToJSDate(row["TP End Date"]) || "",
      odEndDate: excelDateToJSDate(row["OD End Date"]) || "",
      endDate: excelDateToJSDate(row["End Date"]) || "",
      vehicleNumber: String(row["Vehicle Number"] || "").trim(),
      engineNumber: String(row["Engine Number"] || "").trim(),
      yearOfManufacturing: String(
        row["Month Year Of Registration"] || "",
      ).trim(),
      chassisNumber: String(row["Chassis Number"] || "").trim(),

      endorsementName: String(row["Endorsement Name"] || "").trim(),
      endorsementPolicyNumber: String(
        row["Endorsement Policy Number"] || "",
      ).trim(),
      endorStartDate: excelDateToJSDate(row["Endorsement Start Date"]) || "",
      endorEndDate: excelDateToJSDate(row["Endorsement End Date"]) || "",
      endorsementTerrorism: String(row["Endorsement Terrorism"] || "").trim(),
      endorsementOtherTerrorism: String(
        row["Endorsement Other Terrorism"] || "",
      ).trim(),
      endorsementNetPremium: String(
        row["Endorsement Net Premium"] || "",
      ).trim(),
      etotalAmount: String(row["E Total Amount"] || "").trim(),

      chequeNo: String(row["Cheque No"] || "").trim(),
      transactionDate: excelDateToJSDate(row["Transaction Date"]) || "",
      paymentMode: String(row["Payment Mode"] || "").trim(),
      paidAmount: Number(row["Paid Amount"]) || 0,
      gstNo: String(row["GST No"] || "").trim(),

      amountOnOtherTerr: Number(row["Amount On Other Terrorism"]) || 0,
      amountOnTerr: Number(row["Amount On Terrorism"]) || 0,
      odBrokerageAmount: Number(row["OD Brokerage Amount"]) || 0,
      tpBrokerageAmount: Number(row["TP Brokerage Amount"]) || 0,
      totalBrokerageAmount: Number(row["Total Brokerage Amount"]) || 0,
      totalBrokerageAmountincGst:
        Number(row["Total Brokerage Amount Incl GST"]) || 0,
    }));

    // console.log(
    //   "-----------------------------------------------------------------------",
    // );
    console.log("POLICY ARRAY LENGTH:", policyDetailsArray.length);
    if (policyDetailsArray.length > 0) {
      console.log(
        "FIRST POLICY SAMPLE:",
        JSON.stringify(policyDetailsArray[0]).substring(0, 500),
      );
    }

    let insertedDocs = [];
    let failedDocs = [];

    try {
      insertedDocs = await policyDetailModel.insertMany(policyDetailsArray, {
        ordered: false,
      });

      return res.status(201).json({
        success: true,
        insertedCount: insertedDocs.length,
        failedCount: 0,
        message: "success",
      });
    } catch (e) {
      console.error(e);

      // documents that WERE inserted
      insertedDocs = e.insertedDocs || [];

      // documents that FAILED
      failedDocs = (e.writeErrors || []).map((err) => ({
        index: err.index,
        error: err.errmsg,
        document: policyDetailsArray[err.index],
      }));
      console.log("Failed Docs Array:", JSON.stringify(failedDocs, null, 2));

      return res.status(207).json({
        success: false,
        insertedCount: insertedDocs.length,
        failedCount: failedDocs.length,
        failedDocs,
        message: "Partial insert completed",
      });
    }
  } catch (e) {
    console.error("FATAL ERROR IN IMPORT:", e);
    insertedDocs = e.insertedDocs || [];
    failedDocs = (e.writeErrors || []).map((err) => ({
      index: err.index,
      error: err.errmsg,
      document: policyDetailsArray[err.index],
    }));
    console.log(
      "Fatal Failed Docs Array:",
      JSON.stringify(failedDocs, null, 2),
    );
    return res
      .status(500)
      .json({ STATUS: false, error: e.message, failedDocs: failedDocs });
  }
};

const exportCsv = async (req, res) => {
  const { financialYear, filterDate, dateFrom, dateTo } = req.query;

  // console.log("Inside export controller ", financialYear);

  try {
    let query = {};
    if (filterDate === "byMonth" && dateFrom && dateTo) {
      // Use IST boundaries (UTC+5:30) to match frontend local-time logic
      const startOfMonth = new Date(`${dateFrom}T00:00:00.000+05:30`);
      const endOfMonth = new Date(`${dateTo}T23:59:59.999+05:30`);

      // Use $ifNull to pick startDate ?? tpStartDate ?? odStartDate
      // (same fallback logic the frontend dashboard uses)
      const matchingIds = await policyDetailModel.aggregate([
        {
          $addFields: {
            effectiveDate: {
              $ifNull: ["$startDate", "$tpStartDate", "$odStartDate"]
            }
          }
        },
        {
          $match: {
            effectiveDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { $project: { _id: 1 } }
      ]);

      query = { _id: { $in: matchingIds.map(d => d._id) } };
    } else {
      query = { financialYear: new mongoose.Types.ObjectId(financialYear) };
    }

    const policyData = await policyDetailModel
      .find(query)
      .populate("insDepartment", "insDepartment")
      .populate("insCompany", "insCompany")
      .populate("financialYear")
      .populate("prefix")
      .populate("gst")
      .populate("tpGst")
      .populate("odGst")
      .populate("rateOnTerr")
      .populate("rateOnOtherTerr")
      .populate("tpBrokerageRate")
      .populate("odBrokerageRate")
      .populate("product")
      .populate("subProduct")
      .populate("retailCustomer")
      .populate("customerGroup")
      .populate("subCustomerGroup")
      .populate("branchCode")
      .populate("branchBroker")
      .populate("brokerName");

    const exportData = policyData.map((p) => {
      const obj = p.toObject();

      return {
        ...obj,
        insDepartment: obj.insDepartment?.insDepartment || "",
        insCompany: obj.insCompany?.insCompany || "",
        brokerName: obj.brokerName?.brokerName || "",
        branchBroker: obj.branchBroker?.branchBroker || "",
        branchCode: obj.branchCode?.branchCode || "",
        prefix: obj.prefix?.prefix || "",
        product: obj.product?.productName || "",
        subProduct: obj.subProduct?.subProductName || "",
        retailCustomer: obj.retailCustomer?.name || "",
        gst: obj.gst?.value || "",
        tpGst: obj.tpGst?.value || "",
        odGst: obj.odGst?.value || "",
        rateOnTerr: obj.rateOnTerr?.brokerageRate || "",
        rateOnOtherTerr: obj.rateOnOtherTerr?.brokerageRate || "",
        tpBrokerageRate: obj.tpBrokerageRate?.brokerageRate || "",
        odBrokerageRate: obj.odBrokerageRate?.brokerageRate || "",
        financialYear: `${new Date(obj.financialYear?.fromDate).getFullYear()}-${new Date(obj.financialYear?.toDate).getFullYear()}`,
      };
    });

    // console.log("Policy export ", exportData);

    const csvFields = [
      { label: "Financial Year", value: "financialYear" },
      { label: "Client Type", value: "clientType" },
      { label: "Retail Customer", value: "retailCustomer" },
      { label: "Customer Group", value: "customerGroup" },
      { label: "Sub Customer Group", value: "subCustomerGroup" },
      { label: "Check Sub Group", value: "checkSubGroup" },
      { label: "Branch Code", value: "branchCode" },
      { label: "Branch Name", value: "branchName" },
      { label: "Prefix", value: "prefix" },
      { label: "Customer Name", value: "cutomerName" },
      { label: "Mobile", value: "mobile" },
      { label: "Email", value: "email" },
      { label: "Insurer Name", value: "insurerName" },
      { label: "GST No", value: "gstNo" },
      { label: "Show Nominee", value: "showNominee" },
      { label: "Nominee Name", value: "nomineeName" },
      { label: "Nominee Relation", value: "nomineeRelation" },
      { label: "Insurance Department", value: "insDepartment" },
      { label: "Product", value: "product" },
      { label: "Sub Product", value: "subProduct" },
      { label: "Insurance Company", value: "insCompany" },
      { label: "Broker Name", value: "brokerName" },
      { label: "Branch Broker", value: "branchBroker" },

      { label: "TP Policy Duration", value: "tpPolicyDuration" },
      { label: "TP Start Date", value: "tpStartDate" },
      { label: "TP End Date", value: "tpEndDate" },
      { label: "TP Premium", value: "tpPremium" },
      { label: "TP GST", value: "tpGst" },
      { label: "TP GST Amount", value: "tpGstAmount" },
      { label: "TP Amount", value: "tpAmount" },

      { label: "OD Policy Duration", value: "odPolicyDuration" },
      { label: "OD Start Date", value: "odStartDate" },
      { label: "OD End Date", value: "odEndDate" },
      { label: "OD Premium", value: "odPremium" },
      { label: "OD GST", value: "odGst" },
      { label: "OD GST Amount", value: "odGstAmount" },
      { label: "OD Amount", value: "odAmount" },

      { label: "Policy Number", value: "policyNumber" },
      { label: "Renewal Date", value: "renewalDate" },
      { label: "Sum Insured", value: "sumInsured" },
      { label: "Renewable", value: "renewable" },
      { label: "Number Of Installments", value: "numberOfInstallments" },
      { label: "Lives Covered", value: "livesCover" },
      { label: "Next Installment Date", value: "nextInstallmentDate" },
      { label: "Policy Duration", value: "policyDuration" },
      { label: "Start Date", value: "startDate" },
      { label: "End Date", value: "endDate" },

      { label: "Risk Code", value: "riskCode" },
      { label: "Other Addon", value: "otherAddon" },
      { label: "Terrorism", value: "terrorism" },
      { label: "Net Premium", value: "netPremium" },

      { label: "CGST", value: "CGST" },
      { label: "SGST", value: "SGST" },
      { label: "IGST", value: "IGST" },
      { label: "UGST", value: "UGST" },
      { label: "GST", value: "gst" },
      { label: "GST Amount", value: "gstAmount" },
      { label: "Total Amount", value: "totalAmount" },

      { label: "Site Location", value: "siteLocation" },
      { label: "Occupation", value: "occupation" },
      { label: "Retro Active", value: "retroActive" },
      { label: "Incoterms", value: "incoterms" },
      { label: "Marine Clause", value: "marineClause" },
      { label: "Terrorism Cover", value: "terrorism" },
      {
        label: "Premium Other Than Terrorism",
        value: "permiumOtherThanTerrorism",
      },

      { label: "Vehicle Make", value: "vehicleMake" },
      { label: "Vehicle Model", value: "vehicleModel" },
      { label: "Vehicle Sub Model", value: "vehicleSubModel" },
      { label: "Vehicle Number", value: "vehicleNumber" },
      { label: "Engine Number", value: "engineNumber" },
      { label: "Month Year Of Registration", value: "monthYearOfRegn" },
      { label: "Fuel Type", value: "fuelType" },
      { label: "Year Of Manufacturing", value: "yearOfManufacturing" },
      { label: "Chassis Number", value: "chassisNumber" },

      { label: "Endorsement Name", value: "endorsementName" },
      { label: "Endorsement Reason", value: "endorsementReason" },
      { label: "Endorsement Policy Number", value: "endorsementPolicyNumber" },
      { label: "Endorsement Start Date", value: "endorStartDate" },
      { label: "Endorsement End Date", value: "endorEndDate" },
      { label: "Endorsement Terrorism", value: "endorsementTerrorism" },
      {
        label: "Endorsement Other Terrorism",
        value: "endorsementOtherTerrorism",
      },
      { label: "Endorsement Net Premium", value: "endorsementNetPremium" },

      { label: "Payment Mode", value: "paymentMode" },
      { label: "E Total Amount", value: "etotalAmount" },
      { label: "Paid Amount", value: "paidAmount" },
      { label: "Cheque No", value: "chequeNo" },
      { label: "Transaction Date", value: "transactionDate" },
      { label: "POS MIS Ref", value: "posMisRef" },
      { label: "BQP Code", value: "bqpCode" },

      { label: "Rate On Other Terrorism", value: "rateOnOtherTerr" },
      { label: "Amount On Other Terrorism", value: "amountOnOtherTerr" },
      { label: "Rate On Terrorism", value: "rateOnTerr" },
      { label: "Amount On Terrorism", value: "amountOnTerr" },

      { label: "OD Brokerage Rate", value: "odBrokerageRate" },
      { label: "OD Brokerage Amount", value: "odBrokerageAmount" },
      { label: "TP Brokerage Rate", value: "tpBrokerageRate" },
      { label: "TP Brokerage Amount", value: "tpBrokerageAmount" },
      { label: "Total Brokerage Amount", value: "totalBrokerageAmount" },
      { label: "Total Brokerage GST", value: "totalBrokerageGst" },
      {
        label: "Total Brokerage Amount Incl GST",
        value: "totalBrokerageAmountincGst",
      },
    ];

    const csvParser = new CsvParser({ fields: csvFields });
    const csvData = csvParser.parse(exportData);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=policies.csv");
    res.status(200).end(csvData);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("An error occurred while exporting the data.");
  }
};

// get policy details
const getPolicyDetailsDateFrom = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // console.log("Req ", dateFrom, dateTo);

    if (dateFrom && dateTo) {
      // Use IST boundaries (UTC+5:30) to match frontend local-time logic
      const startOfMonth = new Date(`${dateFrom}T00:00:00.000+05:30`);
      const endOfMonth = new Date(`${dateTo}T23:59:59.999+05:30`);
      // console.log("Ewq inside  ", startOfMonth, dateFrom, dateTo, endOfMonth);

      const policyDetail = await policyDetailModel.aggregate([
        {
          $addFields: {
            effectiveDate: {
              $ifNull: ["$startDate", "$tpStartDate", "$odStartDate"]
            }
          }
        },
        {
          $match: {
            effectiveDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { $lookup: { from: "insdepartments", localField: "insDepartment", foreignField: "_id", as: "insDepartment" } },
        { $unwind: { path: "$insDepartment", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "inscompanies", localField: "insCompany", foreignField: "_id", as: "insCompany" } },
        { $unwind: { path: "$insCompany", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } }
      ]);
      // .populate("ProductOrServiceCategory");
      // .populate("financialYear");

      // console.log("------------------------------------------", policyDetail);

      if (!policyDetail || policyDetail.length === 0) {
        return res.status(404).json({ message: "policy detail not found" });
      }

      return res.status(200).json({ status: "true", data: policyDetail });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get insurer history — all policies for a given insurerName, grouped by financial year
const getInsurerHistory = async (req, res) => {
  try {
    const { insurerName, companyId } = req.query;

    if (!insurerName) {
      return res
        .status(400)
        .json({ success: false, message: "insurerName query param is required" });
    }

    const mongoose = require("mongoose");
    const pipeline = [
      // 0. Filter by tenant companyId
      ...(companyId
        ? [{ $match: { companyId: new mongoose.Types.ObjectId(companyId) } }]
        : []),
      // 1. Lookup insurance company first so we can match by its reference name
      {
        $lookup: {
          from: "inscompanies",
          localField: "insCompany",
          foreignField: "_id",
          as: "insCompDetails",
        },
      },
      { $unwind: { path: "$insCompDetails", preserveNullAndEmptyArrays: true } },
      // 2. Match policies for the given insurer name (case-insensitive) in both fields
      {
        $match: {
          $or: [
            { insurerName: { $regex: new RegExp(`^${insurerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } },
            { "insCompDetails.insCompany": { $regex: new RegExp(`^${insurerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } }
          ]
        },
      },
      // 3. Lookup the financial year details
      {
        $lookup: {
          from: "financialyears",
          localField: "financialYear",
          foreignField: "_id",
          as: "fyDetails",
        },
      },
      { $unwind: { path: "$fyDetails", preserveNullAndEmptyArrays: true } },
      // 4. Lookup insurance department
      {
        $lookup: {
          from: "insdepartments",
          localField: "insDepartment",
          foreignField: "_id",
          as: "insDeptDetails",
        },
      },
      { $unwind: { path: "$insDeptDetails", preserveNullAndEmptyArrays: true } },
      // 5. Build a human-readable FY label
      {
        $addFields: {
          fyLabel: {
            $cond: {
              if: { $and: ["$fyDetails.fromDate", "$fyDetails.toDate"] },
              then: {
                $concat: [
                  { $toString: { $year: "$fyDetails.fromDate" } },
                  "-",
                  { $toString: { $year: "$fyDetails.toDate" } },
                ],
              },
              else: "Unknown FY",
            },
          },
        },
      },
      // 6. Cast numeric fields (often stored as strings from CSV import)
      {
        $addFields: {
          _netPremium: {
            $cond: {
              if: { $isNumber: "$netPremium" },
              then: "$netPremium",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$netPremium", null] }, { $ne: ["$netPremium", ""] }] },
                  then: { $toDouble: "$netPremium" },
                  else: 0,
                },
              },
            },
          },
          _gstAmount: {
            $cond: {
              if: { $isNumber: "$gstAmount" },
              then: "$gstAmount",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$gstAmount", null] }, { $ne: ["$gstAmount", ""] }] },
                  then: { $toDouble: "$gstAmount" },
                  else: 0,
                },
              },
            },
          },
          _totalAmount: {
            $cond: {
              if: { $isNumber: "$totalAmount" },
              then: "$totalAmount",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$totalAmount", null] }, { $ne: ["$totalAmount", ""] }] },
                  then: { $toDouble: "$totalAmount" },
                  else: 0,
                },
              },
            },
          },
        },
      },
      // 7. Group by financial year
      {
        $group: {
          _id: "$financialYear",
          fyLabel: { $first: "$fyLabel" },
          fromDate: { $first: "$fyDetails.fromDate" },
          count: { $sum: 1 },
          totalPremium: { $sum: "$_netPremium" },
          totalAmount: { $sum: "$_totalAmount" },
          policies: {
            $push: {
              _id: "$_id",
              cutomerName: "$cutomerName",
              policyNumber: "$policyNumber",
              insDepartment: "$insDeptDetails.insDepartment",
              insCompany: "$insCompDetails.insCompany",
              startDate: "$startDate",
              endDate: "$endDate",
              tpStartDate: "$tpStartDate",
              tpEndDate: "$tpEndDate",
              odStartDate: "$odStartDate",
              odEndDate: "$odEndDate",
              netPremium: "$_netPremium",
              gstAmount: "$_gstAmount",
              totalAmount: "$_totalAmount",
              sumInsured: "$sumInsured",
              policyDuration: "$policyDuration",
              vehicleNumber: "$vehicleNumber",
              mobile: "$mobile",
            },
          },
        },
      },
      // 7. Sort by FY (newest first)
      { $sort: { fromDate: -1 } },
      // 8. Clean up
      {
        $project: {
          _id: 0,
          financialYearId: "$_id",
          fyLabel: 1,
          count: 1,
          totalPremium: 1,
          totalAmount: 1,
          policies: 1,
        },
      },
    ];

    const result = await policyDetailModel.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      insurerName,
      totalPolicies: result.reduce((sum, fy) => sum + fy.count, 0),
      financialYears: result,
    });
  } catch (error) {
    console.error("Error in getInsurerHistory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer history — all policies for a given customerName, grouped by financial year
const getCustomerHistory = async (req, res) => {
  try {
    const { customerName, companyId } = req.query;

    if (!customerName) {
      return res
        .status(400)
        .json({ success: false, message: "customerName query param is required" });
    }

    const mongoose = require("mongoose");
    const pipeline = [
      // 0. Filter by tenant companyId
      ...(companyId
        ? [{ $match: { companyId: new mongoose.Types.ObjectId(companyId) } }]
        : []),
      // 1. Lookup retailCustomer to check populated name mapping
      {
        $lookup: {
          from: "customerregistrations",
          localField: "retailCustomer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true } },
      // 2. Match policies for the given customer name (case-insensitive) either in cutomerName or the referenced customerRegistration
      {
        $match: {
          $or: [
            { cutomerName: { $regex: new RegExp(`^${customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } },
            { "customerDetails.name": { $regex: new RegExp(`^${customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } }
          ]
        },
      },
      // 3. Lookup the financial year details
      {
        $lookup: {
          from: "financialyears",
          localField: "financialYear",
          foreignField: "_id",
          as: "fyDetails",
        },
      },
      { $unwind: { path: "$fyDetails", preserveNullAndEmptyArrays: true } },
      // 4. Lookup insurance department
      {
        $lookup: {
          from: "insdepartments",
          localField: "insDepartment",
          foreignField: "_id",
          as: "insDeptDetails",
        },
      },
      { $unwind: { path: "$insDeptDetails", preserveNullAndEmptyArrays: true } },
      // 5. Lookup insurance company
      {
        $lookup: {
          from: "inscompanies",
          localField: "insCompany",
          foreignField: "_id",
          as: "insCompDetails",
        },
      },
      { $unwind: { path: "$insCompDetails", preserveNullAndEmptyArrays: true } },
      // 6. Build a human-readable FY label
      {
        $addFields: {
          fyLabel: {
            $cond: {
              if: { $and: ["$fyDetails.fromDate", "$fyDetails.toDate"] },
              then: {
                $concat: [
                  { $toString: { $year: "$fyDetails.fromDate" } },
                  "-",
                  { $toString: { $year: "$fyDetails.toDate" } },
                ],
              },
              else: "Unknown FY",
            },
          },
        },
      },
      // 7. Cast numeric fields (often stored as strings from CSV import)
      {
        $addFields: {
          _netPremium: {
            $cond: {
              if: { $isNumber: "$netPremium" },
              then: "$netPremium",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$netPremium", null] }, { $ne: ["$netPremium", ""] }] },
                  then: { $toDouble: "$netPremium" },
                  else: 0,
                },
              },
            },
          },
          _gstAmount: {
            $cond: {
              if: { $isNumber: "$gstAmount" },
              then: "$gstAmount",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$gstAmount", null] }, { $ne: ["$gstAmount", ""] }] },
                  then: { $toDouble: "$gstAmount" },
                  else: 0,
                },
              },
            },
          },
          _totalAmount: {
            $cond: {
              if: { $isNumber: "$totalAmount" },
              then: "$totalAmount",
              else: {
                $cond: {
                  if: { $and: [{ $ne: ["$totalAmount", null] }, { $ne: ["$totalAmount", ""] }] },
                  then: { $toDouble: "$totalAmount" },
                  else: 0,
                },
              },
            },
          },
        },
      },
      // 8. Group by financial year
      {
        $group: {
          _id: "$financialYear",
          fyLabel: { $first: "$fyLabel" },
          fromDate: { $first: "$fyDetails.fromDate" },
          count: { $sum: 1 },
          totalPremium: { $sum: "$_netPremium" },
          totalAmount: { $sum: "$_totalAmount" },
          policies: {
            $push: {
              _id: "$_id",
              cutomerName: "$cutomerName",
              policyNumber: "$policyNumber",
              insDepartment: "$insDeptDetails.insDepartment",
              insCompany: "$insCompDetails.insCompany",
              startDate: "$startDate",
              endDate: "$endDate",
              tpStartDate: "$tpStartDate",
              tpEndDate: "$tpEndDate",
              odStartDate: "$odStartDate",
              odEndDate: "$odEndDate",
              netPremium: "$_netPremium",
              gstAmount: "$_gstAmount",
              totalAmount: "$_totalAmount",
              sumInsured: "$sumInsured",
              policyDuration: "$policyDuration",
              vehicleNumber: "$vehicleNumber",
              mobile: "$mobile",
            },
          },
        },
      },
      // 8. Sort by FY (newest first)
      { $sort: { fromDate: -1 } },
      // 9. Clean up
      {
        $project: {
          _id: 0,
          financialYearId: "$_id",
          fyLabel: 1,
          count: 1,
          totalPremium: 1,
          totalAmount: 1,
          policies: 1,
        },
      },
    ];

    const result = await policyDetailModel.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      customerName,
      totalPolicies: result.reduce((sum, fy) => sum + fy.count, 0),
      financialYears: result,
    });
  } catch (error) {
    console.error("Error in getCustomerHistory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send SMS Reminder for policy renewal
const axios = require("axios");

const sendReminder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("sendReminder called for policy:", id);

    // 1. Fetch policy with populated insDepartment and product
    const policy = await policyDetailModel
      .findById(id)
      .populate("insDepartment", "insDepartment")
      .populate("product", "productName");

    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Policy not found" });
    }

    // 2. Read required fields
    const department = (
      policy.insDepartment?.insDepartment || ""
    ).toLowerCase();
    const product = (policy.product?.productName || "").toLowerCase();
    const policyType = policy.insDepartment?.insDepartment || "Insurance";
    const policyNumber = policy.policyNumber || "N/A";
    const vehicleNumber = policy.vehicleNumber || "";
    const mobile = policy.mobile;

    // DEBUG — remove after testing
    console.log("DEBUG department:", department);
    console.log("DEBUG product:", product);
    console.log("DEBUG vehicleNumber:", vehicleNumber);
    console.log("DEBUG mobile:", mobile);

    // Use renewalDate first, fall back to endDate, tpEndDate, odEndDate
    const renewalDate =
      policy.renewalDate ||
      policy.endDate ||
      policy.tpEndDate ||
      policy.odEndDate;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "No mobile number found for this policy",
      });
    }

    if (!renewalDate) {
      return res.status(400).json({
        success: false,
        message: "No renewal/end date found for this policy",
      });
    }

    // 3. Format renewal date as DD/MM/YYYY
    const dateObj = new Date(renewalDate);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;

    // 4. Determine due vs overdue (reminder)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    const isOverdue = today > dateObj;

    // 5. Detect category based on department name + product name + vehicle number
    // Motor department = Private Car or Other Vehicle
    const isMotorDept =
      department.includes("motor") || department.includes("vehicle");
    const isMediclaim =
      department.includes("health") ||
      department.includes("mediclaim") ||
      department.includes("medical");

    // Private Car: motor dept + product explicitly says "private car" or "private"
    // Other Vehicle: motor dept + product says two wheeler/commercial/bike/truck OR just any motor without "private"
    const isPrivateCar =
      isMotorDept &&
      vehicleNumber &&
      (product.includes("private car") ||
        product.includes("private") ||
        product === "") && // if no product set, assume private car for motor dept
      !product.includes("two wheeler") &&
      !product.includes("commercial") &&
      !product.includes("bike") &&
      !product.includes("truck") &&
      !product.includes("bus") &&
      !product.includes("cv");

    const isOtherVehicle = isMotorDept && vehicleNumber && !isPrivateCar;

    let message;
    let templateId;
    let category;

    if (isPrivateCar && vehicleNumber) {
      category = "PRIVATE_CAR";
      if (isOverdue) {
        // Reminder — 1707171154535303724
        templateId = process.env.COMMNEST_TPL_PRIVATE_CAR_REMINDER;
        message =
          "Reminder\n" +
          "Dear Sir / Madam\n" +
          `Your Private Car Policy No ${policyNumber} for vehicle No ${vehicleNumber} is due for Renewal on ${formattedDate} which has not yet been renewed as per our records.\n` +
          "Please renew it immediately\n" +
          "Contact us\n" +
          "7507553335, 7757825335\n" +
          "If policy renewed, please ignore the message.\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      } else {
        // Due — 1707171154526920734
        templateId = process.env.COMMNEST_TPL_PRIVATE_CAR_DUE;
        message =
          "Dear Sir / Madam\n" +
          `Your Private Car Policy No ${policyNumber} for vehicle No ${vehicleNumber} is due for Renewal on ${formattedDate}\n` +
          "Kindly renew the policy before expiry for continuous coverage\n" +
          "Please don't hesitate to contact us\n" +
          "7507553335, 7757825335\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      }
    } else if (isMediclaim) {
      category = "MEDICLAIM";
      if (isOverdue) {
        // Reminder — 1707171154539354305
        templateId = process.env.COMMNEST_TPL_MEDICLAIM_REMINDER;
        message =
          "Reminder\n" +
          "Dear Sir / Madam\n" +
          `Your Mediclaim Policy No ${policyNumber} due for Renewal on ${formattedDate} which has not yet been renewed as per our records.\n` +
          "Please renew it immediately\n" +
          "Contact us\n" +
          "7507553335, 7757825335\n" +
          "If policy renewed, please ignore the message.\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      } else {
        // Due — 1707171154531182881
        templateId = process.env.COMMNEST_TPL_MEDICLAIM_DUE;
        message =
          "Dear Sir / Madam\n" +
          `Your Mediclaim Policy No ${policyNumber} is due for Renewal on ${formattedDate}\n` +
          "Kindly renew the policy before expiry for continuous coverage\n" +
          "Please don't hesitate to contact us\n" +
          "7507553335, 7757825335\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      }
    } else if (isOtherVehicle) {
      category = "VEHICLE";
      if (isOverdue) {
        // Reminder — 1707171229478113200
        templateId = process.env.COMMNEST_TPL_VEHICLE_REMINDER;
        message =
          "Dear Sir / Madam\n" +
          `Your Vehicle Policy No ${policyNumber} for vehicle No ${vehicleNumber} is due for Renewal on ${formattedDate} which has not yet been renewed as per our records.\n` +
          "Please renew it immediately\n" +
          "Contact us\n" +
          "7507553335, 7757825335\n" +
          "If policy renewed, please ignore the message.\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      } else {
        // Due — 1707171229475133470
        templateId = process.env.COMMNEST_TPL_VEHICLE_DUE;
        message =
          "Dear Sir / Madam\n" +
          `Your Vehicle Policy No ${policyNumber} for vehicle No ${vehicleNumber} is due for Renewal on ${formattedDate}\n` +
          "Kindly renew the policy before expiry for continuous coverage\n" +
          "Please don't hesitate to contact us\n" +
          "7507553335, 7757825335\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      }
    } else {
      // Generic — Fire, Marine, Liability, or Motor without vehicle number
      category = "GENERIC";
      if (isOverdue) {
        // Reminder — 1707171229847086671
        // Note: This template has only 2 vars — combine policyType + policyNo into first var
        const policyDescription = `${policyType} Policy No ${policyNumber}`;
        templateId = process.env.COMMNEST_TPL_GENERIC_REMINDER;
        message =
          "Dear Sir / Madam\n" +
          `Your ${policyDescription} is due for Renewal on ${formattedDate} which has not yet been renewed as per our records. Please renew it immediately\n` +
          "Contact us\n" +
          "7507553335, 7757825335 \n" +
          "If policy renewed, please ignore the message.\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      } else {
        // Due — 1707171229481145664  (3 vars: policyType, policyNo, renewalDate)
        templateId = process.env.COMMNEST_TPL_GENERIC_DUE;
        message =
          "Dear Sir / Madam\n" +
          `Your ${policyType} Policy No ${policyNumber} is due for Renewal on ${formattedDate}\n` +
          "Kindly renew the policy before expiry for continuous coverage\n" +
          "Please don't hesitate to contact us\n" +
          "7507553335, 7757825335\n" +
          "Regards\n" +
          "Nitin Jeswani\n" +
          "JP Insurance Brokers";
      }
    }

    console.log("Sending SMS to:", mobile);
    console.log(
      "Category:",
      category,
      "| Status:",
      isOverdue ? "OVERDUE/REMINDER" : "DUE",
    );
    console.log("Template ID:", templateId);
    console.log("Message:", message);

    // Sanitize env vars — strip accidental quotes/spaces from .env
    const cleanEnv = (val) => (val || "").trim().replace(/['"]/g, "");

    const apiKey = cleanEnv(process.env.COMMNEST_API_KEY);
    const route = cleanEnv(process.env.COMMNEST_ROUTE);
    const sender = cleanEnv(process.env.COMMNEST_SENDER);
    const cleanTemplateId = cleanEnv(templateId);

    if (!cleanTemplateId) {
      console.error(
        "ERROR: templateId is empty/undefined. Check .env on server.",
      );
      return res.status(500).json({
        success: false,
        message: "SMS template not configured. Check server .env file.",
      });
    }

    // 6. Call CommNest API
    const smsResponse = await axios.get(
      "https://commnestsms.com/api/push.json",
      {
        params: {
          apikey: apiKey,
          route: route,
          sender: sender,
          mobileno: mobile,
          text: message,
          templateid: cleanTemplateId,
        },
        timeout: 10000, // 10 second timeout for live servers
        validateStatus: () => true,
      },
    );

    console.log("SMS API status:", smsResponse.status);
    console.log("SMS API response:", JSON.stringify(smsResponse.data));
    console.log(
      "Params sent:",
      JSON.stringify({
        apikey: apiKey ? "***" : "MISSING",
        route: route || "MISSING",
        sender: sender || "MISSING",
        mobileno: mobile || "MISSING",
        templateid: cleanTemplateId || "MISSING",
        textLength: message?.length || 0,
      }),
    );

    // Check if SMS was sent successfully
    if (smsResponse.status >= 200 && smsResponse.status < 300) {
      // Increment reminderCount and save
      policy.reminderCount = (policy.reminderCount || 0) + 1;
      await policy.save();

      console.log("Reminder sent successfully. Count:", policy.reminderCount);

      return res.status(200).json({
        success: true,
        message: "Reminder sent successfully",
        reminderCount: policy.reminderCount,
        messageType: isOverdue ? "overdue" : "due",
      });
    } else {
      console.error(
        "SMS API returned error:",
        smsResponse.status,
        smsResponse.data,
      );
      return res.status(500).json({
        success: false,
        message: `SMS API returned status ${smsResponse.status}`,
        apiResponse: smsResponse.data,
      });
    }
  } catch (error) {
    console.error("Error in sendReminder:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send reminder",
      error: error.message,
    });
  }
};

module.exports = {
  getPolicyDetail,
  postPolicyDetail,
  getPolicyDetailById,
  updatePolicyDetail,
  deletePolicyDetail,
  getPolicyDetailsDateFrom,
  getPolicyCount,
  getPolicyDetailByFY,
  importCsv,
  exportCsv,
  sendReminder,
  getPolicyDetailByPolicyNumber,
  getInsurerHistory,
  getCustomerHistory,
};
