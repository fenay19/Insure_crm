const httpStatus = require("http-status");
const { PatientVitalsModel, VitalModel } = require("../../../models");

const createPatientVitals = async (req, res) => {
    try {
        const PatientVitals = new PatientVitalsModel({ ...req.body });
        const savedPatientVitals = await PatientVitals.save();
        res.status(httpStatus.OK).json({ msg: "Patient Vitals Created Successfuly", data: savedPatientVitals });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const getAllPatientVitals = async (req, res) => {
    try {
        const { id } = req.params;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const patientvitals = await PatientVitalsModel.find({ patientId: id, createdAt: { $gte: currentDate }, });
        res.status(httpStatus.OK).json({ msg: "Patient details found", data: patientvitals });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
};

const updatePatientVitals = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedupdatedPatientVitals = await PatientVitalsModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(httpStatus.OK).json({ msg: "Patient vitals updated successfully", data: updatedupdatedPatientVitals });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
  
};

const getDateWisePatientVitals = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;
        const requestedDate = new Date(date);
        const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
        const endOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate(), 23, 59, 59, 999);
        const patientvitals = await PatientVitalsModel.find({ patientId: id, createdAt: { $gte: startOfDay, $lte: endOfDay } });
        res.status(httpStatus.OK).json({ msg: "Patient details found", data: patientvitals });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
};


module.exports = {
    createPatientVitals,
    getAllPatientVitals,
    getDateWisePatientVitals,
    updatePatientVitals
}