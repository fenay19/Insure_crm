const { SpecimenModel } = require("../../../models")
const Joi = require('joi');
const httpStatus = require("http-status")

const specimenSchema = Joi.object({
    name: Joi.string().required(),
});


const getAllSpecimen = async (req, res) => {
    try {
        const specimen = await SpecimenModel.find({ delete: false })
        if (!specimen) {
            res.status(httpStatus.BAD_REQUEST).json({ msg: "Specimen not found!!" })
        }
        res.status(httpStatus.OK).json({ msg: "Specimen found successfull!!", specimanCount: specimen.length, specimen })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}


const createSpecimen = async (req, res) => {
    try {
        const { error } = specimenSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.details[0].message });
        }
        const { name } = req.body
        const specimen = new SpecimenModel({
            name: name,
        })
        await specimen.save();
        res.status(httpStatus.CREATED).json({ msg: "Specimen Created", data: specimen })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}

const updateSpecimen = async (req, res) => {
    try {
        const { id } = req.params
        const specimen = await SpecimenModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });

        if (!specimen) {
            res.status(httpStatus.BAD_REQUEST).json({ msg: "Specimen not found" })
        }
        await specimen.save()
        res.status(httpStatus.OK).json({ msg: "Specimen updated successfully", specimen })

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "Server Error", error });
    }
}

const deleteSpecimen = async (req, res) => {
    try {
        const { id } = req.params
        const speciman = await SpecimenModel.findByIdAndUpdate({ _id: id }, { delete: true, deletedAt: Date.now() }, { new: true });
        if (!speciman) return res.status(httpStatus.NOT_FOUND).json({ msg: "Specimen not found!!" })
        res.status(httpStatus.OK).json({ msg: "Specimen deleted successfully!!" })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}

const bulkImport = async (req, res) => {
    try {
        const specimens = req.body;

        if (!Array.isArray(specimens) || specimens.length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid or empty data array' });
        }

        const result = await SpecimenModel.insertMany(specimens);
        res.status(httpStatus.CREATED).json({ msg: "Specimens created", data: result });
    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};


module.exports = { getAllSpecimen, createSpecimen, updateSpecimen, deleteSpecimen,bulkImport }