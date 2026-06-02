const { default: mongoose } = require("mongoose");
const BankDetailsModel = require("../../../models/Masters/Banking-Details/BankingDetails.model");

const getBankDetailsController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const bankDetails = await BankDetailsModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ status: "true", data: bankDetails });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching bank details", error.message],
    });
  }
};

const postBankDetailsController = async (req, res) => {
  try {
    const {
      accountName,
      accountNumber,
      bankName,
      branchName,
      IFSCcode,
      PanNo,
      UpiId,
      QRCode,
    } = req.body;
    const { companyId } = req.query;
    if (
      !accountName ||
      !accountNumber ||
      !bankName ||
      !branchName ||
      !IFSCcode ||
      !PanNo ||
      !UpiId
    ) {
      return res.status(400).json({
        status: "false",
        message: "All fields except QRCode are required",
      });
    }

    const newBankDetail = new BankDetailsModel({
      accountName,
      companyId,
      accountNumber,
      bankName,
      branchName,
      IFSCcode,
      PanNo,
      UpiId,
      QRCode,
    });

    await newBankDetail.save();
    res.status(201).json({ status: "true", data: newBankDetail });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating bank detail", error.message],
    });
  }
};

const putBankDetailsController = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedBankDetail = await BankDetailsModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBankDetail) {
      return res.status(404).json({
        status: "false",
        message: "Bank detail not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedBankDetail });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating bank detail", error.message],
    });
  }
};

const deleteBankDetailsController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBankDetail = await BankDetailsModel.findByIdAndDelete(id);

    if (!deletedBankDetail) {
      return res.status(404).json({
        status: "false",
        message: "Bank detail not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Bank detail deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting bank detail", error.message],
    });
  }
};

module.exports = {
  getBankDetailsController,
  postBankDetailsController,
  putBankDetailsController,
  deleteBankDetailsController,
};
