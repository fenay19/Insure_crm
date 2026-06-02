const { BillGroupModel,LedgerModel, SubLedgerModel  } = require('../../models');
const { validationResult } = require('express-validator');
const { billGroupValidation } = require('../../validations/Masters/billGroup.validation');
const httpStatus = require("http-status")

const createBillGroup = async (req, res) => {
    const userId = req.user.adminId;
    req.body.user = userId;
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
        const billGroup = new BillGroupModel(req.body);
        await billGroup.save();
        res.status(httpStatus.CREATED).json({ msg: "Bill Group Created", data: billGroup });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getAllBillGroups = async (req, res) => {
    try {
        const userId = req.user.adminId;
        // console.log(userId);
        let billGroups = await BillGroupModel.find({ delete: false });

        // Filter stores based on conditions
        const data = [];
        billGroups = billGroups.filter(billGroup => {
            // console.log(billGroup.user);
            if (billGroup.forAll == false && billGroup.user.toString() === userId) {
                data.push(billGroup);
            } else if (billGroup.forAll == true) {
                data.push(billGroup);
            }
        });
        res.status(httpStatus.OK).json({ data: data });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getBillGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.adminId;
        const billGroup = await BillGroupModel.findById({ _id: id});
        if (!billGroup || billGroup.delete === true) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Bill Group not found' });
        }
        if (!billGroup.forAll && billGroup.user.toString() === userId) {
            res.status(httpStatus.OK).json({ data: billGroup });
        } else if (billGroup.forAll == true) {
            res.status(httpStatus.OK).json({ data: billGroup });
        }
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const updateBillGroupById = async (req, res) => {
    const { id } = req.params;
    try {
        const billGroup = await BillGroupModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!billGroup) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Bill Group not found' });
        }
        res.status(httpStatus.OK).json({ msg: "Bill Group Updated", data: billGroup });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const deleteBillGroupById = async (req, res) => {
    const { id } = req.params;
    try {
        const billGroup = await BillGroupModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now(), new: true });
        if (!billGroup) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Bill Group not found' });
        }
        res.status(httpStatus.OK).json({ msg: "Bill Group Deleted" });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const bulkImport = async (req, res) => {
    try {  
        const billGroup = req.body;
        const newArray=[];
        
    const legerData = await LedgerModel.find({delete:false})
    const subLedgerData = await SubLedgerModel.find({delete:false})
    
    for (const item of billGroup ){
        const ledger = legerData.find(l => l.ledger === item.ledger);
        if(!ledger){
            return res.status(400).json({ error: `'${item.ledger}' is not found in ledger`});
        }

        const subLedger = subLedgerData.find(sl => sl.subLedger === item.subLedger);
        if(!subLedger){
            return res.status(400).json({ error: `'${item.subLedger}' is not found in sub ledger`});
        }

        item.ledgerId = ledger._id;
        item.subLedgerId = subLedger._id;
        item.user = req.user.adminId;
        //for all 
        item.forAll = true;


        newArray.push(item);

    }
        const result = await BillGroupModel.insertMany(newArray);
        res.status(httpStatus.CREATED).json({ msg: "Bill Group Created", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createBillGroup,
    getAllBillGroups,
    getBillGroupById,
    updateBillGroupById,
    deleteBillGroupById,
    bulkImport
};