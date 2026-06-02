const RoomNoModel = require('../../models/Manage Room/roomNo.model');
const RoomTypeModel = require('../../models/Manage Room/roomType.model')
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

// Create Room Number
const createRoomNo = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const { roomNo } = req.body;

        const user = await AdminModel.findById({ _id: userId });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'User not found' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
        }

        req.body.user = await getUserContext(user.role, req.user.branchId);

        const existingRoomNo = await RoomNoModel.findOne({ roomNo, delete: false });
        if (existingRoomNo) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room number already exists!' });
        }

        const roomNoEntry = new RoomNoModel(req.body);
        await roomNoEntry.save();
        res.status(httpStatus.CREATED).json({ msg: "Room number added successfully!", data: roomNoEntry });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Get All Room Numbers
const getAllRoomNos = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'User not found' });

        const userContext = await getUserContext(user.role, req.user.branchId);

        const roomNos = await RoomNoModel.find({ delete: false, user: userContext });
        res.status(httpStatus.OK).json({ data: roomNos });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Update Room Number
const updateRoomNo = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNo } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
        }

        const existingRoomNo = await RoomNoModel.findOne({ roomNo, delete: false, _id: { $ne: id } });
        if (existingRoomNo) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Room number already exists!' });
        }

        const updatedRoomNo = await RoomNoModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedRoomNo) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Room number not found!' });
        }

        res.status(httpStatus.OK).json({ msg: 'Room number updated successfully!', data: updatedRoomNo });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

// Delete Room Number
const deleteRoomNo = async (req, res) => {
    try {
        const { id } = req.params;

        const roomNo = await RoomNoModel.findByIdAndUpdate(
            id,
            { $set: { delete: true } },
            { new: true }
        );
        if (!roomNo) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Room number not found!' });
        }

        res.status(httpStatus.OK).json({ msg: 'Room number deleted successfully!', data: roomNo });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


const bulkImport = async (req, res) => {
    try {
        const roomNoData = req.body;

        if (!Array.isArray(roomNoData) || roomNoData.length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: "Invalid input data" });
        }

        // Get the user context for bulk import
        const userId = req.user.adminId;
        const user = await AdminModel.findById({ _id: userId });
        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'User not found' });

        const userContext = await getUserContext(user.role, req.user.branchId);

        // Process room data and append `user` field
        const updatedRoomNoData = await Promise.all(
            roomNoData.map(async (roomNo) => {
                const roomType = await RoomTypeModel.findOne({ roomType: roomNo.roomType.trim() });
                if (!roomType) {
                    throw new Error(`Room Type not found for name: ${roomNo.roomType}`);
                }
                return { 
                    ...roomNo, 
                    roomTypeId: roomType._id, 
                    user: userContext // Append user context
                };
            })
        );

        // Insert updated room data into the database
        const result = await RoomNoModel.insertMany(updatedRoomNoData);
        res.status(httpStatus.CREATED).json({ msg: "Rooms Created Successfully", data: result });
    } catch (error) {
        console.error("Error in bulkImport:", error.message);

        // Send appropriate error response
        if (error.message.startsWith("Room Type not found")) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};


module.exports = {
    createRoomNo,
    getAllRoomNos,
    updateRoomNo,
    deleteRoomNo,
    bulkImport
};
