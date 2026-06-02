const { OtMasterModel, AdminModel } = require('../../models');
const { ConsultantModel, EmployeeModel } = require('../../models');
const { validationResult } = require('express-validator');
const httpStatus = require("http-status");

const createOtMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if(user.role == "admin") {
            const {roomNo} = req.body;
            req.body.user = req.user.branchId;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const existingOtMaster = await OtMasterModel.findOne({ roomNo, delete:false });
            if (existingOtMaster) {
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already Alloted!!' });
            }
    
            const newOtMaster = new OtMasterModel(req.body);
            const savedData = await newOtMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "OT Alloted Successfully!!", data: savedData });
        }else if (user.role == "doctor") {
            const existingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
            const {roomNo} = req.body;
            req.body.user = existingdoctor.basicDetails.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const existingOtMaster = await OtMasterModel.findOne({ roomNo, delete:false });
            if (existingOtMaster) {
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already Alloted!!' });
            }
    
            const newOtMaster = new OtMasterModel(req.body);
            const savedData = await newOtMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "OT Alloted Successfully!!", data: savedData });
        }else if (user.role !== "admin" && user.role!== "doctor") {
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const {roomNo} = req.body;
            req.body.user = existingEmployee.basicDetails.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const existingOtMaster = await OtMasterModel.findOne({ roomNo, delete:false });
            if (existingOtMaster) {
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already Alloted!!' });
            }
    
            const newOtMaster = new OtMasterModel(req.body);
            const savedData = await newOtMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "OT Alloted Successfully!!", data: savedData });
        }
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
        
    }
}

const getAllOtMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if(user.role == "admin") {
            const otMaster = await OtMasterModel.find({ delete: false, user:req.user.branchId });
            res.status(httpStatus.OK).json({ data: otMaster });
        }else if (user.role == "doctor") {
            const existingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
            const otMaster = await OtMasterModel.find({ delete: false, user:existingdoctor.basicDetails.user });
            res.status(httpStatus.OK).json({ data: otMaster });
        }else if (user.role!== "admin" && user.role!== "doctor") {
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const otMaster = await OtMasterModel.find({ delete: false, user:existingEmployee.basicDetails.user });
            res.status(httpStatus.OK).json({ data: otMaster });
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const updatOtMasterById = async (req, res) => {
    try {
        const { id } = req.params;
        const {roomNo} = req.body;

        const existingOtMaster = await OtMasterModel.findOne({ roomNo, delete:false });
        if (existingOtMaster && existingOtMaster._id.toString() !== id) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already Alloted!!' });
        }
        const updatOtMaster = await OtMasterModel.findByIdAndUpdate(
            { _id: id },
            {...req.body},
            { new: true }
        );
        if (!updatOtMaster) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'OT master not found' });
        }
        res.status(httpStatus.OK).json({ msg: "OT Master updated!!", data: updatOtMaster });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const deleteOtMasterById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOtMaster = await OtMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now() });
        if (!deletedOtMaster) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'OT Master not found' });
        }
        res.status(httpStatus.OK).json({ msg: "OT Master Deleted!!" });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
    createOtMaster,
    getAllOtMaster,
    updatOtMasterById,
    deleteOtMasterById
}