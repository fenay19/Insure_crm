const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  CreateRegistrationDetail,
  getAllRegisteration,
  updateRegistation,
  getUhidAndRegNo
} = require("../../controllers/appointment-confirm/ipdPatient.controller");

const IPDPatientRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and PDF are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

IPDPatientRouter.post(
  "/",
  upload.fields([
    { name: "aadhar_card", maxCount: 1 },
    { name: "abha_card", maxCount: 1 },
  ]),
  (req, res, next) => {
    try {
      CreateRegistrationDetail(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

IPDPatientRouter.get("/", getAllRegisteration);
IPDPatientRouter.get("/ipd-uhid-reg", getUhidAndRegNo);


IPDPatientRouter.put(
  "/:id",
  upload.fields([
    { name: "aadhar_card", maxCount: 1 },
    { name: "abha_card", maxCount: 1 },
  ]),
  (req, res, next) => {
    try {
      updateRegistation(req, res, next);
    } catch (error) {
      next(error); 
    }
  }
);

IPDPatientRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

module.exports = IPDPatientRouter;
