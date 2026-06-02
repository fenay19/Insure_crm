const httpStatus = require('http-status');
const EmergencyPatientFollowUpModel = require("../../../models/Emergency/Patient/emergency_patient_followUp.model");

const createPatientFollowUp = async (req, res) => {
    try{
        const PatientFollowUp = new EmergencyPatientFollowUpModel({...req.body});
        const savedPatientFollowUp = await PatientFollowUp.save();
        res.status(httpStatus.OK).json({msg:"Emergency Patient Follow Up Created Successfuly", data: savedPatientFollowUp});
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const updatePatientFollowUp = async (req, res) => {
    try{
        const { id } = req.params;
        const PatientFollowUp = await EmergencyPatientFollowUpModel.findById(id);
        if(!PatientFollowUp){
            return res.status(httpStatus.NOT_FOUND).json({msg:"Emergency Patient Follow up not found"});
        }
        const updatedPatientFollowUp = await EmergencyPatientFollowUpModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(httpStatus.OK).json({msg:"Emergency Patient Follow up Updated Successfuly", data: updatedPatientFollowUp});
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const getAllPatientFollowUp = async (req, res) => {
    try{
        const { id } = req.params;
        const PatientFollowUp = await EmergencyPatientFollowUpModel.find({patientId:id});
        res.status(httpStatus.OK).json({msg:"Emergency Patient details found", data:PatientFollowUp});
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg:"Internal server error"});
    }
};

module.exports = {
    createPatientFollowUp,
    updatePatientFollowUp,
    getAllPatientFollowUp
}