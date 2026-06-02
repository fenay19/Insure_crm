const express = require('express');
const {createRoomNo,
    getAllRoomNos,
    updateRoomNo,
    deleteRoomNo,
    bulkImport} = require('../../controllers/Manage Room/roomNo.controller')
    const {handleToken} = require('../../utils/handleToken'); 
    const RoomNoMaster = express.Router();

    RoomNoMaster.post('/', handleToken, createRoomNo);
    RoomNoMaster.post('/import', handleToken, bulkImport);
    RoomNoMaster.get('/', handleToken, getAllRoomNos);
    RoomNoMaster.put('/:id', handleToken, updateRoomNo);
    RoomNoMaster.put('/delete/:id', handleToken, deleteRoomNo);

    module.exports = RoomNoMaster;