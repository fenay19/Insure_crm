const express = require("express");
const policyDetailRouter = express.Router();
const { policyDetailControllers } = require("../../controllers/index");
const fs = require("fs");

const { handleToken } = require("../../utils/handleToken");

// below code is responsible for receive csv file.
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
policyDetailRouter.use(bodyParser.urlencoded({ extended: true }));
// policyDetailRouter.use(
//   express.static(path.resolve(__dirname, "./uploadPolicyManagementCsv")),
// );

const uploadDir = path.resolve(__dirname, "uploadPolicyManagementCsv");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploadPolicyManagementCsv");
//   },

//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// let upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB, adjust
  fileFilter: (req, file, cb) => {
    const name = file.originalname.toLowerCase();
    const ok =
      name.endsWith(".csv") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      file.mimetype === "text/csv" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel";

    cb(ok ? null : new Error("Only CSV/XLSX/XLS files are allowed"), ok);
  },
});

//code for receive csv file ends here

// policyDetailRouter.post(
//   "/import-csv",
//   upload.single("file"),
//   policyDetailControllers.importCsv,
// );

// IMPORTANT: add an error-handling middleware for multer errors on this route
policyDetailRouter.post(
  "/import-csv",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  policyDetailControllers.importCsv,
);

policyDetailRouter.get(
  "/by-date",
  policyDetailControllers.getPolicyDetailsDateFrom,
);
policyDetailRouter.get("/export-csv", policyDetailControllers.exportCsv);
policyDetailRouter.get("/", policyDetailControllers.getPolicyDetail);
policyDetailRouter.get("/byFY", policyDetailControllers.getPolicyDetailByFY);
policyDetailRouter.get(
  "/by-policy-number/:policyNumber",
  policyDetailControllers.getPolicyDetailByPolicyNumber,
);
policyDetailRouter.get(
  "/insurer-history",
  policyDetailControllers.getInsurerHistory,
);
policyDetailRouter.get(
  "/customer-history",
  policyDetailControllers.getCustomerHistory,
);
policyDetailRouter.get("/:id", policyDetailControllers.getPolicyDetailById);

policyDetailRouter.get("/count", policyDetailControllers.getPolicyCount);
policyDetailRouter.post("/", policyDetailControllers.postPolicyDetail);
policyDetailRouter.put("/:id", policyDetailControllers.updatePolicyDetail);
policyDetailRouter.delete("/:id", policyDetailControllers.deletePolicyDetail);

// SMS Reminder
policyDetailRouter.post(
  "/send-reminder/:id",
  policyDetailControllers.sendReminder,
);

module.exports = policyDetailRouter;
