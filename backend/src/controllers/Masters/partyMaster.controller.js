const { PartyMasterModel } = require("../../models");
const httpStatus = require("http-status")

const addParty = async (req, res) => {
    try {
        const { partyName,
            address,
            email,
            contact,
            gst,
            pan,
            tan,
            bankName,
            bankAccountNo,
            ifsc
        } = req.body
        const deletes = false; 
        if (!req.body) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: "Please provide all the required fields" })
        }
        const exsistingParty = await PartyMasterModel.findOne({ email, delete: deletes});
        if (exsistingParty) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: "The party with this email is already registered" })
        }
        const exsistingTan = await PartyMasterModel.findOne({ tan, delete: deletes });
        if (exsistingTan) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: "The party with this TAN number is already registered" })
        }
         
        const party = new PartyMasterModel({
            partyName,
            address,
            email,
            contact,
            gst,
            pan,
            tan,
            bankName,
            bankAccountNo,
            ifsc
        })
        await party.save()
        return res.status(httpStatus.CREATED).json({ message: "Party added successfully", party })
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error in creating a party", err })
    }
}

const editParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, tan } = req.body;
        const deletes = false; 
        const exsistingParty = await PartyMasterModel.findOne({ email, delete: deletes });
        if (exsistingParty && exsistingParty._id.toString() !== id) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'The party with this email is already exists!!' });
        }

        const exsistingTan = await PartyMasterModel.findOne({ tan, delete: deletes });
        if (exsistingTan && exsistingTan._id.toString() !== id) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: "The party with this TAN number is already registered" })
        }
        const party = await PartyMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!party) {
            return res.status(httpStatus.BAD_REQUEST).send({ msg: "Party not found" })
        }
        await party.save()
        res.status(httpStatus.OK).json({ msg: "Party details updated successfully", party });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error in updating party details", err })
    }
}

const getAllParty = async (req, res) => {
    try {
        const allParty = await PartyMasterModel.find({ delete: false })
        if (!allParty) {
            res.status(httpStatus.NOT_FOUND).json({ msg: "No party found" })
        }
        res.status(httpStatus.OK).json({ msg: "Party found successfully", partyCount: allParty.length, allParty })
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error in fetching all the party" }, err)
    }
}

const getSingleParty = async (req, res) => {
    try {
        const { id } = req.params
        const getParty = await PartyMasterModel.findById({ _id: id })
        if (!getParty || getParty.delete === true) {
            res.status(httpStatus.NOT_FOUND).json({ msg: "Can't find the party!!" })
        }
        res.status(httpStatus.OK).json({ msg: "Party found successfully!!", getParty })
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Can't fetch the party!!" })
    }
}

const deleteParty = async (req, res) => {
    try {
        const { id } = req.params
        const party = await PartyMasterModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true })

        if (!party) {
            res.status(httpStatus.NOT_FOUND).json({ message: "No party found!!" })
        }
        res.status(httpStatus.OK).json({ message: "Party deleted successfully!!" })
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Error in deleting party!!" })
    }
}

const bulkImport = async (req, res) => {
    try {  
        const party = req.body;
        const result = await PartyMasterModel.insertMany(party);
        res.status(httpStatus.CREATED).json({ msg: "Party added successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addParty,
    editParty,
    getAllParty,
    getSingleParty,
    deleteParty,
    bulkImport
}