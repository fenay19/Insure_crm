const { rateMasterModel } = require('../../models');
const { ConsultantModel, EmployeeModel,AdminModel } = require('../../models');
const { validationResult } = require('express-validator');
const httpStatus = require("http-status");

const createRateMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if (user.role == "admin") {
            const {roomNo} = req.body;
            req.body.user = req.user.branchId;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const checkRoom = await rateMasterModel.findOne({roomNo, delete:false});
            if(checkRoom){
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already exists!!' });
            }
            const rateMaster = new rateMasterModel(req.body);
            await rateMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Rate Added Successfully!!", data: rateMaster });
        }else if (user.role == "doctor") {
            const existsingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
            const {roomNo} = req.body;
            req.body.user = existsingdoctor.basicDetails.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const checkRoom = await rateMasterModel.findOne({roomNo, delete:false});
            if(checkRoom){
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already exists!!' });
            }
            const rateMaster = new rateMasterModel(req.body);
            await rateMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Rate Added Successfully!!", data: rateMaster });
        }else if (user.role!== "admin" && user.role!== "doctor") {
            const existsingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const {roomNo} = req.body;
            req.body.user = existsingEmployee.basicDetails.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            const checkRoom = await rateMasterModel.findOne({roomNo, delete:false});
            if(checkRoom){
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already exists!!' });
            }
            const rateMaster = new rateMasterModel(req.body);
            await rateMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Rate Added Successfully!!", data: rateMaster });
        }
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const getAllRateMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if (user.role == "admin") {
            const rateMaster = await rateMasterModel.find({ delete: false, user:req.user.branchId });
            res.status(httpStatus.OK).json({ data: rateMaster });
        }else if (user.role == "doctor") {
            const existsingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
            const rateMaster = await rateMasterModel.find({ delete: false, user:existsingdoctor.basicDetails.user });
            res.status(httpStatus.OK).json({ data: rateMaster });
        }else if (user.role!== "admin" && user.role!== "doctor") {
            const existsingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const rateMaster = await rateMasterModel.find({ delete: false, user:existsingEmployee.basicDetails.user });
            res.status(httpStatus.OK).json({ data: rateMaster });
        }
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const getRateMasterById = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const { id } = req.params
        const rateMaster = await rateMasterModel.findById({ _id: id, user:userId });
        if (!rateMaster || rateMaster.delete === true) return res.status(httpStatus.NOT_FOUND).json({ error: 'Rate not found' });
        res.status(httpStatus.OK).json({ data: rateMaster });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const updateRateMasterById = async (req, res) => {
    try {
        const { id } = req.params
        const {roomNo} = req.body;
        const checkRoom = await rateMasterModel.findOne({roomNo, delete:false});
        if(checkRoom && checkRoom._id.toString() !== id ){
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room No. already exists!!' });
        }
        const rateMaster = await rateMasterModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!rateMaster || rateMaster.delete === true) return res.status(httpStatus.NOT_FOUND).json({ error: 'Rate  not found' });
        res.status(httpStatus.OK).json({ msg: "Rate Updated!!", data: rateMaster });
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const deleteRateMasterById = async (req, res) => {
    try {
        const { id } = req.params;
        const rateMaster = await rateMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true });
        if (!rateMaster) return res.status(httpStatus.NOT_FOUND).json({ error: 'Rate Type not found' });
        res.status(httpStatus.OK).json({ message: 'Rate deleted successfully' });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

module.exports = {
    createRateMaster,
    getAllRateMaster,
    getRateMasterById,
    updateRateMasterById,
    deleteRateMasterById,
}
