const httpStatus = require("http-status");
const { SurgeryPackageModel } = require("../../../models");
const EmergencyPatientProcedureModel = require("../../../models/Emergency/Patient/emergency_patient_procedure.model")

const createPatientProcedure = async (req, res) => {
    try {
        const PatientProcedure = new EmergencyPatientProcedureModel({ ...req.body });
        const surgeryPackageIds = PatientProcedure.procedure.map(procedure => procedure._id);
        const surgeryPackage = await SurgeryPackageModel.find({ _id: { $in: surgeryPackageIds } });
        surgeryPackage.forEach(problem => {
            const surgeryPackage = PatientProcedure.procedure.find(p => p._id === problem._id.toString());
            if (surgeryPackage) {
                problem.count = (problem.count || 0) + 1;
            }
        });
        await Promise.all(surgeryPackage.map(problem => problem.save()));
        const savedPatientProcedure = await PatientProcedure.save();
        res.status(httpStatus.OK).json({ msg: "Emergency Patient Procedure Created Successfuly", data: savedPatientProcedure });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const updatePatientProcedure = async (req, res) => {
    try{
        const { id } = req.params;
        const patientProcedure = await EmergencyPatientProcedureModel.findById(id);
        if (!patientProcedure) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: "Emergency Patient Procedure not found" });
        }
        const surgeryPackageIds = patientProcedure.procedure.map(procedure => procedure._id);
        const surgeryPackage = await SurgeryPackageModel.find({ _id: { $in: surgeryPackageIds } });
        surgeryPackage.forEach(problem => {
            const surgeryPackage = patientProcedure.procedure.find(p => p._id === problem._id.toString());
            if (surgeryPackage) {
                problem.count = (problem.count || 0) + 1;
            }
        });
        await Promise.all(surgeryPackage.map(problem => problem.save()));
        const updatedPatientProcedure = await EmergencyPatientProcedureModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(httpStatus.OK).json({ msg: "Emergency Patient Procedure Updated Successfuly", data: updatedPatientProcedure });
    }catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
};

const getAllPatientProcedure = async (req, res) => {
    try {
        const { id } = req.params;
        const patientProcedure = await EmergencyPatientProcedureModel.find({ patientId: id });
        res.status(httpStatus.OK).json({ msg: "Emergency Patient details found", data: patientProcedure });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
};


module.exports = {
    createPatientProcedure,
    updatePatientProcedure,
    getAllPatientProcedure
}

