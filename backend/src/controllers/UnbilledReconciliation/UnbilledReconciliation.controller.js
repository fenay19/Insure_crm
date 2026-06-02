const policyDetailModel = require("../../models/PolicyManagement/PolicyDetails.model");

// ─── GET /  →  Fetch unbilled policies for the left-side table ───────────────
const getUnbilledPolicies = async (req, res) => {
    try {
        const { month, year, companyId, noDate } = req.query;

        // Exclude any policy explicitly marked as billed
        const query = { billingStatus: { $ne: "billed" } };

        // Filter by company (tenant isolation)
        if (companyId) {
            const mongoose = require("mongoose");
            if (mongoose.Types.ObjectId.isValid(companyId)) {
                query.companyId = new mongoose.Types.ObjectId(companyId);
            }
        }

        if (noDate === "true") {
            // Special filter: only policies with no start date
            query.$or = [{ startDate: null }, { startDate: { $exists: false } }];
        } else if (month && year) {
            const m = parseInt(month, 10);
            const y = parseInt(year, 10);
            query.startDate = { $gte: new Date(Date.UTC(y, m - 1, 1)), $lt: new Date(Date.UTC(y, m, 1)) };
        } else if (year) {
            const y = parseInt(year, 10);
            query.startDate = { $gte: new Date(Date.UTC(y, 0, 1)), $lt: new Date(Date.UTC(y + 1, 0, 1)) };
        }
        // else: no filter → return all unbilled

        console.log("[getUnbilledPolicies] query:", JSON.stringify(query));

        const policies = await policyDetailModel
            .find(query)
            .populate("insCompany")
            .sort({ createdAt: -1 })
            .lean();

        console.log(`[getUnbilledPolicies] returned ${policies.length} policies`);

        const data = policies.map((p) => ({
            _id: p._id,
            companyName: p.insCompany?.insCompany || p.insurerName || "—",
            policyNumber: p.policyNumber || "—",
            brokerageAmount: p.totalBrokerageAmountincGst ?? "—",
            startDate: p.startDate || null,
            endDate: p.endDate || null,
            billingStatus: p.billingStatus || "unbilled",
        }));

        // Always return how many unbilled policies have no startDate — the UI
        // shows this as a badge so users know undated policies exist
        const nullDateCountQuery = { billingStatus: { $ne: "billed" }, $or: [{ startDate: null }, { startDate: { $exists: false } }] };
        if (companyId) {
            const mongoose = require("mongoose");
            if (mongoose.Types.ObjectId.isValid(companyId)) {
                nullDateCountQuery.companyId = new mongoose.Types.ObjectId(companyId);
            }
        }
        const nullDateCount = await policyDetailModel.countDocuments(nullDateCountQuery);

        return res.status(200).json({ success: true, count: data.length, nullDateCount, data });
    } catch (error) {
        console.error("getUnbilledPolicies error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET /billed  →  Fetch billed policies grouped by company ────────────────
const getBilledPolicies = async (req, res) => {
    try {
        const policies = await policyDetailModel
            .find({ billingStatus: "billed" })
            .populate("insCompany")
            .sort({ createdAt: -1 })
            .lean();

        // Helper to safely parse a number
        const safeNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

        // Helper to get company display name
        const getCompanyName = (p) => p.insCompany?.insCompany || p.insurerName || "Unknown";

        // Group by company
        const companyMap = {};
        for (const p of policies) {
            const company = getCompanyName(p);
            if (!companyMap[company]) {
                companyMap[company] = { companyName: company, totalPolicies: 0, totalBrokerage: 0 };
            }
            companyMap[company].totalPolicies += 1;
            companyMap[company].totalBrokerage += safeNum(p.totalBrokerageAmountincGst);
        }

        const grouped = Object.values(companyMap).sort((a, b) =>
            a.companyName.localeCompare(b.companyName)
        );

        return res.status(200).json({
            success: true,
            totalBilledPolicies: policies.length,
            data: grouped,
        });
    } catch (error) {
        console.error("getBilledPolicies error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Helpers for PDF text parsing ────────────────────────────────────────────
function parseBrokerageRows(text) {
    const rows = [];
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const policyNoPattern = /[A-Z0-9]{2,}[\/-][A-Z0-9\/-]+/;
    const datePattern = /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/g;

    for (const line of lines) {
        const policyMatch = line.match(policyNoPattern);
        if (!policyMatch) continue;

        const policyNumber = policyMatch[0].trim();
        const dates = line.match(datePattern) || [];
        const idx = line.indexOf(policyNumber);
        let companyName = line.substring(0, idx).trim();
        companyName = companyName.replace(/[\|\t,]+$/, "").trim();

        rows.push({
            companyName: companyName || "—",
            policyNumber,
            startDate: dates[0] || null,
            endDate: dates[1] || null,
        });
    }
    return rows;
}

// ─── POST /reconcile  →  Upload PDF/Excel, parse, match against DB ───────────
const reconcileFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let extractedRows = [];
        const mime = req.file.mimetype;

        // ── Excel / CSV ──
        if (
            mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mime === "application/vnd.ms-excel" ||
            mime === "text/csv"
        ) {
            const XLSX = require("xlsx");
            const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

            if (rows.length === 0) {
                return res.status(200).json({ success: true, message: "No data rows.", results: [] });
            }

            const headers = Object.keys(rows[0]);
            const find = (keywords) =>
                headers.find((h) => {
                    const low = h.toLowerCase();
                    return keywords.some((k) => low.includes(k));
                }) || null;

            const colCompany = find(["company", "insurer", "name"]);
            const colPolicy = find(["policy", "number", "policyno", "policy_no", "policynumber"]);
            const colStart = find(["start", "from", "inception", "begin"]);
            const colEnd = find(["end", "expiry", "to", "maturity"]);

            for (const row of rows) {
                const policyNumber = colPolicy ? String(row[colPolicy]).trim() : "";
                if (!policyNumber) continue;

                extractedRows.push({
                    companyName: colCompany ? String(row[colCompany]).trim() : "—",
                    policyNumber,
                    startDate: colStart ? String(row[colStart]).trim() || null : null,
                    endDate: colEnd ? String(row[colEnd]).trim() || null : null,
                });
            }
            // ── PDF ──
        } else {
            const pdfParse = require("pdf-parse");
            const data = await pdfParse(req.file.buffer);
            extractedRows = parseBrokerageRows(data.text);
        }

        if (extractedRows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Could not extract structured data from the file.",
                results: [],
            });
        }

        // ── Detect intra-document duplicates first ──
        // Track policy numbers already seen in this uploaded file.
        // First occurrence gets normal processing; subsequent ones become "Duplicate".
        const seenInDoc = new Set();

        // ── Match against DB (policyNumber only) ──
        // Fetch ALL policies with these numbers so we can distinguish
        // unbilled (→ Matched) vs already-billed (→ Already Billed) vs missing (→ Not Found)
        const policyNumbers = [...new Set(extractedRows.map((r) => r.policyNumber))];

        const dbPolicies = await policyDetailModel
            .find({ policyNumber: { $in: policyNumbers } })
            .populate("insCompany")
            .lean();

        const dbMap = {};
        for (const p of dbPolicies) {
            if (p.policyNumber) dbMap[p.policyNumber] = p;
        }

        const results = extractedRows.map((row) => {
            // ── Duplicate within the uploaded file itself ──
            if (seenInDoc.has(row.policyNumber)) {
                return {
                    ...row,
                    matchStatus: "Duplicate",
                    dbPolicyId: null,
                    duplicateNote: "This policy number appears more than once in the uploaded file.",
                };
            }
            seenInDoc.add(row.policyNumber);

            const dbPolicy = dbMap[row.policyNumber];
            if (!dbPolicy) {
                return { ...row, matchStatus: "Not Found", dbPolicyId: null };
            }
            // If this policy is already billed, don't allow re-processing
            if (dbPolicy.billingStatus === "billed") {
                return {
                    ...row,
                    matchStatus: "Already Billed",
                    dbPolicyId: dbPolicy._id,
                    dbCompanyName: dbPolicy.insCompany?.insCompany || dbPolicy.insurerName || "—",
                    dbStartDate: dbPolicy.startDate || null,
                    dbEndDate: dbPolicy.endDate || null,
                    dbBrokerageAmount: dbPolicy.totalBrokerageAmountincGst ?? "—",
                };
            }
            return {
                ...row,
                matchStatus: "Matched",
                dbPolicyId: dbPolicy._id,
                dbCompanyName: dbPolicy.insCompany?.insCompany || dbPolicy.insurerName || "—",
                dbStartDate: dbPolicy.startDate || null,
                dbEndDate: dbPolicy.endDate || null,
                dbBrokerageAmount: dbPolicy.totalBrokerageAmountincGst ?? "—",
            };
        });

        const duplicates = results.filter((r) => r.matchStatus === "Duplicate").length;
        const matched = results.filter((r) => r.matchStatus === "Matched").length;
        const alreadyBilled = results.filter((r) => r.matchStatus === "Already Billed").length;
        const notFound = results.filter((r) => r.matchStatus === "Not Found").length;

        // total excludes duplicates so it matches the unique billable count
        return res.status(200).json({
            success: true,
            summary: {
                total: results.length - duplicates,   // unique policies only
                totalRaw: results.length,              // raw row count (for reference)
                matched,
                alreadyBilled,
                notFound,
                duplicates,
            },
            results,
        });
    } catch (error) {
        console.error("reconcileFile error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── POST /mark-billed  →  Mark matched policies as billed ──────────────────
const markAsBilled = async (req, res) => {
    try {
        const { policyIds } = req.body;
        console.log(`[markAsBilled] received ${policyIds?.length} IDs`);

        if (!policyIds || !Array.isArray(policyIds) || policyIds.length === 0) {
            return res.status(400).json({ success: false, message: "No policy IDs provided" });
        }

        // Explicitly convert string IDs to ObjectId to guarantee MongoDB matches them
        const mongoose = require("mongoose");
        const objectIds = policyIds
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        console.log(`[markAsBilled] valid ObjectIds: ${objectIds.length} / ${policyIds.length}`);

        if (objectIds.length === 0) {
            return res.status(400).json({ success: false, message: "No valid policy IDs provided" });
        }

        // Check current state before update
        const beforeCount = await policyDetailModel.countDocuments({ _id: { $in: objectIds } });
        console.log(`[markAsBilled] found ${beforeCount} matching policies in DB`);

        // Update unconditionally (idempotent — setting billed on already-billed is safe)
        const result = await policyDetailModel.updateMany(
            { _id: { $in: objectIds } },
            { $set: { billingStatus: "billed", billedAt: new Date() } }
        );

        console.log(`[markAsBilled] modifiedCount: ${result.modifiedCount}, matchedCount: ${result.matchedCount}`);

        return res.status(200).json({
            success: true,
            message: `${result.modifiedCount} policies marked as billed.`,
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount,
        });
    } catch (error) {
        console.error("markAsBilled error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── POST /generate-invoice  →  Tax Invoice for a single company ─────────────
const generateInvoice = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({ success: false, message: "Company name is required" });
        }

        // Find all billed policies for this company
        const policies = await policyDetailModel
            .find({ billingStatus: "billed" })
            .populate("insCompany")
            .lean();

        // Filter by company name
        const companyPolicies = policies.filter((p) => {
            const name = p.insCompany?.insCompany || p.insurerName || "Unknown";
            return name === companyName;
        });

        const totalPolicies = companyPolicies.length;

        // Helper to safely parse a number
        const safeNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

        // Sum pre-GST brokerage (totalBrokerageAmount) and full brokerage (totalBrokerageAmountincGst)
        const taxableAmount = companyPolicies.reduce(
            (sum, p) => sum + safeNum(p.totalBrokerageAmount), 0
        );
        const totalBrokerage = companyPolicies.reduce(
            (sum, p) => sum + safeNum(p.totalBrokerageAmountincGst), 0
        );

        // GST breakdown
        const igst = Math.round(taxableAmount * 0.18 * 100) / 100;
        const cgst = Math.round(taxableAmount * 0.09 * 100) / 100;
        const sgst = Math.round(taxableAmount * 0.09 * 100) / 100;
        const grandTotal = Math.round((taxableAmount + igst) * 100) / 100;

        // Auto-increment invoice number (simple count-based)
        const InvoiceNoModel = require("../../models/InvoiceNumber/invoiceNo.model");
        const lastInvoice = await InvoiceNoModel.findOne().sort({ createdAt: -1 });
        const lastNo = lastInvoice ? parseInt(lastInvoice.invoiceNo, 10) || 0 : 0;
        const newInvoiceNo = String(lastNo + 1).padStart(4, "0");
        await InvoiceNoModel.create({ invoiceNo: newInvoiceNo });

        // Get billed-to details from first policy (GST No, etc.)
        const firstPolicy = companyPolicies[0] || {};

        const now = new Date();
        const invoiceDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

        // Calculate billing period based on all possible policy start and end dates
        let minDate = null;
        let maxDate = null;

        companyPolicies.forEach(p => {
            // Check all potential start dates
            const startFields = [p.startDate, p.tpStartDate, p.odStartDate, p.issueDate];
            startFields.forEach(field => {
                if (field) {
                    const d = new Date(field);
                    if (!isNaN(d)) {
                        if (!minDate || d < minDate) minDate = d;
                        if (!maxDate || d > maxDate) maxDate = d; // Use start as max fallback
                    }
                }
            });

            // Check all potential end dates
            const endFields = [p.endDate, p.tpEndDate, p.odEndDate];
            endFields.forEach(field => {
                if (field) {
                    const d = new Date(field);
                    if (!isNaN(d)) {
                        if (!maxDate || d > maxDate) maxDate = d;
                    }
                }
            });
        });

        let monthName;
        if (minDate && maxDate) {
            const minMonthYear = minDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
            const maxMonthYear = maxDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
            monthName = minMonthYear === maxMonthYear ? minMonthYear : `${minMonthYear} to ${maxMonthYear}`;
        } else {
            // Fallback to current month if dates are invalid
            monthName = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
        }

        return res.status(200).json({
            success: true,
            invoice: {
                companyName,
                totalPolicies,
                totalBrokerage,
                taxableAmount,
                igst,
                cgst,
                sgst,
                grandTotal,
                invoiceNumber: `JP/${newInvoiceNo}`,
                invoiceDate,
                monthName,
                billedTo: {
                    name: companyName,
                    gstNo: firstPolicy.gstNo || "",
                },
                generatedAt: now.toISOString(),
            },
        });
    } catch (error) {
        console.error("generateInvoice error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUnbilledPolicies,
    getBilledPolicies,
    reconcileFile,
    markAsBilled,
    generateInvoice,
};
