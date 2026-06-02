const express = require("express");
const multer = require("multer");
const pdfController = require("../../controllers/pdfExtraction.controller");

const router = express.Router();

// Use memory storage so the PDF buffer is available as req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

router.post("/extract-pdf", upload.single("pdf"), pdfController.extractPdf);

module.exports = router;
