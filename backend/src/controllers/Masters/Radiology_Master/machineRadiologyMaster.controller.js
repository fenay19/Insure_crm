const mongoose = require('mongoose');
const httpStatus = require("http-status");
const { MachineRadiologyMasterModel } = require('../../../models');

const addMachine = async (req, res) => {
    try {
        const machine = req.body;
        const {serialNumber} = req.body;

        if (!machine) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        const existingMachine = await MachineRadiologyMasterModel.findOne({ serialNumber, delete:false });
        if (existingMachine) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Serial number already exists' });
        }

        const session = await mongoose.startSession()
        await session.withTransaction(async () => {
            const newMachine = new MachineRadiologyMasterModel(req.body);
            await newMachine.save();
            res.status(httpStatus.CREATED).json({ msg: "New machine added successfully", newMachine });
        })

    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

const editMachine = async (req, res) => {
    try {
        const { id } = req.params
        const {serialNumber } = req.body;
        const existingMachine = await MachineRadiologyMasterModel.findOne({ serialNumber, delete:false });
        if (existingMachine && existingMachine._id.toString() !== id ) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Serial number already exists' });
        }

        const machine = await MachineRadiologyMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });

        if (!machine) {
            return res.status(400).json({ msg: "Machine not found" });
        }
        await machine.save();
        return res.status(httpStatus.OK).json({ msg: "Machine updated successfully", machine })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

const deleteMachine = async (req, res) => {
    try {
        const { id } = req.params
        const machine = await MachineRadiologyMasterModel.findByIdAndUpdate({ _id: id }, { delete: true, deletedAt: Date.now() }, { new: true });
        if (!machine) {
            return res.status(400).json({ msg: "Machine not found" });
        }
        await machine.save();
        return res.status(httpStatus.OK).json({ msg: "Machine deleted successfully" });
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

const getAllMachine = async (req, res) => {
    try {
        const machines = await MachineRadiologyMasterModel.find({ delete: false });
        if (!machines) {
            return res.status(500).json({ err: "Error in finding machines" })
        }
        return res.status(httpStatus.OK).json({ msg: "All machines found successfully", machineCount: machines.length, machines })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

const getSingleMachine = async (req, res) => {
    try {
        const { id } = req.params
        const machine = await MachineRadiologyMasterModel.findById({ _id: id });
        if (!machine) {
            return res.status(500).json({ err: "Error in finding machine" })
        }
        return res.status(httpStatus.OK).json({ msg: "Machine found successfully", machine })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}


const bulkImport = async (req, res) => {
    try {  
        const machine = req.body;
        const result = await MachineRadiologyMasterModel.insertMany(machine);
        res.status(httpStatus.CREATED).json({ msg: "Machine Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addMachine,
    editMachine,
    deleteMachine,
    getAllMachine,
    getSingleMachine,
    bulkImport
}