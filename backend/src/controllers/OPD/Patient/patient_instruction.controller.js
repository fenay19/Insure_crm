const httpStatus = require("http-status");
const {PatientInstructionModel, InstructionModel} = require("../../../models");

const createPatientInstruction = async (req, res) => {
    try {
        const PatientInstruction = new PatientInstructionModel({ ...req.body });
        const instructionIds = PatientInstruction.instruction.map(instruction => instruction._id);
        const instruction = await InstructionModel.find({ _id: { $in: instructionIds } });
        instruction.forEach(problem => {
            const instruction = PatientInstruction.instruction.find(p => p._id === problem._id.toString());
            if (instruction) {
                problem.count = (problem.count || 0) + 1;
            }
        });
        await Promise.all(instruction.map(problem => problem.save()));
        const savedPatientInstructionAdvice = await PatientInstruction.save();
        res.status(httpStatus.OK).json({ msg: "Patient Instruction Created Successfuly", data: savedPatientInstructionAdvice });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const updatePatientInstruction = async (req, res) => {
    try{
        const { id } = req.params;
        const patientInstruction = await PatientInstructionModel.findById(id);
        if (!patientInstruction) {
            res.status(httpStatus.NOT_FOUND).json({ msg: "Patient Instruction not found" });
        }
        const instructionIds = patientInstruction.instruction.map(instruction => instruction._id);
        const instruction = await InstructionModel.find({ _id: { $in: instructionIds } });
        instruction.forEach(problem => {
            const instruction = patientInstruction.instruction.find(p => p._id === problem._id.toString());
            if (instruction) {
                problem.count = (problem.count || 0) + 1;
            }
        });
        await Promise.all(instruction.map(problem => problem.save()));
        const updatedPatientInstruction = await PatientInstructionModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(httpStatus.OK).json({ msg: "Patient Instruction Updated Successfuly", data: updatedPatientInstruction });
    }catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllPatientInstruction = async (req, res) => {
    try {
        const { id } = req.params;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const patientInstruction = await PatientInstructionModel.find({ patientId: id, createdAt: { $gte: currentDate }, });
        res.status(httpStatus.OK).json({ msg: "Patient details found", data: patientInstruction });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
};


module.exports = {
    createPatientInstruction,
    updatePatientInstruction,
    getAllPatientInstruction
}
