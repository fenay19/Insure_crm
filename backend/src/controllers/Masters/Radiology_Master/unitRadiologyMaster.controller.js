const { UnitRadiologyMasterModel } = require('../../../models');
const Joi = require('joi');
const httpStatus = require("http-status")

const unitSchema = Joi.object({
    name: Joi.string().required(),
});

const createUnit = async (req, res) => {
    try {
        const { error } = unitSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.details[0].message });
        }

        const { name } = req.body
        const unit = new UnitRadiologyMasterModel({
            name: name,
        });
        await unit.save();
        res.status(httpStatus.CREATED).json({ msg: "Unit created!!", data: unit });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getAllUnits = async (req, res) => {
    try {
        const units = await UnitRadiologyMasterModel.find({ delete: false });
        res.status(httpStatus.OK).json({ data: units });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const getUnitById = async (req, res) => {
    try {
        const { id } = req.params
        const unit = await UnitRadiologyMasterModel.findById({ _id: id });
        if (!unit || unit.delete === true) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Unit not found' });
        }
        res.status(httpStatus.OK).json({ data: unit });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const updateUnitById = async (req, res) => {
    try {
        const { id } = req.params
        const { error } = unitSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.details[0].message });
        }

        const unit = await UnitRadiologyMasterModel.findByIdAndUpdate(
            { _id: id },
            {
                name: req.body.name,
                updatedAt: Date.now(),
            },
            { new: true },
        );

        if (!unit) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Unit not found' });
        }

        res.status(httpStatus.OK).json({ msg: "Unit updated!!", data: unit });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const deleteUnitById = async (req, res) => {
    try {
        const { id } = req.params
        const unit = await UnitRadiologyMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true });
        if (!unit) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Unit not found' });
        }
        res.status(httpStatus.OK).json({ msg: 'Unit deleted successfully' });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const bulkImport = async (req, res) => {
    try {  
        const unit = req.body;
        const result = await UnitRadiologyMasterModel.insertMany(unit);
        res.status(httpStatus.CREATED).json({ msg: "Unit Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createUnit,
    getAllUnits,
    getUnitById,
    updateUnitById,
    deleteUnitById,
    bulkImport
}

