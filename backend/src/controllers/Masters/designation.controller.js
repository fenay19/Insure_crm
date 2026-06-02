const { DesignationModel } = require('../../models');
const { validationResult } = require('express-validator');
const httpStatus = require("http-status")

const getAllDesignation = async (req, res) => {
    try {
        const designations = await DesignationModel.find({ delete: false });

        if (designations.length === 0) {
            return res.status(httpStatus.OK).json({
                data: designations,
                nextDesignationCode: '001',
            });
        }

        const latestDesignation = await DesignationModel.findOne({ delete: false })
            .sort({ designationCode: -1 })
            .limit(1);

        const latestCodeNumber = parseInt(latestDesignation.designationCode, 10);

        const nextCode = (latestCodeNumber + 1).toString().padStart(3, '0');

        res.status(httpStatus.OK).json({
            data: designations,
            nextDesignationCode: nextCode,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
    }
};


const getDesignation = async (req, res) => {
    try {
        const { id } = req.params
        const designation = await DesignationModel.findById({ _id: id });
        if (!designation || designation.delete === true) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'No designation found' });
        }
        res.status(httpStatus.OK).json({ data: designation });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
    }
}

const addDesignation = async (req, res) => {
    try {

        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
        }

        const { designationName, designationCode, description, empRole, empRoleId, designationFunction } = req.body;
        const existingDesignation = await DesignationModel.findOne({ designationName, delete:false });
        if (existingDesignation) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'Designation name already exists' });
        }
        const newDesignation = new DesignationModel({ designationName, designationCode, description , empRole, empRoleId, designationFunction });
        await newDesignation.save();
        res.status(httpStatus.CREATED).json({ msg: 'Designation added successfully!!', designation: newDesignation });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
        console.log(error);
    }
}

const updateDesignation = async (req, res) => {
    try {
        const { designationName, designationCode, description, empRole, empRoleId, designationFunction } = req.body;
        const { id } = req.params
    
        const updateDesignation = await DesignationModel.findByIdAndUpdate(
            { _id: id },
            { designationName, designationCode, description, empRole, empRoleId, designationFunction },
            { new: true }
        );
        res.status(httpStatus.OK).json({ msg: "Designation Updated!!", designation: updateDesignation });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
        console.log(error);
    }
}

const deleteDesignationById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDesignation = await DesignationModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now() });
        if (!deletedDesignation) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Designation not found' });
        }
        res.status(httpStatus.OK).json({ msg: "Designation Deleted!!", data: deletedDesignation });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
}

const bulkImport = async (req, res) => {
    try {  
        const designationData = req.body;
        const result = await DesignationModel.insertMany(designationData);
        res.status(httpStatus.CREATED).json({ msg: "Designation Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllDesignation,
    getDesignation,
    addDesignation,
    updateDesignation,
    deleteDesignationById,
    bulkImport
}