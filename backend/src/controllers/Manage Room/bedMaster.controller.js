const { bedMasterModel } = require('../../models');
const { ConsultantModel, EmployeeModel,AdminModel } = require('../../models');
const { validationResult } = require('express-validator');
const httpStatus = require("http-status");

const createBedMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const { bedNo } = req.body;
        const user = await AdminModel.findById({ _id: userId });
        if (user.role == "admin") {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            req.body.user = req.user.branchId;
            const bedMaster = new bedMasterModel(req.body);
            await bedMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Bed Added Successfully!!", data: bedMaster });
        } else if (user.role == "doctor") {
            const existsingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId});
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            req.body.user = existsingdoctor.basicDetails.user;
            
            const bedMaster = new bedMasterModel(req.body);
            await bedMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Bed Added Successfully!!", data: bedMaster });
        } else if (user.role !== "admin" && user.role!== "doctor") {
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
            }
            req.body.user = existingEmployee.basicDetails.user;
            const bedMaster = new bedMasterModel(req.body);
            await bedMaster.save();
            res.status(httpStatus.CREATED).json({ msg: "Bed Added Successfully!!", data: bedMaster });
        }
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const getAllBedMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });

        // let queryUser;
        // if (user.role === "admin") {
        //     queryUser = req.user.branchId;
        // } else if (user.role === "doctor") {
        //     const existsingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
        //     queryUser = existsingdoctor.basicDetails.user;
        // } else {
        //     const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
        //     queryUser = existingEmployee.basicDetails.user;
        // }

        const bedMaster = await bedMasterModel.find({ delete: false,  }); //user: queryUser
        console.log("Fetched Beds:", bedMaster);
        res.status(httpStatus.OK).json({ data: bedMaster });
    } catch (err) {
        console.error(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


const getBedMasterById = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const { id } = req.params
        const bedMaster = await bedMasterModel.findById({ _id: id , user:userId});
        if (!bedMaster || bedMaster.delete === true) return res.status(httpStatus.NOT_FOUND).json({ error: 'Bed not found' });
        res.status(httpStatus.OK).json({ data: bedMaster });
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const updateBedMasterById = async (req, res) => {
    try {
        const { id } = req.params
        const bedMaster = await bedMasterModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!bedMaster || bedMaster.delete === true) return res.status(httpStatus.NOT_FOUND).json({ error: 'Bed  not found' });
        res.status(httpStatus.OK).json({ msg: "Bed Updated!!", data: bedMaster });
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const deleteBedMasterById = async (req, res) => {
    try {
        const { id } = req.params;
        const bedMaster = await bedMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true });
        if (!bedMaster) return res.status(httpStatus.NOT_FOUND).json({ error: 'Bed Type not found' });
        res.status(httpStatus.OK).json({ message: 'Bed Type deleted successfully' });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

module.exports = {
    createBedMaster,
    getAllBedMaster,
    getBedMasterById,
    updateBedMasterById,
    deleteBedMasterById,
}
