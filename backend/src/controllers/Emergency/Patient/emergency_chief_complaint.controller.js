const { EmergencyPatientChiefComplaintModel, ChiefComplaintModel } = require('../../../models')

const createEmergencyPatientChiefComplaint = async (req, res) => {
    try {
        const emergencyPatientChiefComplaint = new EmergencyPatientChiefComplaintModel({ ...req.body });

        const chiefComplaintIds = emergencyPatientChiefComplaint.chiefComplaint.map(complaint => complaint._id);

        const [chiefComplaintCountIncrementResult, savedEmergencyPatientChiefComplaint] = await Promise.all([

            //increament count of chief complaint master
            ChiefComplaintModel.updateMany(
                { _id: { $in: chiefComplaintIds } },
                { $inc: { count: 1 } }
            ),

            //saving the data of emergency patient chief complaint
            emergencyPatientChiefComplaint.save()
        ]);

        if (chiefComplaintCountIncrementResult && savedEmergencyPatientChiefComplaint) {
            res.status(200).json({
                msg: "Emergency Patient Chief Complaint Created Successfully",
                data: savedEmergencyPatientChiefComplaint
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            msg: error.message
        });
    }
};



const getEmergencyPatientChiefComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const emergencyPatientChiefComplaint = await EmergencyPatientChiefComplaintModel.find({ patientId: id });


        if (emergencyPatientChiefComplaint.length === 0) {
            return res.status(404).json({
                error: "Not Found",
                msg: `No emergency patient chief complaints found for patient with ID: ${id}`
            });
        }

        res.status(200).json({
            msg: "Emergency Patient Chief Complaints retrieved successfully",
            data: emergencyPatientChiefComplaint
        });

    } catch (error) {
        console.error("Error in getEmergencyPatientChiefComplaint:", error);
        res.status(500).json({
            error: "Internal Server Error",
            msg: error.message
        });
    }
};


const updateEmergencyPatientChiefComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const emergencyPatientChiefComplaint = await EmergencyPatientChiefComplaintModel.findById(id);

        if (!emergencyPatientChiefComplaint) {
            return res.status(404).json({
                error: "Not Found",
                msg: `No emergency patient chief complaints found for patient with ID: ${id}`
            });
        }

        const chiefComplaintIds = emergencyPatientChiefComplaint.chiefComplaint.map(complaint => complaint._id);

        const [chiefComplaintUpdateResult, updatedEmergencyPatientChiefComplaint] = await Promise.all([

            // we are using promise all because we want to make sure that both async operations get fullfilled.

            //increasing the count of chief-complaint master
            ChiefComplaintModel.updateMany(
                { _id: { $in: chiefComplaintIds } },
                { $inc: { count: 1 } }
            ),

            //update the actual EmergencyPatientChiefComplaintModel
            EmergencyPatientChiefComplaintModel.findByIdAndUpdate(
                id,
                { ...req.body },
                { new: true }
            )
        ]);

        if (chiefComplaintUpdateResult && updatedEmergencyPatientChiefComplaint) {
            res.status(200).json({
                msg: "Emergency patient Chief Complaint Updated Successfully",
                data: updatedEmergencyPatientChiefComplaint
            });
        }


    } catch (error) {

        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            msg: error.message
        });
    }
};



module.exports = {
    createEmergencyPatientChiefComplaint,
    getEmergencyPatientChiefComplaint,
    updateEmergencyPatientChiefComplaint,
} 