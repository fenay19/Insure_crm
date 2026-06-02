const httpStatus = require('http-status');
const {PatientPresentIllnessHistoryModel, PresentIllnessHistoryModel} = require("../../../models");

const createPatientPresentIllnessHistory = async (req, res) =>  {
 try{
    const PresentIllnessHistory = new PatientPresentIllnessHistoryModel({...req.body});
    const PresentIllnessHistoryIds = PresentIllnessHistory.presentIllness.map(complaint => complaint._id);
    const PresentIllnessHistorys = await PresentIllnessHistoryModel.find({_id: { $in: PresentIllnessHistoryIds }});
    PresentIllnessHistorys.forEach(problem => {
        const PresentIllnessHistorys = PresentIllnessHistory.presentIllness.find(p => p._id === problem._id.toString());
        if (PresentIllnessHistorys) {
            problem.count = (problem.count || 0) + 1;
        }
    });
    await Promise.all(PresentIllnessHistorys.map(problem => problem.save()),);
    const savedPatientPresentIllnessHistory = await PresentIllnessHistory.save();
    res.status(httpStatus.OK).json({msg:"Patient Present Illness History Created Successfuly", data: savedPatientPresentIllnessHistory});
 }catch(error){
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
 }
};

const updatePatientPresentIllnessHistory = async (req, res) => {
    try{
        const { id } = req.params;
        const patientPresentIllnessHistory = await PatientPresentIllnessHistoryModel.findById(id);
        if(!patientPresentIllnessHistory){
            return res.status(httpStatus.NOT_FOUND).json({msg:"Patient Present Illness History not found"});
        }
        const PresentIllnessHistoryIds = patientPresentIllnessHistory.presentIllness.map(complaint => complaint._id);
        const PresentIllnessHistorys = await PresentIllnessHistoryModel.find({_id: { $in: PresentIllnessHistoryIds }});
        PresentIllnessHistorys.forEach(problem => {
            const PresentIllnessHistorys = patientPresentIllnessHistory.presentIllness.find(p => p._id === problem._id.toString());
            if (PresentIllnessHistorys) {
                problem.count = (problem.count || 0) + 1;
            }
        });
        await Promise.all(PresentIllnessHistorys.map(problem => problem.save()),);
        const updatedPatientPresentIllnessHistory = await PatientPresentIllnessHistoryModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(httpStatus.OK).json({msg:"Patient Present Illness History Updated Successfuly", data: updatedPatientPresentIllnessHistory});
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllPatientPresentIllnessHistory = async (req, res) => {
    try{
        const { id } = req.params;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const patientPresentIllnessHistory = await PatientPresentIllnessHistoryModel.find({patientId:id, createdAt: { $gte: currentDate }, });
        res.status(httpStatus.OK).json({msg:"Patient details found", data:patientPresentIllnessHistory});
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg:"Internal server error"});
    }
};


module.exports  = {
    createPatientPresentIllnessHistory,
    updatePatientPresentIllnessHistory,
    getAllPatientPresentIllnessHistory
}
 