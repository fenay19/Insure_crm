const { PatientModel } = require('../../models');
const { patientDetailsModel } = require('../../models');
const httpStatus = require('http-status');

const createPatient = async (req, res) => {
    try {  
        const userId = req.user.adminId;
        console.log(userId);
        req.body.user = userId;
        const newPatient = new PatientModel(req.body);
        await newPatient.save();
        res.status(httpStatus.CREATED).json({ msg: "Patient Registered", data: newPatient });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const allPatients = await PatientModel.find({ delete: false, user:userId });
        res.status(httpStatus.OK).json({ data: allPatients });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    

    try {
        const newPatient = await PatientModel.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        }); 
        console.log(req.body);
        if (!newPatient) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Patient not found!!' });
        }
        res.status(httpStatus.OK).json({ msg: "Patient Details Updated!!", data: newPatient });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const newPatient = await PatientModel.findByIdAndUpdate({ _id: id }, {$set:{is_provisional:false}},{ ...req.body, delete: false, deletedAt: Date.now() });
        if (!newPatient) {
            const details  = await patientDetailsModel.findByIdAndUpdate(
            {_id:id, delete:false},
            {$set:{is_provisional:false}},
            {new:true}
            );
            if(!details){
                return res.status(httpStatus.NOT_FOUND).json({ error: 'Patient not found' });
            }
        }
        res.status(httpStatus.OK).json({ msg: "Patient Details Deleted!!", data: newPatient });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getPatientById = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.adminId;
        const newPatient = await PatientModel.findById({_id:id, user:userId});
        if (!newPatient || newPatient.delete === true) {
        return res.status(httpStatus.NOT_FOUND).json({ error: 'Patient not found' });
        }
        res.status(httpStatus.OK).json({ data: newPatient });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
}