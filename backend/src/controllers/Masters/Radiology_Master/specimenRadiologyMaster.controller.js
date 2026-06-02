const { SpecimenRadiologyMasterModel } = require('../../../models');
const httpStatus = require("http-status")

const Joi = require('joi');

const specimenSchema = Joi.object({
    name: Joi.string().required(),
});

const addSpecimen = async (req, res) => {
    try {
        const { error } = specimenSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.details[0].message });
        }

        const specimen = req.body;
        if (!specimen) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: "Name is required!!" })
        }

        const newSpecimen = new SpecimenRadiologyMasterModel(req.body)
        await newSpecimen.save()
        return res.status(httpStatus.OK).json({ msg: "Specimen added successfully", newSpecimen})
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "Server Error", error })
    }

}

const getAllSpecimen = async (req, res) => {
    try {
        const specimen = await SpecimenRadiologyMasterModel.find({ delete: false });
        if (specimen) {
            res.status(httpStatus.OK).json({ msg: "Specimen found successfully", specimenCount: specimen.length, specimen })
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "Server Error", error });
    }
}

const editSpecimen = async (req, res) => {
    try {
        const { id } = req.params
        const specimen = await SpecimenRadiologyMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });

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
        const specimen = await SpecimenRadiologyMasterModel.findByIdAndUpdate({ _id: id }, { delete: true, deletedAt: Date.now() }, { new: true });

        if (!specimen) {
            res.status(httpStatus.NOT_FOUND).json({ msg: "Specimen not found" })
        }
        await specimen.save()
        res.status(httpStatus.OK).json({ msg: "Specimen deleted successfully" })

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "Server Error", error });
    }
}

const getSingleSpecimen = async (req, res) => {
    try {
        const { id } = req.params
        const specimen = await SpecimenRadiologyMasterModel.findById({ _id: id });

        if (!specimen || specimen.delete === true) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: "Specimen not found!" })
        }
        res.status(httpStatus.OK).json({ msg: "Specimen found successfully!!", specimen })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "Server Error", error });
    }
}

const bulkImport = async (req, res) => {
    try {  
        const specimen = req.body;
        const result = await SpecimenRadiologyMasterModel.insertMany(specimen);
        res.status(httpStatus.CREATED).json({ msg: "Specimen Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}


module.exports = {
    addSpecimen,
    getAllSpecimen,
    editSpecimen,
    deleteSpecimen,
    getSingleSpecimen,
    bulkImport
}