const CategoryMasterModel = require('../../models/Manage Room/category.modal');
const { ConsultantModel, EmployeeModel, AdminModel } = require('../../models');
const httpStatus = require("http-status");
const { validationResult } = require('express-validator');

const getUserContext = async (userRole, branchId) => {
    if (userRole === "admin") {
        return branchId;
    } else if (userRole === "doctor") {
        const doctor = await ConsultantModel.findOne({ _id: branchId });
        return doctor?.basicDetails?.user;
    } else {
        const employee = await EmployeeModel.findOne({ _id: branchId });
        return employee?.basicDetails?.user;
    }
};


const createCategoryMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const { categoryName } = req.body;

        const user = await AdminModel.findById({ _id: userId });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'User not found' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
        }

        req.body.user = await getUserContext(user.role, req.user.branchId);

        const existingCategory = await CategoryMasterModel.findOne({ categoryName, delete: false });
        if (existingCategory) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Category name already exists!' });
        }

        const categoryMaster = new CategoryMasterModel(req.body);
        await categoryMaster.save();
        res.status(httpStatus.CREATED).json({ msg: "Category added successfully!", data: categoryMaster });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Read (Get All)
const getAllCategoryMaster = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'User not found' });

        const userContext = await getUserContext(user.role, req.user.branchId);

        const categoryMasters = await CategoryMasterModel.find({ delete: false, user: userContext });
        res.status(httpStatus.OK).json({ data: categoryMasters });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const updateCategoryMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
        }

        const existingCategory = await CategoryMasterModel.findOne({ categoryName, delete: false, _id: { $ne: id } });
        if (existingCategory) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Category name already exists!' });
        }

        const updatedCategory = await CategoryMasterModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Category not found!' });
        }

        res.status(httpStatus.OK).json({ msg: 'Category updated successfully!', data: updatedCategory });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const deleteCategoryMaster = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryMasterModel.findByIdAndUpdate(
            id,
            { $set: { delete: true } },
            { new: true }
        );
        if (!category) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Category not found!' });
        }

        res.status(httpStatus.OK).json({ msg: 'Category deleted successfully!', data: category });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const bulkImport = async (req, res) => {
    try {  
        const categoryData = req.body;
        const result = await CategoryMasterModel.insertMany(categoryData);
        res.status(httpStatus.CREATED).json({ msg: "category Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createCategoryMaster,
    getAllCategoryMaster,
    updateCategoryMaster,
    deleteCategoryMaster,
    bulkImport
};
