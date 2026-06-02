const { RoomTypeModel, LedgerModel, SubLedgerModel } = require("../../models");
const { ConsultantModel, EmployeeModel, AdminModel } = require("../../models");
const { validationResult } = require("express-validator");
const httpStatus = require("http-status");

const createRoomType = async (req, res) => {
  try {
    const { roomType } = req.body;
    const userId = req.user.adminId;

    const user = await AdminModel.findById({ _id: userId });
    if (user.role == "admin") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() });
      }
      req.body.user = req.user.branchId;
      const existingRoomTypeMaster = await RoomTypeModel.findOne({
        roomType,
        delete: false,
      });
      if (existingRoomTypeMaster) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "Room Type already added!!" });
      }

      const room = new RoomTypeModel(req.body);
      await room.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "Room Type Added", data: room });
    } else if (user.role == "doctor") {
      const existsingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId,
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() });
      }
      req.body.user = existsingdoctor.basicDetails.user;
      const existingRoomTypeMaster = await RoomTypeModel.findOne({
        roomType,
        delete: false,
      });
      if (existingRoomTypeMaster) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "Room Type already added!!" });
      }
      const room = new RoomTypeModel(req.body);
      await room.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "Room Type Added", data: room });
    } else if (user.role !== "admin" && user.role !== "doctor") {
      const existsingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId,
      });
      // console.log(existsingEmployee);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() });
      }
      req.body.user = existsingEmployee.basicDetails.user;
      const existingRoomTypeMaster = await RoomTypeModel.findOne({
        roomType,
        delete: false,
      });
      if (existingRoomTypeMaster) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "Room Type already added!!" });
      }
      const room = new RoomTypeModel(req.body);
      await room.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "Room Type Added", data: room });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getAllRoomTypes = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const user = await AdminModel.findById({ _id: userId });
    if (user.role == "admin") {
      const roomTypes = await RoomTypeModel.find({
        delete: false,
        user: req.user.branchId,
      });
      res.status(httpStatus.OK).json({ data: roomTypes });
    } else if (user.role == "doctor") {
      const existsingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId,
      });
      const roomTypes = await RoomTypeModel.find({
        delete: false,
        user: existsingdoctor.basicDetails.user,
      });
      res.status(httpStatus.OK).json({ data: roomTypes });
    } else if (user.role !== "admin" && user.role !== "doctor") {
      const existsingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId,
      });
      const roomTypes = await RoomTypeModel.find({
        delete: false,
        user: existsingEmployee.basicDetails.user,
      });
      res.status(httpStatus.OK).json({ data: roomTypes });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getRoomTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.adminId;
    const roomType = await RoomTypeModel.findById({ _id: id, user: userId });
    if (!roomType || roomType.delete === true)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Room Type not found" });
    res.status(httpStatus.OK).json({ data: roomType });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const updateRoomTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await RoomTypeModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!roomType || roomType.delete === true)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Room Type not found" });
    res
      .status(httpStatus.OK)
      .json({ msg: "Room Type Updated!!", data: roomType });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const bulkImport = async (req, res) => {
  const userId = req.user.adminId;

  try {
    const user = await AdminModel.findById({ _id: userId });
    let userToAssign;

    if (user.role === "admin") {
      userToAssign = req.user.branchId;
    } else if (user.role === "doctor") {
      const existingDoctor = await ConsultantModel.findOne({
        _id: req.user.branchId,
      });
      userToAssign = existingDoctor.basicDetails.user;
    } else {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId,
      });
      userToAssign = existingEmployee.basicDetails.user;
    }

    const roomType = req.body;
    const newArray = [];
    for (const record of roomType) {
      if (!record.categoryName) {
          throw new Error("categoryName is required");
      }
  }
    for (const room of roomType) {
      const data = await SubLedgerModel.findOne({ subLedger: room.subLedger });

      if (!data) {
        return res.status(400).json({
          error: `'${room.subLedger}' is not found`,
        });
      }

      room.subLedgerId = data._id;
      room.ledgerId = data.ledgerId;
      room.ledger = data.ledger;
      room.subLedger = data.subLedger;
      room.user = userToAssign;  

      newArray.push({
        categoryName: room.categoryName,
  
        roomType: room.roomType,
        ledger: room.ledger,
        ledgerId: room.ledgerId,
        subLedger: room.subLedger,
        subLedgerId: room.subLedgerId,
        totalBedNo: room.totalBedNo,
        serviceGroup: room.serviceGroup,
        service: room.service,
        floorNumber: room.floorNumber,
        description: room.description,
        user: room.user,
        status: room.status,
      });
    }

    const result = await RoomTypeModel.insertMany(newArray);

    res.status(httpStatus.CREATED).json({
      msg: "New room type Package added successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
};


const deleteRoomTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await RoomTypeModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!roomType)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Room Type not found" });
    res
      .status(httpStatus.OK)
      .json({ message: "Room Type deleted successfully" });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomTypeById,
  deleteRoomTypeById,
  bulkImport,
};
