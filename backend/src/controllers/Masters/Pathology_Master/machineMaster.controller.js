// const { validationResult } = require('express-validator');
const { MachineMasterModel } = require('../../../models');
const mongoose = require('mongoose');
const httpStatus = require("http-status")

const createMachine = async (req, res) => {
    try {
        const machine = req.body;
        const {serialNumber} = req.body;

        if (!machine) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        const existingMachine = await MachineMasterModel.findOne({ serialNumber, delete:false });
        if (existingMachine) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Serial number already exists' });
        }

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const machine = new MachineMasterModel(req.body);
            await machine.save();
            res.status(httpStatus.CREATED).json({ msg: "Machine Created", data: machine });
        });
        session.endSession()
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMachine = async (req, res) => {
    try {
        const machines = await MachineMasterModel.find({ delete: false });
        res.json({ data: machines });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMachineById = async (req, res) => {
    try {
        const { id } = req.params
        const machine = await MachineMasterModel.findById({ _id: id });
        if (!machine || machine.delete === true) return res.status(httpStatus.NOT_FOUND).json({ error: 'Store not found' });
        res.json({ data: machine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMachineById = async (req, res) => {
    try {
        const { id } = req.params
        const {serialNumber } = req.body;
        const existingMachine = await MachineMasterModel.findOne({ serialNumber, delete:false });
        if (existingMachine && existingMachine._id.toString() !== id ) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Serial number already exists' });
        }

        const machine = await MachineMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });

        if (!machine) {
            return res.status(400).json({ msg: "Machine not found" });
        }
        await machine.save();
        return res.status(httpStatus.OK).json({ msg: "Machine updated successfully", machine })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
};

const deleteMachineById = async (req, res) => {
    try {
        const { id } = req.params
        const machine = await MachineMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true });
        if (!machine) return res.status(httpStatus.NOT_FOUND).json({ error: 'Store not found' });
        res.json({ msg: 'Store deleted successfully', data: machine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const bulkImport = async (req, res) => {
    try {  
        const MachineData = req.body;
        const result = await MachineMasterModel.insertMany(MachineData);
        res.status(httpStatus.CREATED).json({ msg: "Machine Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createMachine,
    getAllMachine,
    getMachineById,
    updateMachineById,
    deleteMachineById,
    bulkImport
}