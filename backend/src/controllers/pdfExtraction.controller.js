const pdfParse = require("pdf-parse");

exports.extractPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF file uploaded",
            });
        }

        const fileBuffer = req.file.buffer;
        const data = await pdfParse(fileBuffer);
        const text = data.text;

        res.json({
            success: true,
            text,
        });
    } catch (error) {
        console.error("PDF extraction error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to extract text from PDF",
        });
    }
};
