const express = require("express");
const multer = require("multer");
const {
    getUnbilledPolicies,
    getBilledPolicies,
    reconcileFile,
    markAsBilled,
    generateInvoice,
} = require("../../controllers/UnbilledReconciliation/UnbilledReconciliation.controller");

const router = express.Router();

const storage = multer.memoryStorage();
const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
];
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and Excel files are allowed"), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 },
});

// GET  /api/unbilledReconciliation           → unbilled policies
router.get("/", getUnbilledPolicies);

// GET  /api/unbilledReconciliation/billed    → billed policies
router.get("/billed", getBilledPolicies);

// POST /api/unbilledReconciliation/reconcile → upload & match
router.post("/reconcile", upload.single("file"), reconcileFile);

// POST /api/unbilledReconciliation/mark-billed → mark as billed
router.post("/mark-billed", markAsBilled);

// POST /api/unbilledReconciliation/generate-invoice → company-wise invoices
router.post("/generate-invoice", generateInvoice);

module.exports = router;
